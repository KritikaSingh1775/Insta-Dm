import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

import {
  Check,
  Github,
  Heart,
  Instagram,
  Linkedin,
  Shield,
  Sparkles,
  Twitter,
} from "lucide-react";
import { Link } from "react-router-dom";

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  return (
    <li>
      <a
        href={href}
        className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors"
      >
        <span className="inline-block transition-transform duration-300 group-hover:translate-x-3 group-hover:text-foreground">
          {children}
        </span>
        <span
          className="inline-block h-[1px] w-0 transition-[width] duration-300 group-hover:w-4 bg-gradient-to-r from-primary to-accent"
          aria-hidden
        />
      </a>
    </li>
  );
};

const SocialLink = ({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) => {
  return (
    <a
      href={href}
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-xl glass-card-hover border border-[rgba(255,255,255,.15)] bg-[rgba(255,255,255,.04)] text-muted-foreground transition-all duration-300 hover:text-foreground hover:scale-110"
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  );
};

export function Footer() {
  const productLinks = [
    ["Features", "#"],
    ["Pricing", "#pricing"],
    ["Integrations", "#"],
    ["Analytics", "#"],
    ["Automation", "#"],
    ["How it Works", "#how"],
  ] as const;

  const resourcesLinks = [
    ["Blog", "#"],
    ["Help Center", "#"],
    ["Documentation", "#"],
    ["API Reference", "#"],
    ["Case Studies", "#"],
    ["Community", "#"],
  ] as const;

  const companyLinks = [
    ["About", "#"],
    ["Careers", "#"],
    ["Contact", "#"],
    ["Partners", "#"],
    ["Privacy Policy", "/privacy"],
    ["Terms of Service", "/terms"],
  ] as const;

  return (
    <footer className="mt-10">
      <div className="relative overflow-hidden rounded-2xl">
        {/* background */}
        <div className="absolute inset-0 bg-[#6c0289]">
          <div className="absolute inset-0 bg-[radial-gradient(600px_circle_at_20%_0%,rgba(139,92,246,.35),transparent_55%),radial-gradient(600px_circle_at_90%_30%,rgba(59,130,246,.25),transparent_45%)]" />
          <div className="absolute inset-0 opacity-50 bg-[radial-gradient(900px_circle_at_10%_90%,rgba(16,185,129,.10),transparent_50%)]" />
        </div>

        {/* blur blobs */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-10 left-10 h-48 w-48 rounded-full blur-3xl bg-primary/25 animate-floatGlow" />
          <div className="absolute top-24 right-0 h-56 w-56 rounded-full blur-3xl bg-accent/20 animate-float-slow" />
          <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full blur-3xl bg-[rgba(44,123,249,0.18)]" />
        </div>

        {/* top border glow */}
        <div className="absolute left-0 right-0 top-0 h-[1px] bg-gradient-to-r from-primary via-accent to-primary opacity-80" />

        <div className="relative px-4 py-10 sm:px-6 lg:px-8">

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="container"
          >
            {/* Main grid */}
            <div className="grid gap-10 lg:grid-cols-4">
              {/* Brand */}
              <div className="lg:col-span-1">
                <Link to="/" aria-label="Athenura home" className="inline-flex items-center">
                  <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/25 to-accent/20 ring-1 ring-white/15 shadow-[0_0_0_1px_rgba(255,255,255,.06)]">
                    <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,.22),transparent_55%)]" />
                    <span className="relative">
                      <BrandLogo compact animated />
                    </span>
                  </span>
                </Link>

                <h3 className="mt-4 text-lg font-semibold text-white tracking-tight">Athenura</h3>
                <p className="mt-2 max-w-xs text-sm text-[rgba(226,232,240,.78)]">
                  Turn Instagram comments into paying customers automatically.
                </p>

                <div className="mt-5 flex items-center gap-2">
                  <SocialLink href="#" label="X / Twitter">
                    <Twitter className="h-4 w-4" />
                  </SocialLink>
                  <SocialLink href="#" label="Instagram">
                    <Instagram className="h-4 w-4" />
                  </SocialLink>
                  <SocialLink href="#" label="LinkedIn">
                    <Linkedin className="h-4 w-4" />
                  </SocialLink>
                  <SocialLink href="#" label="GitHub">
                    <Github className="h-4 w-4" />
                  </SocialLink>
                </div>
              </div>

              {/* Product */}
              <div className="lg:col-span-1">
                <h4 className="text-sm font-semibold text-white/90">Product</h4>
                <ul className="mt-5 space-y-2.5">
                  {productLinks.map(([label, href]) => (
                    <FooterLink key={label} href={href}>
                      {label}
                    </FooterLink>
                  ))}
                </ul>
              </div>

              {/* Resources */}
              <div className="lg:col-span-1">
                <h4 className="text-sm font-semibold text-white/90">Resources</h4>
                <ul className="mt-5 space-y-2.5">
                  {resourcesLinks.map(([label, href]) => (
                    <FooterLink key={label} href={href}>
                      {label}
                    </FooterLink>
                  ))}
                </ul>
              </div>

              {/* Company + Newsletter */}
              <div className="lg:col-span-1">
                <h4 className="text-sm font-semibold text-white/90">Company</h4>
                <ul className="mt-5 space-y-2.5">
                  {companyLinks.map(([label, href]) => (
                    <FooterLink key={label} href={href}>
                      {label}
                    </FooterLink>
                  ))}
                </ul>

                {/* newsletter */}
                <div className="mt-10 rounded-2xl border border-white/10 bg-[rgba(255,255,255,.04)] backdrop-blur-xl p-5">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/25 to-accent/15 ring-1 ring-white/10">
                      <Sparkles className="h-5 w-5 text-[rgba(255,255,255,.92)]" />
                    </div>
                    <div>
                      <h5 className="text-sm font-semibold text-white">Stay ahead of Instagram growth</h5>
                      <p className="mt-1 text-xs leading-relaxed text-[rgba(226,232,240,.78)]">
                        Get automation tips, growth strategies, and product updates.
                      </p>
                    </div>
                  </div>

                 
                </div>
              </div>
            </div>

            {/* trust indicators */}
            <div className="mt-12 rounded-2xl border border-white/10 bg-[rgba(255,255,255,.03)] backdrop-blur-xl p-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">


                <div className="flex items-center gap-2 text-xs text-[rgba(226,232,240,.82)]">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[rgba(16,185,129,.10)] ring-1 ring-[rgba(16,185,129,.22)]">
                    <Check className="h-4 w-4 text-[rgba(134,239,172,.95)]" />
                  </span>
                  <span>GDPR Compliant</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[rgba(226,232,240,.82)]">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[rgba(59,130,246,.10)] ring-1 ring-[rgba(59,130,246,.22)]">
                    <Shield className="h-4 w-4 text-[rgba(147,197,253,.95)]" />
                  </span>
                  <span>Secure Payments</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[rgba(226,232,240,.82)]">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[rgba(139,92,246,.10)] ring-1 ring-[rgba(139,92,246,.22)]">
                    <Sparkles className="h-4 w-4 text-[rgba(216,180,254,.95)]" />
                  </span>
                  <span>99.9% Uptime</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[rgba(226,232,240,.82)]">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[rgba(20,184,166,.10)] ring-1 ring-[rgba(20,184,166,.22)]">
                    <Check className="h-4 w-4 text-[rgba(94,234,212,.95)]" />
                  </span>
                  <span>Meta API Connected</span>
                </div>
              </div>
            </div>

            {/* divider */}
            <div className="mt-10 h-px w-full bg-white/10" />

            {/* bottom bar */}
            <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <p className="text-xs text-[rgba(226,232,240,.78)]">© {2026} Athenura. All rights reserved.</p>

              <p className="text-xs text-[rgba(226,232,240,.78)] flex items-center gap-2 justify-center md:justify-start">
                <Heart className="h-3.5 w-3.5 text-[rgba(248,113,113,.95)]" />
                Made with ❤️ for creators worldwide
              </p>

              <div className="flex items-center justify-center gap-4 text-xs text-[rgba(226,232,240,.78)]">
                <a href="/privacy" className="transition-transform duration-300 hover:translate-x-3 hover:text-white">
                  Privacy
                </a>
                <a href="/terms" className="transition-transform duration-300 hover:translate-x-3 hover:text-white">
                  Terms
                </a>
                <a href="#" className="transition-transform duration-300 hover:translate-x-3 hover:text-white">
                  Cookies
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}

