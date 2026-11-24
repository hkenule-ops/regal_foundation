import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-regal-navy text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-regal-gold text-sm font-bold text-regal-navy">
                RF
              </div>
              <span className="font-bold">Regal Foundation</span>
            </div>
            <p className="text-sm text-white/70">
              Bringing free healthcare, nutrition, and education support to underserved communities across Nigeria.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-regal-gold">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li><Link href="/about" className="hover:text-regal-gold">About Us</Link></li>
              <li><Link href="/programs" className="hover:text-regal-gold">Programs</Link></li>
              <li><Link href="/missions" className="hover:text-regal-gold">Missions & Impact</Link></li>
              <li><Link href="/stories" className="hover:text-regal-gold">Field Stories</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-regal-gold">
              Get Involved
            </h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li><Link href="/get-involved/donate" className="hover:text-regal-gold">Donate Funds</Link></li>
              <li><Link href="/get-involved/volunteer" className="hover:text-regal-gold">Volunteer</Link></li>
              <li><Link href="/get-involved/partner" className="hover:text-regal-gold">Corporate / In-Kind</Link></li>
              <li><Link href="/get-involved/nominate" className="hover:text-regal-gold">Nominate a Community</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-regal-gold">
              Contact
            </h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>Port Harcourt & Abuja</li>
              <li>
                <a href="mailto:info@regalfoundation.org" className="hover:text-regal-gold">
                  info@regalfoundation.org
                </a>
              </li>
              <li>
                <Link href="/contact" className="hover:text-regal-gold">Contact Form →</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/50">
          © {new Date().getFullYear()} Regal Plastic Surgery Centre Foundation. All rights reserved.
          <span className="mx-2">·</span>
          Humanitarian arm of Regal Plastic Surgery Centre
        </div>
      </div>
    </footer>
  );
}
