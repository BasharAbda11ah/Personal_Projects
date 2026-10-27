import { useMenuFilter, type GroupFilter } from '../context/MenuFilterContext';
import { useI18n } from '../i18n/LanguageContext';
import type { CategoryGroup } from '../types';

const TILES: { group: CategoryGroup; image: string }[] = [
  { group: 'burgers', image: '/images/menu/three-star.jpg' },
  { group: 'sandwiches', image: '/images/menu/mac-n-zinger-toast.jpg' },
  { group: 'meals', image: '/images/menu/viral-combo.jpg' },
  { group: 'chicken', image: '/images/menu/chicken-bucket.jpg' },
  { group: 'sides', image: '/images/menu/cheetos-cheese-fries.jpg' },
  { group: 'drinks', image: '/images/menu/pistachio-shake.jpg' },
];

/** Short introduction to the menu categories, with photos from the printed menu as shortcuts. */
export default function CravingTiles() {
  const { showMenu } = useMenuFilter();
  const { t } = useI18n();
  return (
    <section aria-labelledby="cravings-title" className="mx-auto max-w-7xl px-4 pb-14 sm:px-6">
      <div className="mb-6 max-w-2xl">
        <p className="text-xs font-bold tracking-[0.25em] text-flame uppercase">{t('cats.eyebrow')}</p>
        <h2 id="cravings-title" className="font-display mt-1 text-2xl text-cream sm:text-3xl">
          {t('cats.title')}
        </h2>
        <p className="mt-2 text-muted">{t('cats.sub')}</p>
      </div>
      <ul className="scrollbar-none relative -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-6">
        {TILES.map((tile) => (
          <li key={tile.group} className="w-36 shrink-0 snap-start sm:w-auto">
            <button
              type="button"
              onClick={() => showMenu(tile.group as GroupFilter)}
              className="group relative block aspect-[4/5] w-full overflow-hidden rounded-2xl border border-line text-start shadow-lg shadow-black/30 transition hover:-translate-y-0.5 hover:border-cheese/70 motion-reduce:hover:translate-y-0"
            >
              <img
                src={tile.image}
                alt=""
                width={300}
                height={375}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105 motion-reduce:group-hover:scale-100"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" aria-hidden="true" />
              <span className="font-display absolute inset-x-3 bottom-3 text-base leading-tight tracking-wide text-cheese uppercase">
                {t(`group.${tile.group}`)}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
