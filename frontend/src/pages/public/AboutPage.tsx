import {
  Activity,
  ArrowRight,
  BellRing,
  CalendarCheck,
  Check,
  ClipboardList,
  FileText,
  HeartPulse,
  Lock,
  Minus,
  Pill,
  ShieldCheck,
  Stethoscope,
  UserRound,
  Users,
} from "lucide-react";
import { Link } from "react-router";

/* ---------- Design tokens ---------- */
const c = {
  navy: "#0B2545", // headings, dark sections
  blue: "#1769E0", // primary action
  blueDark: "#0F52B6",
  sky: "#EAF3FF", // light tint
  soft: "#F5F9FF", // page tint
  teal: "#12A594", // "healthy / ok" accent
  tealSoft: "#DDF6F1",
  text: "#44566C",
  line: "#DCE6F2",
  coral: "#F26B5B", // heartbeat + alerts only
};

const font = "'Plus Jakarta Sans', 'Segoe UI', system-ui, sans-serif";

/* ---------- Content ---------- */
const quickFeatures = [
  {
    title: "Medication management",
    text: "Schedules, doses and reminders in one place.",
    icon: Pill,
  },
  {
    title: "Appointments",
    text: "Visits and follow-ups everyone can see.",
    icon: CalendarCheck,
  },
  {
    title: "Prescriptions",
    text: "Track renewals and keep them in sync.",
    icon: ClipboardList,
  },
  {
    title: "Health records",
    text: "Organised information, easy to find.",
    icon: FileText,
  },
];

const audiences = [
  {
    title: "For patients",
    icon: UserRound,
    text: "Stay on top of your own care without juggling notes, papers and separate apps.",
    points: [
      "See medications and appointments together",
      "Choose who can view your information",
      "Keep follow-ups from slipping",
    ],
  },
  {
    title: "For families",
    icon: Users,
    text: "Support someone you care for with the access they have agreed to share.",
    points: [
      "Permission-based access",
      "Shared view of schedules",
      "Stay informed about upcoming care",
    ],
  },
  {
    title: "For professionals",
    icon: Stethoscope,
    text: "Coordinate care activities using relevant, well-organised patient information.",
    points: [
      "Role-based tools and access",
      "Simpler care workflows",
      "Fewer disconnected systems",
    ],
  },
];

const steps = [
  {
    title: "Create a profile",
    text: "Set up the patient's health information in one secure place.",
  },
  {
    title: "Connect the care team",
    text: "Invite family members and healthcare professionals.",
  },
  {
    title: "Set permissions",
    text: "Decide who can see and manage each type of information.",
  },
  {
    title: "Stay coordinated",
    text: "Schedules, prescriptions and follow-ups stay aligned.",
  },
];

const values = [
  {
    title: "Patient-centred care",
    text: "Health information and medication management should be easy to access and understand.",
    icon: HeartPulse,
  },
  {
    title: "Connected healthcare",
    text: "Patients, families and professionals work from the same up-to-date picture.",
    icon: Users,
  },
  {
    title: "Privacy and security",
    text: "Information is handled responsibly, with access controlled by permissions.",
    icon: ShieldCheck,
  },
  {
    title: "Better coordination",
    text: "Simpler workflows mean fewer missed steps across healthcare activities.",
    icon: Activity,
  },
];

const roles = ["Patient", "Family", "Professional"] as const;
const access: { item: string; allowed: [boolean, boolean, boolean] }[] = [
  { item: "Medication schedule", allowed: [true, true, true] },
  { item: "Appointments", allowed: [true, true, true] },
  { item: "Prescriptions", allowed: [true, false, true] },
  { item: "Clinical notes", allowed: [true, false, true] },
];

/* ---------- Small pieces ---------- */
function SectionHeading({
  title,
  text,
  light = false,
  center = false,
}: {
  title: string;
  text?: string;
  light?: boolean;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <h2
        className="text-3xl leading-tight font-extrabold tracking-tight sm:text-4xl lg:text-5xl"
        style={{ color: light ? "#fff" : c.navy }}
      >
        {title}
      </h2>
      {text && (
        <p
          className="mt-4 text-base leading-7 sm:text-lg"
          style={{ color: light ? "#B9CCE6" : c.text }}
        >
          {text}
        </p>
      )}
    </div>
  );
}

