import { useState, type FormEvent } from "react";
import { Mail, MapPin, MessageSquare, Phone, Send } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router";

function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    toast.info("Contact form backend integration is not configured yet.");
  }

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 py-16 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Contact Us
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight">
            Let's start a conversation
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Have a question or want to learn more about MediContinuum? We'd be
            happy to hear from you.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <h2 className="text-2xl font-bold">Get in touch</h2>

          <p className="mt-3 leading-7 text-muted-foreground">
            Use the contact form to share your enquiry. Contact details
            displayed here should be replaced with your organisation's verified
            information before production.
          </p>

          <div className="mt-8 space-y-5">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-primary/10 p-3 text-primary">
                <Mail className="size-5" />
              </div>

              <div>
                <h3 className="font-semibold">Email</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add your official support email
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-primary/10 p-3 text-primary">
                <Phone className="size-5" />
              </div>

              <div>
                <h3 className="font-semibold">Phone</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add your official contact number
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-primary/10 p-3 text-primary">
                <MapPin className="size-5" />
              </div>

              <div>
                <h3 className="font-semibold">Address</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add your organisation's official address
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-2xl border bg-muted/30 p-5">
            <div className="flex items-center gap-3">
              <MessageSquare className="size-5 text-primary" />
              <h3 className="font-semibold">Need assistance?</h3>
            </div>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              For medical emergencies, contact your local emergency services.
              MediContinuum is a healthcare management platform, not an
              emergency response service.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-bold">Send us a message</h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Fill in the details below.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Full Name
              </label>

              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                maxLength={100}
                className="h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                maxLength={254}
                className="h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">
                Subject
              </label>

              <input
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="What is this regarding?"
                required
                maxLength={150}
                className="h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">
                Message
              </label>

              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message..."
                rows={5}
                required
                maxLength={3000}
                className="w-full resize-y rounded-lg border bg-background px-3 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <button
              type="submit"
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Send className="size-4" />
              Submit Message
            </button>
          </form>
        </div>
      </section>

      <div className="border-t py-6 text-center">
        <Link
          to="/"
          className="text-sm font-medium text-primary hover:underline"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}

export default ContactPage;
