import type { AnchorHTMLAttributes } from "react";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: "gold" | "ghost";
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 font-body text-sm font-bold transition-[transform,box-shadow,background-color] duration-300";

const variants = {
  gold: "bg-gold text-ink hover:-translate-y-0.5 hover:shadow-glow-gold",
  ghost: "border border-cream/25 text-cream hover:bg-cream/10",
} as const;

export default function Button({ variant = "gold", className = "", children, ...rest }: Props) {
  return (
    <a className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </a>
  );
}
