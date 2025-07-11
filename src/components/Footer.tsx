import Link from "next/link";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Instagram, Youtube } from "lucide-react"; // Assuming TikTok icon isn't available, using Youtube as placeholder

const footerLinks = {
  Help: [
    { name: "FAQs", href: "#" },
    { name: "Returns and Exchanges", href: "#" },
    { name: "Contact Us", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "General Size Chart", href: "#" },
    { name: "Shipping Policy", href: "#" },
    { name: "Privacy Policy", href: "#" },
    { name: "Do Not Sell", href: "#" },
    { name: "GDPR", href: "#" },
  ],
  "Shop with us": [
    { name: "Search", href: "#" },
    { name: "All Products", href: "#" },
    { name: "Gift Card", href: "#" },
    { name: "Rewards", href: "#" },
    { name: "Shipping Protection", href: "#" },
  ],
  Explore: [
    { name: "Our Story", href: "#" },
    { name: "Customer Reviews", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Account", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Link Columns */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-semibold tracking-wider uppercase">Help</h3>
              <ul className="mt-4 space-y-2">
                {footerLinks.Help.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm text-gray-500 hover:text-gray-900">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-wider uppercase">Shop with us</h3>
              <ul className="mt-4 space-y-2">
                {footerLinks["Shop with us"].map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm text-gray-500 hover:text-gray-900">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-wider uppercase">Explore</h3>
              <ul className="mt-4 space-y-2">
                {footerLinks.Explore.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm text-gray-500 hover:text-gray-900">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter & About */}
          <div className="lg:col-span-2 grid grid-cols-1 gap-8">
            <div>
                <h3 className="text-sm font-semibold tracking-wider uppercase">Join the youngla family</h3>
                <p className="mt-4 text-sm text-gray-500">
                    Instantly receive updates, access to exclusive deals, product launch details, and more.
                </p>
                <form className="mt-4 flex gap-2">
                    <Input placeholder="Enter your email address" className="flex-1" />
                    <Button type="submit" variant="dark">Subscribe</Button>
                </form>
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-wider uppercase">About the shop</h3>
              <p className="mt-2 text-sm text-gray-500">
                  YoungLA is a lifestyle clothing brand headquartered in Los Angeles, CA. From start to finish, each product is designed with our customers and quality in mind. We take a much different approach to our products than others. Our goal is not to make products in large quantities, but rather make unique and special products that our customers can wear with pride. Any Questions? (818) 206-8764
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
            <div className="flex items-center gap-4">
                <p>© {new Date().getFullYear()} - YOUNGLA</p>
                 <div className="flex gap-4">
                    <Link href="#" aria-label="Instagram"><Instagram className="h-5 w-5"/></Link>
                    <Link href="#" aria-label="TikTok"><Youtube className="h-5 w-5"/></Link>
                </div>
            </div>
            <div className="flex gap-2 mt-4 sm:mt-0">
                {/* Payment icons placeholder */}
                <p>Payment methods</p>
            </div>
        </div>

      </div>
    </footer>
  );
} 