/* Illustrative product preview shown in the hero */
function DashboardPreview() {
  const meds = [
    { name: "Metformin 500 mg", time: "8:00 AM", done: true },
    { name: "Atorvastatin 20 mg", time: "1:00 PM", done: true },
    { name: "Lisinopril 10 mg", time: "8:00 PM", done: false },
  ];

  return (
    <div className="relative mx-auto w-full max-w-xl">
      {/* soft glow */}
      <div
        className="absolute -inset-6 -z-10 rounded-[2.5rem] blur-2xl"
        style={{
          background: "linear-gradient(135deg, #CFE3FF 0%, #D5F4EC 100%)",
        }}
      />

      <div
        className="w-full overflow-hidden rounded-3xl bg-white shadow-xl"
        style={{ border: `1px solid ${c.line}` }}
      >
        {/* window header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{
            borderBottom: `1px solid ${c.line}`,
            backgroundColor: c.soft,
          }}
        >
          <div className="flex items-center gap-3">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
              style={{ backgroundColor: c.blue }}
            >
              SM
            </span>
            <div>
              <p className="text-sm font-bold" style={{ color: c.navy }}>
                Sample patient
              </p>
              <p className="text-xs" style={{ color: c.text }}>
                Care plan overview
              </p>
            </div>
          </div>
          <span
            className="rounded-full px-3 py-1 text-xs font-semibold"
            style={{ backgroundColor: c.tealSoft, color: "#0B7A6D" }}
          >
            Illustrative preview
          </span>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          {/* summary tiles */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Next dose", value: "8:00 PM", icon: Pill },
              { label: "Appointment", value: "Tue 10:30", icon: CalendarCheck },
              { label: "Refill due", value: "In 5 days", icon: ClipboardList },
            ].map((t) => {
              const Icon = t.icon;
              return (
                <div
                  key={t.label}
                  className="rounded-2xl p-3"
                  style={{ backgroundColor: c.sky }}
                >
                  <Icon className="h-4 w-4" style={{ color: c.blue }} />
                  <p
                    className="mt-2 text-[11px] font-medium"
                    style={{ color: c.text }}
                  >
                    {t.label}
                  </p>
                  <p className="text-sm font-bold" style={{ color: c.navy }}>
                    {t.value}
                  </p>
                </div>
              );
            })}
          </div>

          {/* medication list + adherence ring */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
            <div className="space-y-2.5 sm:col-span-3">
              <p
                className="text-xs font-bold tracking-wide"
                style={{ color: c.text }}
              >
                Today’s medication
              </p>
              {meds.map((m) => (
                <div
                  key={m.name}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5"
                  style={{ border: `1px solid ${c.line}` }}
                >
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: m.done ? c.teal : "transparent",
                      border: m.done ? "none" : `2px solid ${c.line}`,
                      color: "#fff",
                    }}
                  >
                    {m.done && <Check className="h-3.5 w-3.5" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p
                      className="truncate text-sm font-semibold"
                      style={{ color: c.navy }}
                    >
                      {m.name}
                    </p>
                  </div>
                  <span className="text-xs" style={{ color: c.text }}>
                    {m.time}
                  </span>
                </div>
              ))}
            </div>

            <div
              className="flex flex-col items-center justify-center rounded-2xl p-4 sm:col-span-2"
              style={{ backgroundColor: c.soft, border: `1px solid ${c.line}` }}
            >
              <svg
                viewBox="0 0 90 90"
                className="h-24 w-24 -rotate-90"
                aria-hidden="true"
              >
                <circle
                  cx="45"
                  cy="45"
                  r="36"
                  fill="none"
                  stroke={c.line}
                  strokeWidth="9"
                />
                <circle
                  cx="45"
                  cy="45"
                  r="36"
                  fill="none"
                  stroke={c.teal}
                  strokeWidth="9"
                  strokeLinecap="round"
                  strokeDasharray="170 226"
                />
              </svg>
              <p
                className="mt-2 text-center text-xs font-semibold"
                style={{ color: c.navy }}
              >
                Doses on track
              </p>
              <p className="text-center text-[11px]" style={{ color: c.text }}>
                Sample data
              </p>
            </div>
          </div>

          {/* heartbeat strip */}
          <svg
            viewBox="0 0 400 40"
            preserveAspectRatio="none"
            className="h-8 w-full"
            aria-hidden="true"
          >
            <path
              d="M0 20 H130 L145 20 L155 6 L170 34 L182 12 L190 20 H400"
              fill="none"
              stroke={c.coral}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      </div>

      {/* floating chips */}
      <div
        className="absolute -top-5 -right-3 hidden items-center gap-2.5 rounded-2xl bg-white px-4 py-3 shadow-lg sm:flex"
        style={{ border: `1px solid ${c.line}` }}
      >
        <span
          className="flex h-9 w-9 items-center justify-center rounded-full"
          style={{ backgroundColor: c.sky, color: c.blue }}
        >
          <Users className="h-4 w-4" />
        </span>
        <div>
          <p className="text-xs font-bold" style={{ color: c.navy }}>
            Family access
          </p>
          <p className="text-[11px]" style={{ color: c.text }}>
            Shared by patient
          </p>
        </div>
      </div>

      <div
        className="absolute -bottom-5 -left-3 hidden items-center gap-2.5 rounded-2xl bg-white px-4 py-3 shadow-lg sm:flex"
        style={{ border: `1px solid ${c.line}` }}
      >
        <span
          className="flex h-9 w-9 items-center justify-center rounded-full"
          style={{ backgroundColor: c.tealSoft, color: "#0B7A6D" }}
        >
          <BellRing className="h-4 w-4" />
        </span>
        <div>
          <p className="text-xs font-bold" style={{ color: c.navy }}>
            Reminder set
          </p>
          <p className="text-[11px]" style={{ color: c.text }}>
            Evening dose, 8:00 PM
          </p>
        </div>
      </div>
    </div>
  );
}

