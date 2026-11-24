import { ArrowLeft, ArrowRight, HeartPulse, Search } from "lucide-react";
import { Link, useNavigate } from "react-router";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12 text-foreground">
      <div className="w-full max-w-xl text-center">
        <Link
          to="/"
          className="mb-10 inline-flex items-center gap-2 text-lg font-bold"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <HeartPulse className="size-5" />
          </span>
          MediContinuum
        </Link>

        <div className="mx-auto flex size-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
          <Search className="size-9" />
        </div>

        <p className="mt-8 text-8xl font-extrabold tracking-tighter text-primary">
          404
        </p>

        <h1 className="mt-4 text-3xl font-bold tracking-tight">
          Page not found
        </h1>

        <p className="mx-auto mt-4 max-w-md leading-7 text-muted-foreground">
          The page you're looking for may have been moved, deleted or may not
          exist. Check the URL or return to the homepage.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-lg border px-5 py-3 text-sm font-semibold transition-colors hover:bg-muted"
          >
            <ArrowLeft className="size-4" />
            Go Back
          </button>

          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Back to Home
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <p className="mt-12 text-xs text-muted-foreground">
          © {new Date().getFullYear()} MediContinuum
        </p>
      </div>
    </main>
  );
}

export default NotFoundPage;
