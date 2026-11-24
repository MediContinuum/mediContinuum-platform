import {
  Activity,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  HeartPulse,
  Menu,
  Pill,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

const features = [
  {
    title: "Patient Management",
    description:
      "Organise patient profiles and relevant healthcare information in one place.",
    icon: Users,
  },
  {
    title: "Prescription Management",
    description:
      "Keep prescription information and medication instructions organised.",
    icon: ClipboardList,
  },
  {
    title: "Medication Adherence",
    description:
      "Support medication routines with structured dose schedules and tracking.",
    icon: CheckCircle2,
  },
  {
    title: "Appointment Coordination",
    description: "Keep healthcare appointments organised and accessible.",
    icon: CalendarDays,
  },
  {
    title: "Medicine Inventory",
    description:
      "Track medicine stock, low-stock levels and expiry information.",
    icon: Pill,
  },
  {
    title: "Privacy-Aware Access",
    description:
      "Support role-based access and permission-controlled family connections.",
    icon: ShieldCheck,
  },
];

function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <HeartPulse className="size-5" />
            </div>

            <span className="text-lg font-bold tracking-tight">
              MediContinuum
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link to="/" className="text-sm font-medium text-foreground">
              Home
            </Link>

            <Link
              to="/about"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              About
            </Link>

            <Link
              to="/contact"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Contact
            </Link>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              to="/login"
              className="rounded-lg px-4 py-2 text-sm font-semibold transition-colors hover:bg-muted"
            >
              Sign In
            </Link>

            <Link
              to="/register"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Get Started
            </Link>
          </div>

          <button
            type="button"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            className="rounded-lg p-2 transition-colors hover:bg-muted md:hidden"
          >
            {isMobileMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
        </div>

        {isMobileMenuOpen && (
          <nav className="border-t bg-background px-6 py-4 md:hidden">
            <div className="flex flex-col gap-4">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-medium"
              >
                Home
              </Link>

              <Link
                to="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm text-muted-foreground"
              >
                About
              </Link>

              <Link
                to="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm text-muted-foreground"
              >
                Contact
              </Link>

              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-semibold text-primary"
              >
                Sign In
              </Link>

              <Link
                to="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground"
              >
                Get Started
              </Link>
            </div>
          </nav>
        )}
      </header>

      <section className="relative overflow-hidden border-b bg-muted/20">
        <div className="pointer-events-none absolute -right-32 -top-32 size-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-32 size-96 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1.5 text-xs font-medium text-primary">
              <Activity className="size-3.5" />
              Connected Healthcare Management
            </div>

            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              A smarter way to manage your{" "}
              <span className="text-primary">healthcare journey.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground">
              MediContinuum brings patients, families and healthcare
              professionals together through organised patient information,
              prescriptions, medication schedules and healthcare workflows.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Get Started
                <ArrowRight className="size-4" />
              </Link>

              <Link
                to="/about"
                className="rounded-lg border bg-background px-5 py-3 text-sm font-semibold transition-colors hover:bg-muted"
              >
                Explore Platform
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-primary" />
                Permission-aware access
              </span>

              <span className="flex items-center gap-2">
                <HeartPulse className="size-4 text-primary" />
                Connected healthcare
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <div className="rounded-3xl border bg-card p-5 shadow-xl sm:p-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Healthcare Workspace
                  </p>
                  <h2 className="mt-1 text-xl font-bold">
                    Your health, organised
                  </h2>
                </div>

                <div className="rounded-xl bg-primary/10 p-3 text-primary">
                  <HeartPulse className="size-6" />
                </div>
              </div>

              <div className="mt-7 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-muted/60 p-4">
                  <ClipboardList className="size-5 text-primary" />
                  <p className="mt-4 text-sm font-semibold">Prescriptions</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Medication records
                  </p>
                </div>

                <div className="rounded-2xl bg-muted/60 p-4">
                  <CalendarDays className="size-5 text-primary" />
                  <p className="mt-4 text-sm font-semibold">Appointments</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Consultation planning
                  </p>
                </div>

                <div className="rounded-2xl bg-muted/60 p-4">
                  <Pill className="size-5 text-primary" />
                  <p className="mt-4 text-sm font-semibold">Medication</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Dose schedule support
                  </p>
                </div>

                <div className="rounded-2xl bg-muted/60 p-4">
                  <Users className="size-5 text-primary" />
                  <p className="mt-4 text-sm font-semibold">Family</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Connected care
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3 rounded-2xl bg-primary/10 p-4">
                <ShieldCheck className="size-6 shrink-0 text-primary" />
                <p className="text-sm leading-6 text-muted-foreground">
                  Healthcare information access is designed around user roles
                  and permissions.
                </p>
              </div>
            </div>

            <div className="absolute -bottom-5 -right-3 -z-10 size-40 rounded-full bg-primary/20 blur-2xl" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Platform Features
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Healthcare management in one connected platform
          </h2>

          <p className="mt-4 leading-7 text-muted-foreground">
            Explore tools designed to organise healthcare information and
            simplify everyday healthcare workflows.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-2xl border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-6" />
                </div>

                <h3 className="mt-5 text-lg font-semibold">{feature.title}</h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-muted/30 py-20">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <HeartPulse className="size-7" />
          </div>

          <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
            Take a more organised approach to healthcare
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-muted-foreground">
            Start exploring a connected platform for patient information,
            medication management and healthcare coordination.
          </p>

          <Link
            to="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Create Your Account
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/" className="flex items-center gap-2">
            <HeartPulse className="size-5 text-primary" />
            <span className="font-bold">MediContinuum</span>
          </Link>

          <div className="flex flex-wrap gap-5 text-sm text-muted-foreground">
            <Link to="/about" className="hover:text-foreground">
              About
            </Link>

            <Link to="/contact" className="hover:text-foreground">
              Contact
            </Link>

            <Link to="/login" className="hover:text-foreground">
              Sign In
            </Link>
          </div>

          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} MediContinuum. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}

export default LandingPage;
