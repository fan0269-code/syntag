import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export function PageFrame({ children, mainClassName }: { children: ReactNode; mainClassName?: string }) {
  return (
    <>
      <Header />
      <main id="main-content" className={mainClassName}>{children}</main>
      <Footer />
    </>
  );
}
