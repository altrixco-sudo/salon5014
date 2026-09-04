import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "solid" | "copper" | "outline" | "ghostLight" | "pill" | "none";
type Size = "md" | "lg" | "sm";

const styles: Record<Variant, string> = {
  solid: "btn-solid",
  copper: "btn-copper",
  outline: "btn-outline",
  ghostLight: "btn-ghost-light",
  pill: "btn-pill",
  none: ""
};

const sizes: Record<Size, string> = {
  sm: "px-5 py-3 text-[10px]",
  md: "",
  lg: "px-9 py-5"
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

export function CtaLink({
  href,
  variant = "solid",
  size = "md",
  className,
  children,
  ...rest
}: CommonProps & { href: string } & Omit<ComponentProps<typeof Link>, "href">) {
  const isExternal = /^https?:/.test(href);
  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(styles[variant], sizes[size], className)}
        {...(rest as object)}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cn(styles[variant], sizes[size], className)} {...rest}>
      {children}
    </Link>
  );
}

export function CtaButton({
  variant = "solid",
  size = "md",
  className,
  children,
  ...rest
}: CommonProps & ComponentProps<"button">) {
  return (
    <button className={cn(styles[variant], sizes[size], className)} {...rest}>
      {children}
    </button>
  );
}
