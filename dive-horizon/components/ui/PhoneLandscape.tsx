import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

/** A phone held sideways (landscape). Width comes from the parent; height follows the 19.5:9 ratio. */
export default function PhoneLandscape({ src, alt, sizes = "(min-width: 768px) 52vw, 92vw", priority, className = "" }: Props) {
  return (
    <div
      className={`relative aspect-[19.5/9] w-full rounded-[7%/15%] border border-cream/15 bg-ink p-[1.6%] shadow-glow ${className}`}
    >
      <span
        aria-hidden="true"
        className="absolute left-[0.5%] top-1/2 h-[16%] w-[0.7%] -translate-y-1/2 rounded-full bg-night"
      />
      <span aria-hidden="true" className="absolute -top-[3px] right-[16%] h-[3px] w-[7%] rounded-t bg-cream/25" />
      <div className="relative h-full w-full overflow-hidden rounded-[5%/10%] bg-night">
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
    </div>
  );
} 