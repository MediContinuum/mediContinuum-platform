import type { ReactNode } from "react";

interface FooterProps {
  children?: ReactNode;
  className?: string;
}

function Footer({ children, className = "" }: FooterProps) {
  return (
    <footer
      className={`flex flex-col items-center justify-between gap-3 border-t border-border px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:px-6 ${className}`}
    >
      {children ?? (
        <>
          <p>
            © {new Date().getFullYear()} MediContinuum. All rights reserved.
          </p>
          <p>Healthcare management platform</p>
        </>
      )}
    </footer>
  );
}

export default Footer;
