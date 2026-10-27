interface LogoProps {
  className?: string;
  /** Decorative copies (next to visible brand text) should pass decorative. */
  decorative?: boolean;
}

/** The Meet The Cheese wordmark, keyed out of the printed menu artwork. */
export default function Logo({ className = 'h-12 w-auto', decorative }: LogoProps) {
  return (
    <img
      src="/images/brand/logo-480.png"
      alt={decorative ? '' : 'Meet The Cheese — Estd. 2021'}
      aria-hidden={decorative || undefined}
      width={480}
      height={457}
      className={className}
      decoding="async"
    />
  );
}
