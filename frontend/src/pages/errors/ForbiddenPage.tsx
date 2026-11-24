import { Link } from "react-router";
import {
  ArrowLeft,
  ArrowRight,
  Home,
  LockKeyhole,
  ShieldAlert,
} from "lucide-react";

import Button from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function ForbiddenPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-10">
      <Card className="w-full max-w-lg border-0 shadow-lg">
        <CardHeader className="items-center text-center">
          <div className="mb-4 flex size-20 items-center justify-center rounded-full bg-destructive/10">
            <ShieldAlert className="size-10 text-destructive" />
          </div>

          <p className="text-sm font-semibold uppercase tracking-widest text-destructive">
            Error 403
          </p>

          <CardTitle className="mt-2 text-3xl">Access Forbidden</CardTitle>

          <CardDescription className="max-w-sm text-sm leading-6">
            You do not have permission to access this page or resource. Please
            contact your administrator if you believe this is a mistake.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="flex items-start gap-3 rounded-lg border bg-muted/40 p-4">
            <LockKeyhole className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Restricted access</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Your current account permissions do not allow access to this
                resource.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild className="flex-1">
              <Link to="/dashboard">
                <Home className="mr-2 size-4" />
                Go to Dashboard
              </Link>
            </Button>

            <Button asChild variant="outline" className="flex-1">
              <Link to="/">
                <ArrowLeft className="mr-2 size-4" />
                Go to Home
              </Link>
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Error Code: 403 · Forbidden
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

export default ForbiddenPage;
