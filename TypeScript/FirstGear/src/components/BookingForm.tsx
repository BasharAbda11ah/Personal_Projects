import { useId, useRef, useState, type FormEvent } from 'react'
import { buildBookingUrl, services, type ServiceId } from '../content'
import { useLang } from '../lang'
import { WhatsAppIcon } from './Icons'

export function BookingForm({ selected, onSelect }: { selected: ServiceId; onSelect: (id: ServiceId) => void }) {
  const { t } = useLang()
  const id = useId()
  const [name, setName] = useState('')
  const [car, setCar] = useState('')
  const [when, setWhen] = useState(0)
  const [notes, setNotes] = useState('')
  const [error, setError] = useState(false)
  const nameRef = useRef<HTMLInputElement>(null)
  const carRef = useRef<HTMLInputElement>(null)

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!name.trim() || !car.trim()) {
      setError(true)
      ;(name.trim() ? carRef : nameRef).current?.focus()
      return
    }
    setError(false)
    const url = buildBookingUrl(t.form.message, {
      service: t.service[selected].name,
      name,
      car,
      when: t.form.whenOptions[when],
      notes,
    })
    window.open(url, '_blank', 'noopener')
  }

  const errId = `${id}-err`

  return (
    <form className="booking" onSubmit={onSubmit} noValidate aria-labelledby={`${id}-title`}>
      <h3 id={`${id}-title`} className="booking__title">
        {t.form.title}
      </h3>
      <p className="booking__lede">{t.form.lede}</p>

      <label className="field">
        <span>{t.form.service}</span>
        <select name="service" value={selected} onChange={(e) => onSelect(e.target.value as ServiceId)}>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.code} · {t.service[s.id].name}
            </option>
          ))}
        </select>
      </label>

      <div className="field-row">
        <label className="field">
          <span>{t.form.name}</span>
          <input
            ref={nameRef}
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
            aria-invalid={error && !name.trim()}
            aria-describedby={error ? errId : undefined}
          />
        </label>
        <label className="field">
          <span>{t.form.car}</span>
          <input
            ref={carRef}
            name="car"
            autoComplete="off"
            value={car}
            onChange={(e) => setCar(e.target.value)}
            required
            aria-invalid={error && !car.trim()}
            aria-describedby={error ? errId : undefined}
          />
        </label>
      </div>

      <fieldset className="field when">
        <legend>{t.form.when}</legend>
        <div className="when__opts">
          {t.form.whenOptions.map((opt, i) => (
            <label key={opt} className="when__opt">
              <input type="radio" name={`${id}-when`} checked={when === i} onChange={() => setWhen(i)} />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="field">
        <span>{t.form.notes}</span>
        <textarea name="notes" autoComplete="off" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
      </label>

      {error ? (
        <p className="booking__error" id={errId} role="alert">
          {t.form.required}
        </p>
      ) : null}

      <button type="submit" className="btn btn--action booking__submit">
        <WhatsAppIcon />
        <span>{t.form.submit}</span>
      </button>
      <p className="booking__hint">{t.form.hint}</p>
    </form>
  )
}
