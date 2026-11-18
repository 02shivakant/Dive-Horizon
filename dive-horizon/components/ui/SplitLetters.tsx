// Splits text into masked letters. Animate the [data-letter] spans (yPercent 110 -> 0).
export default function SplitLetters({ text }: { text: string }) {
  return (
    <span className="inline-flex">
      {Array.from(text).map((ch, i) => (
        <span key={i} className="-my-[0.08em] inline-block overflow-hidden py-[0.08em]">
          <span data-letter className="inline-block">
            {ch === " " ? "\u00A0" : ch}
          </span>
        </span>
      ))}
    </span>
  );
}
