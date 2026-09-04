import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  children?: ReactNode;
  center?: boolean;
  tone?: "light" | "dark";
};

export function PageIntro({ eyebrow, title, lede, children, center, tone = "light" }: Props) {
  const dark = tone === "dark";
  return (
    <section className={cn("pt-32 sm:pt-40", dark ? "bg-[#221C15] text-ivory" : "bg-cream text-ink")}>
      <div className={cn("shell pb-14 sm:pb-20", center && "text-center")}>
        <p className={cn("eyebrow", dark ? "text-copper-soft" : "text-copper")}>{eyebrow}</p>
        <h1 className="serif-display mt-5 max-w-4xl text-5xl font-light leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
          {title}
        </h1>
        {lede && (
          <div
            className={cn(
              "mt-7 max-w-2xl text-[15px] leading-relaxed sm:text-base",
              dark ? "text-ivory/70" : "text-muted",
              center && "mx-auto"
            )}
          >
            {lede}
          </div>
        )}
        {children && <div className={cn("mt-8", center && "flex justify-center")}>{children}</div>}
      </div>
    </section>
  );
}
