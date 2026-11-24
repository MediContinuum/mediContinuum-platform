import { Link } from "react-router";
import {
  AlertTriangle,
  ArrowLeft,
  Home,
  RefreshCw,
  ServerCrash,
} from "lucide-react";

import Button from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function ServerErrorPage() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-10">
      <Card className="w-full max-w-lg border-0 shadow-lg">
        <CardHeader className="items-center text-center">
          <div className="mb-4 flex size-20 items-center justify-center rounded-full bg-destructive/10">
            <ServerCrash className="size-10 text-destructive" />
          </div>

          <p className="text-sm font-semibold uppercase tracking-widest text-destructive">
            Error 500
          </p>

          <CardTitle className="mt-2 text-3xl">Something Went Wrong</CardTitle>

          <CardDescription className="max-w-sm text-sm leading-6">
            We are experiencing an unexpected server issue. Your request could
            not be completed. Please try again later.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="flex items-start gap-3 rounded-lg border bg-muted/40 p-4">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" />
            <div>
              <p className="text-sm font-medium">
                Server temporarily unavailable
              </p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                This may be caused by a temporary server problem. Your
                information has not necessarily been saved.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={handleRetry} className="flex-1">
              <RefreshCw className="mr-2 size-4" />
              Try Again
            </Button>

            <Button asChild variant="outline" className="flex-1">
              <Link to="/dashboard">
                <Home className="mr-2 size-4" />
                Go to Dashboard
              </Link>
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Error Code: 500 · Internal Server Error
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

export default ServerErrorPage;
