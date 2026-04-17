import Link from "next/link";

const footerLinks = {
  Shop: [
    { href: "/shop", label: "All products" },
    { href: "/shop?category=tops", label: "Tops" },
    { href: "/shop?category=bottoms", label: "Bottoms" },
    { href: "/shop?category=dresses", label: "Dresses" },
    { href: "/shop?category=outerwear", label: "Outerwear" },
  ],
  Company: [
    { href: "/about", label: "About Tempo" },
    { href: "/about#advisors", label: "Advisory board" },
    { href: "/governance", label: "Advisor governance" },
    { href: "/accessibility", label: "Accessibility statement" },
  ],
  Resources: [
    { href: "/passport", label: "Digital Product Passport" },
    { href: "/financial-support", label: "Financial support" },
    { href: "/shipping-returns", label: "Shipping and returns" },
    { href: "/accessibility", label: "WCAG 2.1 AA compliance" },
    { href: "/credits", label: "Image credits" },
  ],
};

export function Footer() {
  return (
    <footer
      className="bg-[#1A1A1A] text-[#FAFAF7] mt-24"
      aria-label="Site footer"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <p className="font-playfair text-2xl font-bold text-[#FAFAF7] mb-3">
              Tempo
            </p>
            <p className="text-sm text-[#9A9A9A] leading-relaxed">
              Clothes that move at your pace. Adaptive fashion built with
              disabled advisors. Sustainable materials. DPP-native from day one.
            </p>
          </div>

          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[#9A9A9A] mb-4">
                {section}
              </h3>
              <ul className="flex flex-col gap-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#FAFAF7] hover:text-[#C29E5F] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-[#2A2A2A] mt-12 pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-[#9A9A9A]">
            &copy; {new Date().getFullYear()} Tempo, Desta &amp; Yishak
            Consulting. CICDC 2026.
          </p>
          <Link
            href="/accessibility"
            className="text-xs text-[#C29E5F] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded"
          >
            Accessibility statement
          </Link>
        </div>
      </div>
    </footer>
  );
}
