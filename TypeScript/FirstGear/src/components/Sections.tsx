import { useEffect, useState } from 'react'
import { business, services, whatsappUrl, type ServiceId } from '../content'
import { useLang } from '../lang'
import { ArrowIcon, ClockIcon, PhoneIcon, PinIcon, StarIcon, WhatsAppIcon } from './Icons'

const tel = `tel:${business.phone}`
import { SwatchFan } from './SwatchFan'

export function Placeholder() {
  const { t } = useLang()
  return <span className="ph">{t.placeholder}</span>
}

export function SkipLink() {
  const { t } = useLang()
  return (
    <a className="skip" href="#main">
      {t.skip}
    </a>
  )
}

export function DemoBar() {
  const { t } = useLang()
  return (
    <div className="demobar" role="note">
      <p>
        {t.demoBar} <a href="#about-demo">{t.demoBarLink}</a>
      </p>
    </div>
  )
}

export function Header() {
  const { t, toggle, lang } = useLang()
  return (
    <header className="header">
      <div className="wrap header__row">
        <a className="wordmark" href="#top" translate="no" aria-label={`${t.brand}, ${t.brandSub}`}>
          <span className="wordmark__name">{t.brand}</span>
          <span className="wordmark__sub">{t.brandSub}</span>
        </a>
        <nav className="nav" aria-label={lang === 'ar' ? 'الرئيسية' : 'Main'}>
          <a href="#services">{t.nav.services}</a>
          <a href="#how">{t.nav.how}</a>
          <a href="#visit">{t.nav.visit}</a>
        </nav>
        <div className="header__actions">
          <button
            type="button"
            className="lang"
            onClick={toggle}
            lang={lang === 'en' ? 'ar' : 'en'}
            aria-label={t.langSwitchLabel}
          >
            {t.langSwitch}
          </button>
          <a className="btn btn--action btn--sm header__wa" href={whatsappUrl(t.defaultMessage())} target="_blank" rel="noopener">
            <WhatsAppIcon />
            <span>{t.whatsapp}</span>
          </a>
        </div>
      </div>
    </header>
  )
}

interface HeroProps {
  selected: ServiceId
  onSelect: (id: ServiceId) => void
  open: boolean
  onToggle: () => void
}

export function Hero({ selected, onSelect, open, onToggle }: HeroProps) {
  const { t } = useLang()
  const sel = services.find((s) => s.id === selected)!
  const name = t.service[selected].name
  return (
    <section className="hero tint-70" id="top" aria-labelledby="hero-title">
      <div className="wrap hero__grid">
        <div className="hero__copy">
          <h1 id="hero-title" className="display">
            {t.hero.title}
          </h1>
          <p className="lede">{t.hero.lede}</p>
          <div className="hero__ctas" id="hero-ctas">
            <a className="btn btn--action" href={whatsappUrl(t.defaultMessage())} target="_blank" rel="noopener">
              <WhatsAppIcon />
              <span>{t.whatsapp}</span>
            </a>
            <a className="btn btn--line" href={tel} aria-label={`${t.call} ${business.phoneDisplay}`}>
              <PhoneIcon />
              <span>
                {t.call} <bdi className="num hero__call-num">{business.phoneDisplay}</bdi>
              </span>
            </a>
          </div>
          <p className="rating">
            <span className="rating__main">
              <StarIcon />
              <span>{t.hero.rating}.</span>
            </span>{' '}
            <a href={business.mapsUrl} target="_blank" rel="noopener">
              {t.hero.ratingLink}
            </a>
          </p>
        </div>

        <div className="hero__fan">
          <SwatchFan selected={selected} onSelect={onSelect} open={open} onToggle={onToggle} />
          <div className="picked" aria-live="polite">
            <p className="picked__name">
              <span className="num picked__code">{sel.code}</span> {name}
            </p>
            <p className="picked__hint">{t.hero.hint}</p>
            <a className="picked__ask" href={whatsappUrl(t.defaultMessage(name))} target="_blank" rel="noopener">
              {t.hero.ask}
              <ArrowIcon />
            </a>
          </div>
        </div>
        <FilmBand />
      </div>
    </section>
  )
}

function FilmBand() {
  const { t } = useLang()
  return (
    <figure className="band">
      <img src="/img/polishing-wide.webp" alt={t.band.alt} width={1600} height={600} loading="lazy" decoding="async" />
      <div className="band__film" aria-hidden="true">
        {services.slice(0, 5).map((s) => (
          <span key={s.id} style={{ backgroundColor: `rgb(17 22 23 / ${s.film * 0.7})` }} />
        ))}
      </div>
      <figcaption>{t.band.caption}</figcaption>
    </figure>
  )
}

