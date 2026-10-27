/** Phone numbers always read left-to-right, even inside Arabic text. */
export default function Phone({ children, className = '' }: { children: string; className?: string }) {
  return (
    <bdi dir="ltr" className={`tabular-nums ${className}`}>
      {children}
    </bdi>
  );
}
