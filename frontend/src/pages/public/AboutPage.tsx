import {
  Activity,
  HeartPulse,
  ShieldCheck,
  Users,
  Stethoscope,
  Target,
  Globe,
} from "lucide-react";
import { Link } from "react-router";

const values = [
  {
    title: "Patient-Centred Care",
    description:
      "We aim to make healthcare information and medication management easier to access and understand.",
    icon: HeartPulse,
  },
  {
    title: "Connected Healthcare",
    description:
      "We bring patients, families and healthcare professionals together through a connected platform.",
    icon: Users,
  },
  {
    title: "Privacy and Security",
    description:
      "Healthcare information should be handled responsibly, with access controlled by appropriate permissions.",
    icon: ShieldCheck,
  },
  {
    title: "Better Coordination",
    description:
      "We aim to simplify healthcare workflows and improve coordination across healthcare activities.",
    icon: Activity,
  },
];

function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center">
          <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <HeartPulse className="size-7" />
          </div>

          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            About MediContinuum
          </p>

          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            Making healthcare more connected and accessible
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground">
            MediContinuum is a connected healthcare management platform designed
            to bring patients, families and healthcare professionals closer
            through organised healthcare information and workflows.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/contact"
              className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Contact Us
            </Link>

            <Link
              to="/"
              className="rounded-lg border px-5 py-3 text-sm font-semibold transition-colors hover:bg-muted"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Who We Are
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight">
            One platform for a more organised healthcare journey
          </h2>

          <p className="mt-5 leading-7 text-muted-foreground">
            Healthcare involves multiple people, records, appointments,
            prescriptions and medication schedules. Managing these activities
            across disconnected systems can become difficult.
          </p>

          <p className="mt-4 leading-7 text-muted-foreground">
            MediContinuum aims to provide a unified digital environment where
            authorised users can access relevant healthcare tools and
            information according to their roles and permissions.
          </p>
        </div>

        <div className="rounded-3xl border bg-card p-8 shadow-sm">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-primary/10 p-6">
              <HeartPulse className="size-8 text-primary" />
              <h3 className="mt-4 font-semibold">Patient Care</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Organised health information.
              </p>
            </div>

            <div className="rounded-2xl bg-muted p-6">
              <Stethoscope className="size-8 text-primary" />
              <h3 className="mt-4 font-semibold">Professionals</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Healthcare coordination.
              </p>
            </div>

            <div className="rounded-2xl bg-muted p-6">
              <Users className="size-8 text-primary" />
              <h3 className="mt-4 font-semibold">Family Support</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Permission-based access.
              </p>
            </div>

            <div className="rounded-2xl bg-primary/10 p-6">
              <ShieldCheck className="size-8 text-primary" />
              <h3 className="mt-4 font-semibold">Privacy</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Responsible information access.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              Our Values
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight">
              What guides MediContinuum
            </h2>

            <p className="mt-4 text-muted-foreground">
              Our platform is built around the principles of accessibility,
              coordination, privacy and responsible healthcare management.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <div
                  key={value.title}
                  className="rounded-2xl border bg-card p-6"
                >
                  <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-6" />
                  </div>

                  <h3 className="mt-5 font-semibold">{value.title}</h3>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-3xl bg-primary px-8 py-12 text-center text-primary-foreground sm:px-14">
          <Globe className="mx-auto size-9" />

          <h2 className="mt-5 text-3xl font-bold">
            Healthcare that stays connected
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 opacity-90">
            Explore MediContinuum and discover a more organised way to
            coordinate healthcare activities.
          </p>

          <Link
            to="/contact"
            className="mt-7 inline-flex rounded-lg bg-background px-5 py-3 text-sm font-semibold text-foreground transition-opacity hover:opacity-90"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </main>
  );
}

export default AboutPage;