function AboutPage() {
  return (
    <main
      className="w-full overflow-x-hidden text-left"
      style={{ backgroundColor: "#fff", color: c.navy, fontFamily: font }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
      `}</style>

      {/* ================= HERO ================= */}
      <section
        className="relative w-full"
        style={{
          background:
            "radial-gradient(1200px 500px at 85% -10%, #DCEBFF 0%, rgba(220,235,255,0) 60%), radial-gradient(900px 450px at -5% 110%, #DDF6F1 0%, rgba(221,246,241,0) 60%), #F5F9FF",
          borderBottom: `1px solid ${c.line}`,
        }}
      >
        <div className="grid w-full grid-cols-1 items-center gap-16 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:gap-12 lg:px-12 lg:py-24">
          <div>
            <span
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-sm"
              style={{ color: c.blue, border: `1px solid ${c.line}` }}
            >
              <HeartPulse className="h-4 w-4" />
              About MediContinuum
            </span>

            <h1
              className="mt-6 text-4xl leading-[1.08] font-extrabold tracking-tight sm:text-5xl xl:text-6xl"
              style={{ color: c.navy }}
            >
              One connected place for patients, families and care teams
            </h1>

            <p
              className="mt-6 max-w-xl text-base leading-7 sm:text-lg"
              style={{ color: c.text }}
            >
              MediContinuum is a connected healthcare management platform. It
              organises health information and workflows so the people involved
              in someone’s care stay in step.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold text-white shadow-md transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                style={{ backgroundColor: c.blue }}
              >
                Contact us
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/"
                className="inline-flex items-center rounded-full bg-white px-7 py-3.5 text-sm font-bold transition hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                style={{ color: c.navy, border: `1px solid ${c.line}` }}
              >
                Back to home
              </Link>
            </div>

            <ul className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                "Role-based access",
                "Medication reminders",
                "Family sharing",
              ].map((t) => (
                <li
                  key={t}
                  className="flex items-center gap-2 text-sm font-semibold"
                  style={{ color: c.navy }}
                >
                  <span
                    className="flex h-6 w-6 items-center justify-center rounded-full"
                    style={{ backgroundColor: c.tealSoft, color: "#0B7A6D" }}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <DashboardPreview />
        </div>
      </section>

      {/* ================= QUICK FEATURES ================= */}
      <section className="w-full bg-white">
        <div className="w-full px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
          <SectionHeading
            center
            title="Everything in a care journey, organised"
            text="The tools patients, families and professionals use every day, connected in one platform."
          />
          <div className="mt-12 grid w-full grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {quickFeatures.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="rounded-3xl p-6 transition hover:-translate-y-1 hover:shadow-lg"
                  style={{
                    backgroundColor: c.soft,
                    border: `1px solid ${c.line}`,
                  }}
                >
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-2xl text-white"
                    style={{ backgroundColor: c.blue }}
                  >
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3
                    className="mt-5 text-lg font-bold"
                    style={{ color: c.navy }}
                  >
                    {f.title}
                  </h3>
                  <p
                    className="mt-2 text-sm leading-6"
                    style={{ color: c.text }}
                  >
                    {f.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= WHO IT'S FOR ================= */}
      <section
        className="w-full"
        style={{ backgroundColor: c.soft, borderBlock: `1px solid ${c.line}` }}
      >
        <div className="w-full px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
          <SectionHeading
            title="Built for everyone involved in care"
            text="Each person sees the tools and information that fit their role."
          />
          <div className="mt-12 grid w-full grid-cols-1 gap-6 lg:grid-cols-3">
            {audiences.map((a) => {
              const Icon = a.icon;
              return (
                <article
                  key={a.title}
                  className="flex flex-col rounded-3xl bg-white p-8"
                  style={{ border: `1px solid ${c.line}` }}
                >
                  <span
                    className="flex h-14 w-14 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: c.sky, color: c.blue }}
                  >
                    <Icon className="h-7 w-7" />
                  </span>
                  <h3
                    className="mt-6 text-2xl font-bold"
                    style={{ color: c.navy }}
                  >
                    {a.title}
                  </h3>
                  <p
                    className="mt-3 text-base leading-7"
                    style={{ color: c.text }}
                  >
                    {a.text}
                  </p>
                  <ul
                    className="mt-6 space-y-3 pt-6"
                    style={{ borderTop: `1px solid ${c.line}` }}
                  >
                    {a.points.map((p) => (
                      <li
                        key={p}
                        className="flex items-start gap-3 text-sm font-medium"
                        style={{ color: c.navy }}
                      >
                        <Check
                          className="mt-0.5 h-4 w-4 shrink-0"
                          style={{ color: c.teal }}
                        />
                        {p}
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS (a real sequence) ================= */}
      <section className="w-full bg-white">
        <div className="w-full px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
          <SectionHeading
            center
            title="How MediContinuum works"
            text="From the first profile to coordinated care, in four steps."
          />

          <ol className="relative mt-14 grid w-full grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
            <div
              className="absolute top-6 right-[12.5%] left-[12.5%] hidden h-0.5 xl:block"
              style={{ backgroundColor: c.line }}
              aria-hidden="true"
            />
            {steps.map((s, i) => (
              <li key={s.title} className="relative text-center">
                <span
                  className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-full text-lg font-extrabold text-white shadow-md"
                  style={{
                    backgroundColor: i === steps.length - 1 ? c.teal : c.blue,
                  }}
                >
                  {i + 1}
                </span>
                <h3
                  className="mt-5 text-lg font-bold"
                  style={{ color: c.navy }}
                >
                  {s.title}
                </h3>
                <p
                  className="mx-auto mt-2 max-w-xs text-sm leading-6"
                  style={{ color: c.text }}
                >
                  {s.text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ================= PRIVACY ================= */}
      <section className="w-full" style={{ backgroundColor: c.navy }}>
        <div className="grid w-full grid-cols-1 items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-12 lg:gap-16 lg:px-12 lg:py-24">
          <div className="lg:col-span-5">
            <span
              className="flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{ backgroundColor: "#16376A", color: "#8FC0FF" }}
            >
              <Lock className="h-7 w-7" />
            </span>
            <div className="mt-6">
              <SectionHeading
                light
                title="Privacy comes first"
                text="Healthcare information should be handled responsibly. MediContinuum controls access by role and permission, so people see only what is relevant to them."
              />
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="w-full overflow-hidden rounded-3xl bg-white">
              <div
                className="px-6 py-5 sm:px-8"
                style={{
                  backgroundColor: c.sky,
                  borderBottom: `1px solid ${c.line}`,
                }}
              >
                <p className="text-lg font-bold" style={{ color: c.navy }}>
                  Who can see what
                </p>
                <p className="mt-1 text-sm" style={{ color: c.text }}>
                  Example of a permission setup
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[460px] text-left text-sm">
                  <thead>
                    <tr style={{ color: c.text }}>
                      <th className="px-6 py-4 font-semibold sm:px-8">
                        Information
                      </th>
                      {roles.map((r) => (
                        <th
                          key={r}
                          className="px-3 py-4 text-center font-semibold"
                        >
                          {r}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {access.map((row) => (
                      <tr
                        key={row.item}
                        style={{ borderTop: `1px solid ${c.line}` }}
                      >
                        <td
                          className="px-6 py-4 font-semibold sm:px-8"
                          style={{ color: c.navy }}
                        >
                          {row.item}
                        </td>
                        {row.allowed.map((ok, i) => (
                          <td key={i} className="px-3 py-4 text-center">
                            <span
                              className="inline-flex h-7 w-7 items-center justify-center rounded-full"
                              style={{
                                backgroundColor: ok ? c.tealSoft : c.soft,
                                color: ok ? "#0B7A6D" : "#9BB0C6",
                              }}
                              aria-label={ok ? "Has access" : "No access"}
                            >
                              {ok ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <Minus className="h-4 w-4" />
                              )}
                            </span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= VALUES ================= */}
      <section className="w-full bg-white">
        <div className="w-full px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
          <SectionHeading
            title="What guides MediContinuum"
            text="Four principles shape every part of the platform."
          />
          <div className="mt-12 grid w-full grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <article
                  key={v.title}
                  className="rounded-3xl p-7"
                  style={{
                    backgroundColor: c.soft,
                    border: `1px solid ${c.line}`,
                  }}
                >
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-full"
                    style={{ backgroundColor: c.tealSoft, color: "#0B7A6D" }}
                  >
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3
                    className="mt-5 text-lg font-bold"
                    style={{ color: c.navy }}
                  >
                    {v.title}
                  </h3>
                  <p
                    className="mt-2 text-sm leading-6"
                    style={{ color: c.text }}
                  >
                    {v.text}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="w-full px-5 pb-16 sm:px-8 lg:px-12 lg:pb-24">
        <div
          className="flex w-full flex-col justify-between gap-8 rounded-[2rem] p-8 sm:p-12 lg:flex-row lg:items-center"
          style={{
            background: `linear-gradient(120deg, ${c.blue} 0%, ${c.blueDark} 60%, #0B7A6D 140%)`,
          }}
        >
          <div className="max-w-2xl text-white">
            <h2 className="text-3xl leading-tight font-extrabold tracking-tight sm:text-4xl">
              Healthcare that stays connected
            </h2>
            <p
              className="mt-3 text-base leading-7 sm:text-lg"
              style={{ color: "#DCE9FF" }}
            >
              Talk to us and see a more organised way to coordinate healthcare
              activities.
            </p>
          </div>
          <Link
            to="/contact"
            className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-full bg-white px-8 py-4 text-sm font-bold transition hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:self-auto"
            style={{ color: c.blueDark }}
          >
            Get in touch
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}

export default AboutPage;
