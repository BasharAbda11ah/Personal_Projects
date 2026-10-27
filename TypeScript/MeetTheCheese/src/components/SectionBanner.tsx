import { useI18n } from '../i18n/LanguageContext';

interface SectionBannerProps {
  id?: string;
  title: string;
  count?: number;
}

/** Orange-to-gold heading tab, mirroring the category headers on the printed menu. */
export default function SectionBanner({ id, title, count }: SectionBannerProps) {
  const { items } = useI18n();
  return (
    <div className="flex items-center gap-4">
      <h3
        id={id}
        // Jump-to links target this heading: keep it clear of the sticky menu toolbar (page padding covers the header).
        className="bg-gradient-cheese font-display inline-block scroll-mt-(--toolbar-h) rounded-s-md rounded-e-full py-2 ps-4 pe-8 text-xl tracking-wide text-ink uppercase shadow-lg shadow-flame/20 sm:text-2xl"
      >
        {title}
      </h3>
      {count !== undefined && <span className="text-sm whitespace-nowrap text-muted">{items(count)}</span>}
      <span className="h-px flex-1 bg-gradient-to-r from-line to-transparent rtl:bg-gradient-to-l" aria-hidden="true" />
    </div>
  );
}
