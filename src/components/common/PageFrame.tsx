import type { ReactNode } from "react";
import { AdScreenProvider } from "@/components/common/AdScreenProvider";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import type { AdScreenKind } from "@/lib/ad-screen";

export function PageFrame({
  children,
  mainClassName,
  adScreen = "unclassified",
}: {
  children: ReactNode;
  mainClassName?: string;
  adScreen?: AdScreenKind;
}) {
  return (
    <AdScreenProvider screen={adScreen}>
      <Header />
      <main id="main-content" className={mainClassName}>{children}</main>
      <Footer />
    </AdScreenProvider>
  );
}
