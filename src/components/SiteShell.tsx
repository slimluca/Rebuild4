import type { ReactNode } from "react";
import { CreatorFooter, Footer } from "@/components/Footer";
import { CreatorHeader, Header } from "@/components/Header";

export function ViewerShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}

export function CreatorShell({ children }: { children: ReactNode }) {
  return (
    <>
      <CreatorHeader />
      {children}
      <CreatorFooter />
    </>
  );
}
