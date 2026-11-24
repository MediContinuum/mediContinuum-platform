import { Link } from "react-router";
import {
  ArrowRight,
  Home,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import Button from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-10">
      <Card className="w-full max-w-lg border-0 shadow-lg">
        <CardHeader className="items-center text-center">
          <div className="mb-4 flex size-20 items-center justify-center rounded-full bg-primary/10">
            <LockKeyhole className="size-10 text-primary" />
          </div>

          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Error 401
          </p>

          <CardTitle className="mt-2 text-3xl">
            Authentication Required
          </CardTitle>

          <CardDescription className="max-w-sm text-sm leading-6">
            You need to sign in to access this page. Please authenticate using
            your MediContinuum account.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="flex items-start gap-3 rounded-lg border bg-muted/40 p-4">
            <KeyRound className="mt-0.5 size-5 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-medium">Sign-in required</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Your session may have expired, or you may not be signed in. Sign
                in to continue.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild className="flex-1">
              <Link to="/login">
                <ShieldCheck className="mr-2 size-4" />
                Sign In
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>

            <Button asChild variant="outline" className="flex-1">
              <Link to="/">
                <Home className="mr-2 size-4" />
                Go to Home
              </Link>
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Error Code: 401 · Unauthorized
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

export default UnauthorizedPage;
