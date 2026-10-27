import { useState } from 'react';
import { UtensilsCrossed } from 'lucide-react';
import { useI18n } from '../i18n/LanguageContext';

interface ProductImageProps {
  src?: string;
  alt: string;
  className?: string;
  /** Load immediately (above-the-fold). */
  eager?: boolean;
  /** Intrinsic size hint to avoid layout shifts. */
  size?: number;
}

/** Product photo with a branded fallback when no photo exists or it fails to load. */
export default function ProductImage({ src, alt, className = '', eager, size = 400 }: ProductImageProps) {
  const [failed, setFailed] = useState(false);
  const { t } = useI18n();

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={t('product.noPhoto', { name: alt })}
        className={`flex items-center justify-center bg-gradient-to-br from-ink-3 to-ink-2 text-cheese/60 ${className}`}
      >
        <UtensilsCrossed size={28} aria-hidden="true" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}
