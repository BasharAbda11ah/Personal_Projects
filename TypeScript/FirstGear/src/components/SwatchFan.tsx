import { services, type ServiceId } from '../content'
import { useLang } from '../lang'

const SPREAD = 13.5 // degrees between deployed strips
const FOLDED = 1.6 // degrees between folded strips
const PULL = 7 // cqw a selected strip slides out along its own axis

interface Props {
  selected: ServiceId
  onSelect: (id: ServiceId) => void
  open: boolean
  onToggle: () => void
}

export function SwatchFan({ selected, onSelect, open, onToggle }: Props) {
  const { t } = useLang()
  const sign = t.dir === 'rtl' ? -1 : 1

  return (
    <div className="fan" data-open={open}>
      <ul className="fan__strips" aria-label={t.hero.pick}>
        {services.map((s, i) => {
          const angle = sign * i * (open ? SPREAD : FOLDED)
          const isSelected = s.id === selected
          const rad = (angle * Math.PI) / 180
          const pull = isSelected && open ? PULL : 0
          return (
            <li
              key={s.id}
              className="fan__item"
              style={{
                rotate: `${angle}deg`,
                translate: `${(Math.sin(rad) * pull).toFixed(2)}cqw ${(-Math.cos(rad) * pull).toFixed(2)}cqw`,
                animationDelay: `${i * 45}ms`,
                zIndex: isSelected ? services.length + 1 : i + 1,
              }}
            >
              <button
                type="button"
                className="strip"
                style={{ backgroundColor: `rgb(17 22 23 / ${s.film})`, color: s.ink }}
                aria-pressed={isSelected}
                onClick={() => onSelect(s.id)}
                tabIndex={open ? 0 : -1}
              >
                <span className="strip__label">
                  <span className="strip__code">{s.code}</span>
                  <span className="strip__name">{t.service[s.id].short}</span>
                </span>
                <span className="strip__hole" aria-hidden="true" />
              </button>
            </li>
          )
        })}
      </ul>
      <button
        type="button"
        className="fan__rivet"
        onClick={onToggle}
        aria-expanded={open}
        aria-label={open ? t.hero.fanToggleClose : t.hero.fanToggleOpen}
      />
    </div>
  )
}