export function Services({ selected, onSelect }: { selected: ServiceId; onSelect: (id: ServiceId) => void }) {
  const { t } = useLang()
  return (
    <section className="services tint-50" id="services" aria-labelledby="services-title">
      <div className="wrap">
        <div className="section-head">
          <h2 id="services-title" className="h2">
            {t.servicesTitle}
          </h2>
          <p className="section-lede">{t.servicesLede}</p>
        </div>
        <ol className="book">
          {services.map((s) => {
            const copy = t.service[s.id]
            const isOpen = s.id === selected
            return (
              <li key={s.id} className="book__row" data-open={isOpen} style={{ ['--shade' as string]: s.shade, ['--ink' as string]: s.ink }}>
                <h3 className="book__heading">
                  <button
                    type="button"
                    className="book__trigger"
                    aria-expanded={isOpen}
                    aria-controls={`svc-${s.id}`}
                    onClick={() => onSelect(s.id)}
                  >
                    <span className="book__chip" aria-hidden="true" />
                    <span className="book__code num">{s.code}</span>
                    <span className="book__name">{copy.name}</span>
                  </button>
                </h3>
                <div className="book__panel" id={`svc-${s.id}`} hidden={!isOpen}>
                  <p>{copy.body}</p>
                  <dl className="book__meta">
                    <div>
                      <dt>{t.priceLabel}</dt>
                      <dd>
                        {t.pricePlaceholder} <Placeholder />
                      </dd>
                    </div>
                  </dl>
                  <a className="btn btn--action btn--sm" href={whatsappUrl(t.defaultMessage(copy.name))} target="_blank" rel="noopener">
                    <WhatsAppIcon />
                    <span>
                      {t.askAbout} {copy.short}
                    </span>
                  </a>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

export function How() {
  const { t } = useLang()
  return (
    <section className="how tint-35" id="how" aria-labelledby="how-title">
      <div className="wrap how__grid">
        <h2 id="how-title" className="h2">
          {t.how.title}
        </h2>
        <ol className="steps">
          {t.how.steps.map((s, i) => (
            <li key={s.title} className="step">
              <span className="step__n num" aria-hidden="true">
                {i + 1}
              </span>
              <h3 className="step__title">{s.title}</h3>
              <p>{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export function Work() {
  const { t } = useLang()
  return (
    <section className="work tint-20" aria-labelledby="work-title">
      <div className="wrap work__grid">
        <div className="work__copy">
          <h2 id="work-title" className="h2">
            {t.work.title}
          </h2>
          <p className="section-lede">
            {t.work.lede} <Placeholder />
          </p>
        </div>
        <figure className="work__fig work__fig--a">
          <img
            src="/img/polishing.webp"
            alt={t.work.altA}
            width={1400}
            height={1867}
            loading="lazy"
            decoding="async"
          />
          <figcaption>{t.work.illustrative}</figcaption>
        </figure>
        <figure className="work__fig work__fig--b">
          <img
            src="/img/tyre-brush.webp"
            alt={t.work.altB}
            width={1400}
            height={1867}
            loading="lazy"
            decoding="async"
          />
          <figcaption>{t.work.illustrative}</figcaption>
        </figure>
      </div>
    </section>
  )
}

export function Visit({ children }: { children: React.ReactNode }) {
  const { t } = useLang()
  return (
    <section className="visit tint-05" id="visit" aria-labelledby="visit-title">
      <div className="wrap visit__grid">
        <div className="visit__info">
          <h2 id="visit-title" className="h2">
            {t.visit.title}
          </h2>
          <dl className="facts">
            <div className="fact">
              <dt>
                <PinIcon />
                <span>{t.visit.area}</span>
              </dt>
              <dd>
                {t.visit.address}
                <a className="link-arrow" href={business.directionsUrl} target="_blank" rel="noopener">
                  {t.visit.directions}
                  <ArrowIcon />
                </a>
              </dd>
            </div>
            <div className="fact">
              <dt>
                <ClockIcon />
                <span>{t.visit.hoursLabel}</span>
              </dt>
              <dd>
                <span>
                  {t.visit.hours} <Placeholder />
                </span>
                <small>{t.visit.hoursNote}</small>
              </dd>
            </div>
            <div className="fact">
              <dt>
                <PhoneIcon />
                <span>{t.visit.phones}</span>
              </dt>
              <dd>
                <a href={tel}>
                  <bdi className="num">{business.phoneDisplay}</bdi>
                  <small className="tag">{t.visit.phoneTag}</small>
                </a>
              </dd>
            </div>
            <div className="fact">
              <dt>
                <StarIcon />
                <span>{t.visit.reviews}</span>
              </dt>
              <dd>
                <a className="link-arrow" href={business.mapsUrl} target="_blank" rel="noopener">
                  {t.hero.rating}
                  <ArrowIcon />
                </a>
              </dd>
            </div>
          </dl>
        </div>
        {children}
      </div>
    </section>
  )
}

export function Footer() {
  const { t } = useLang()
  return (
    <footer className="footer tint-05" id="about-demo">
      <div className="wrap footer__inner">
        <p className="footer__disclaimer">{t.footer.disclaimer}</p>
        <p>{t.footer.credit}</p>
        <p>{t.footer.photos}</p>
        <p>{t.footer.sources}</p>
      </div>
    </footer>
  )
}

export function MobileBar() {
  const { t } = useLang()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const ctas = document.getElementById('hero-ctas')
    if (!ctas || !('IntersectionObserver' in window)) {
      setVisible(true)
      return
    }
    // The hero already offers WhatsApp and Call; the bar takes over once they scroll away.
    const io = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting))
    io.observe(ctas)
    return () => io.disconnect()
  }, [])

  return (
    <div className="mobilebar" data-visible={visible} inert={!visible}>
      <a className="btn btn--action" href={whatsappUrl(t.defaultMessage())} target="_blank" rel="noopener">
        <WhatsAppIcon />
        <span>{t.whatsappShort}</span>
      </a>
      <a className="btn btn--line-dark" href={tel} aria-label={`${t.call} ${business.phoneDisplay}`}>
        <PhoneIcon />
        <span>{t.call}</span>
      </a>
    </div>
  )
}
