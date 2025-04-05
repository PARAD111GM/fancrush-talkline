import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between md:py-12">
        <div className="flex flex-col gap-2">
          <Link href="/" className="flex items-center">
            <span className="font-bold text-xl">Fancrush</span>
            <span className="ml-2 text-sm text-muted-foreground">Talkline</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            Connect with your favorite influencers through AI-powered phone calls
          </p>
        </div>
        <div className="grid grid-cols-3 gap-8 sm:grid-cols-3 md:flex md:gap-16">
          <div className="flex flex-col gap-2 text-sm">
            <p className="font-medium">Company</p>
            <Link href="/about" className="text-muted-foreground hover:text-foreground">
              About
            </Link>
            <Link href="/careers" className="text-muted-foreground hover:text-foreground">
              Careers
            </Link>
            <Link href="/contact" className="text-muted-foreground hover:text-foreground">
              Contact
            </Link>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <p className="font-medium">Product</p>
            <Link href="/influencers" className="text-muted-foreground hover:text-foreground">
              Influencers
            </Link>
            <Link href="/pricing" className="text-muted-foreground hover:text-foreground">
              Pricing
            </Link>
            <Link href="/faq" className="text-muted-foreground hover:text-foreground">
              FAQ
            </Link>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <p className="font-medium">Legal</p>
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link href="/cookies" className="text-muted-foreground hover:text-foreground">
              Cookies
            </Link>
          </div>
        </div>
      </div>
      <div className="container py-4 text-center text-sm text-muted-foreground border-t md:py-6">
        <p>© {new Date().getFullYear()} Fancrush Inc. All rights reserved.</p>
      </div>
    </footer>
  )
} 