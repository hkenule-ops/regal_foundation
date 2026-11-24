from datetime import datetime, timezone
from typing import Optional, List
from fastapi import APIRouter, HTTPException, status, Depends, Query, Request
from bson import ObjectId
import secrets
import httpx
from app.models.schemas import (
    DonationInitiate,
    DonationResponse,
    DonationPublic,
    PaymentStatus,
    MessageResponse,
)
from app.core.security import get_current_admin
from app.core.database import get_database
from app.core.config import get_settings

router = APIRouter(prefix="/donations", tags=["Donations"])
settings = get_settings()


def generate_reference() -> str:
    return f"RF-{secrets.token_hex(8).upper()}"


def serialize_donation(doc: dict, include_sensitive: bool = True) -> dict:
    data = {
        "id": str(doc["_id"]),
        "reference": doc["reference"],
        "amount": doc["amount"],
        "currency": doc.get("currency", "NGN"),
        "category": doc["category"],
        "donor_name": doc["donor_name"] if not doc.get("is_anonymous") else "Anonymous",
        "is_anonymous": doc.get("is_anonymous", False),
        "status": doc.get("status", "pending"),
        "gateway": doc.get("gateway", "paystack"),
        "created_at": doc["created_at"],
        "paid_at": doc.get("paid_at"),
        "message": doc.get("message"),
    }
    if include_sensitive:
        data["donor_email"] = doc["donor_email"]
        data["donor_phone"] = doc.get("donor_phone")
    return data


@router.post("/initiate", status_code=status.HTTP_201_CREATED)
async def initiate_donation(donation_in: DonationInitiate):
    """
    Create a pending donation and return payment initialization data
    for Paystack or Flutterwave.
    """
    db = get_database()
    reference = generate_reference()
    now = datetime.now(timezone.utc)

    doc = {
        "reference": reference,
        "amount": donation_in.amount,
        "currency": donation_in.currency.upper(),
        "category": donation_in.category.value,
        "donor_name": donation_in.donor_name,
        "donor_email": donation_in.donor_email.lower(),
        "donor_phone": donation_in.donor_phone,
        "is_anonymous": donation_in.is_anonymous,
        "message": donation_in.message,
        "gateway": donation_in.gateway.lower(),
        "status": PaymentStatus.PENDING.value,
        "created_at": now,
        "paid_at": None,
        "gateway_response": None,
    }
    result = await db.donations.insert_one(doc)
    doc["_id"] = result.inserted_id

    # Build gateway-specific init payload
    callback_url = f"{settings.FRONTEND_URL}/donate/callback?reference={reference}"

    if donation_in.gateway.lower() == "paystack":
        # Amount in kobo for NGN
        amount_subunit = int(donation_in.amount * 100) if donation_in.currency.upper() == "NGN" else int(donation_in.amount * 100)
        init_payload = {
            "email": donation_in.donor_email,
            "amount": amount_subunit,
            "currency": donation_in.currency.upper(),
            "reference": reference,
            "callback_url": callback_url,
            "metadata": {
                "category": donation_in.category.value,
                "donor_name": donation_in.donor_name,
                "custom_fields": [
                    {"display_name": "Category", "variable_name": "category", "value": donation_in.category.value}
                ],
            },
        }
        # In production, call Paystack API here and return authorization_url
        # For now return the payload the frontend can use with Paystack Inline or redirect
        return {
            "donation_id": str(result.inserted_id),
            "reference": reference,
            "gateway": "paystack",
            "public_key": settings.PAYSTACK_PUBLIC_KEY,
            "amount": donation_in.amount,
            "currency": donation_in.currency,
            "email": donation_in.donor_email,
            "callback_url": callback_url,
            "init_payload": init_payload,
            "message": "Use the public_key and reference with Paystack Inline JS or call /donations/verify after payment.",
        }

    else:  # flutterwave
        return {
            "donation_id": str(result.inserted_id),
            "reference": reference,
            "gateway": "flutterwave",
            "public_key": settings.FLUTTERWAVE_PUBLIC_KEY,
            "amount": donation_in.amount,
            "currency": donation_in.currency,
            "email": donation_in.donor_email,
            "customer": {
                "email": donation_in.donor_email,
                "name": donation_in.donor_name,
                "phone_number": donation_in.donor_phone or "",
            },
            "callback_url": callback_url,
            "customizations": {
                "title": "Regal Foundation Donation",
                "description": f"Support: {donation_in.category.value.replace('_', ' ').title()}",
            },
            "message": "Use Flutterwave checkout with the provided public_key and reference.",
        }


