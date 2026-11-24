import type { ReactNode } from "react";
import { motion } from "motion/react";
import { HeartPulse, ShieldCheck } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  showBranding?: boolean;
  className?: string;
}

function AuthLayout({
  children,
  title = "Welcome to MediContinuum",
  description = "Your connected healthcare platform.",
  showBranding = true,
  className = "",
}: AuthLayoutProps) {
  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-2">
      {showBranding && (
        <section className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground lg:flex xl:p-14">
          <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full border border-white/10" />
          <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full border border-white/10" />

          <div className="relative flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
              <HeartPulse className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold">MediContinuum</span>
          </div>

          <div className="relative max-w-lg space-y-5">
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="text-4xl font-bold leading-tight xl:text-5xl"
            >
              Healthcare management, connected.
            </motion.h1>

            <p className="max-w-md text-base leading-7 text-primary-foreground/80">
              Manage care, coordinate with your healthcare team, and keep
              important health information organized in one place.
            </p>

            <div className="flex items-center gap-2 pt-3 text-sm text-primary-foreground/80">
              <ShieldCheck className="h-5 w-5" />
              <span>Designed with privacy and security in mind</span>
            </div>
          </div>

          <p className="relative text-xs text-primary-foreground/60">
            © {new Date().getFullYear()} MediContinuum. All rights reserved.
          </p>
        </section>
      )}

      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className={`w-full max-w-md ${className}`}
        >
          <div className="mb-8 space-y-2 lg:hidden">
            <div className="flex items-center gap-2 text-primary">
              <HeartPulse className="h-7 w-7" />
              <span className="text-xl font-bold">MediContinuum</span>
            </div>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>

          <div className="mb-7 hidden space-y-2 lg:block">
            <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>

          {children}
        </motion.div>
      </section>
    </main>
  );
}

export default AuthLayout;
