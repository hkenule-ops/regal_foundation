import { api, type DonationVerifyResponse } from "./api";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Asks the backend to verify a payment, retrying a few times because the
 * gateway can take a moment to confirm. Returns the last response (or null
 * if the backend could not be reached at all).
 */
export async function pollVerify(
  reference: string,
  attempts = 6,
  delayMs = 2500
): Promise<DonationVerifyResponse | null> {
  let last: DonationVerifyResponse | null = null;
  for (let i = 0; i < attempts; i++) {
    try {
      last = await api.verifyDonation(reference);
      if (last.status === "success") return last;
    } catch {
      /* try again */
    }
    if (i < attempts - 1) await sleep(delayMs);
  }
  return last;
}