@router.get("/verify/{reference}")
async def verify_donation(reference: str):
    """
    Verify a donation payment with the gateway and update status.
    Call this after the user completes payment (frontend callback or webhook).
    """
    db = get_database()
    doc = await db.donations.find_one({"reference": reference})
    if not doc:
        raise HTTPException(status_code=404, detail="Donation not found")

    if doc["status"] == PaymentStatus.SUCCESS.value:
        return {
            "status": "success",
            "message": "Payment already verified",
            "donation": serialize_donation(doc),
        }

    gateway = doc.get("gateway", "paystack")
    verified = False
    gateway_data = None

    if gateway == "paystack" and settings.PAYSTACK_SECRET_KEY:
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                f"https://api.paystack.co/transaction/verify/{reference}",
                headers={"Authorization": f"Bearer {settings.PAYSTACK_SECRET_KEY}"},
            )
            if resp.status_code == 200:
                data = resp.json()
                if data.get("status") and data.get("data", {}).get("status") == "success":
                    verified = True
                    gateway_data = data.get("data")
    elif gateway == "flutterwave" and settings.FLUTTERWAVE_SECRET_KEY:
        # Flutterwave verification uses transaction_id usually; reference works for some setups
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                f"https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref={reference}",
                headers={"Authorization": f"Bearer {settings.FLUTTERWAVE_SECRET_KEY}"},
            )
            if resp.status_code == 200:
                data = resp.json()
                if data.get("status") == "success" and data.get("data", {}).get("status") == "successful":
                    verified = True
                    gateway_data = data.get("data")

    if verified:
        now = datetime.now(timezone.utc)
        await db.donations.update_one(
            {"_id": doc["_id"]},
            {
                "$set": {
                    "status": PaymentStatus.SUCCESS.value,
                    "paid_at": now,
                    "gateway_response": gateway_data,
                    "updated_at": now,
                }
            },
        )
        doc["status"] = PaymentStatus.SUCCESS.value
        doc["paid_at"] = now
        # TODO: send email receipt here
        return {
            "status": "success",
            "message": "Payment verified successfully. Thank you for your support!",
            "donation": serialize_donation(doc),
        }

    return {
        "status": "pending",
        "message": "Payment not yet confirmed. If you have completed payment, please wait a moment and try again.",
        "donation": serialize_donation(doc),
    }


@router.post("/webhook/paystack")
async def paystack_webhook(request: Request):
    """Receive Paystack webhook events (configure in Paystack dashboard)."""
    # In production: verify signature with PAYSTACK_SECRET_KEY
    payload = await request.json()
    event = payload.get("event")
    data = payload.get("data", {})

    if event == "charge.success":
        reference = data.get("reference")
        if reference:
            db = get_database()
            await db.donations.update_one(
                {"reference": reference, "status": PaymentStatus.PENDING.value},
                {
                    "$set": {
                        "status": PaymentStatus.SUCCESS.value,
                        "paid_at": datetime.now(timezone.utc),
                        "gateway_response": data,
                    }
                },
            )
    return {"status": "ok"}


@router.get("/recent", response_model=List[DonationPublic])
async def recent_donations(limit: int = Query(10, ge=1, le=50)):
    """Public: recent successful donations (anonymized where requested)."""
    db = get_database()
    cursor = (
        db.donations.find({"status": PaymentStatus.SUCCESS.value})
        .sort("paid_at", -1)
        .limit(limit)
    )
    results = []
    async for doc in cursor:
        name = "Anonymous" if doc.get("is_anonymous") else doc["donor_name"]
        results.append(
            DonationPublic(
                amount=doc["amount"],
                currency=doc.get("currency", "NGN"),
                category=doc["category"],
                donor_name=name,
                is_anonymous=doc.get("is_anonymous", False),
                message=doc.get("message"),
                paid_at=doc.get("paid_at"),
            )
        )
    return results


@router.get("", response_model=List[DonationResponse])
async def list_donations(
    status_filter: Optional[PaymentStatus] = Query(None, alias="status"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    current_admin: dict = Depends(get_current_admin),
):
    """Admin: full donation ledger."""
    db = get_database()
    query = {}
    if status_filter:
        query["status"] = status_filter.value
    cursor = db.donations.find(query).sort("created_at", -1).skip(skip).limit(limit)
    results = []
    async for doc in cursor:
        results.append(DonationResponse(**serialize_donation(doc)))
    return results


@router.get("/stats")
async def donation_stats(current_admin: dict = Depends(get_current_admin)):
    db = get_database()
    pipeline = [
        {"$match": {"status": PaymentStatus.SUCCESS.value}},
        {
            "$group": {
                "_id": "$category",
                "total_amount": {"$sum": "$amount"},
                "count": {"$sum": 1},
            }
        },
    ]
    by_category = []
    async for row in db.donations.aggregate(pipeline):
        by_category.append(
            {
                "category": row["_id"],
                "total_amount": row["total_amount"],
                "count": row["count"],
            }
        )
    total = await db.donations.aggregate(
        [
            {"$match": {"status": PaymentStatus.SUCCESS.value}},
            {"$group": {"_id": None, "total": {"$sum": "$amount"}, "count": {"$sum": 1}}},
        ]
    ).to_list(1)
    return {
        "total_raised": total[0]["total"] if total else 0,
        "total_donations": total[0]["count"] if total else 0,
        "by_category": by_category,
    }
