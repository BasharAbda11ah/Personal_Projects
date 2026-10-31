import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { business, buildBookingUrl, dict, services, whatsappUrl } from './content'

// First Gear uses one number for calls and WhatsApp (confirmed by Bashar, Oct 2026).
const WA_PREFIX = 'https://wa.me/971502800719?text='
const TEL = 'tel:+971502800719'
// Must never reach a visitor: Easy Auto's lead line, and the 2022 number now owned by InfraTechs.
const FORBIDDEN = ['971541651037', '971552515668', '5668', 'InfraTechs']
const NBSP = String.fromCharCode(160)

beforeEach(() => {
  window.localStorage.clear()
  window.history.replaceState(null, '', '/')
})
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

const decodeText = (url: string) => decodeURIComponent(url.slice(url.indexOf('text=') + 5))

describe('content', () => {
  it('has every service translated in both languages', () => {
    for (const s of services) {
      expect(dict.en.service[s.id].name).toBeTruthy()
      expect(dict.ar.service[s.id].name).toBeTruthy()
    }
  })

  it('uses the confirmed number for both calls and WhatsApp', () => {
    expect(business.whatsapp).toBe('971502800719')
    expect(business.phone).toBe('+971502800719')
  })

  it('builds an encoded WhatsApp link', () => {
    expect(whatsappUrl('Hi & hello\nline 2')).toBe(`${WA_PREFIX}Hi%20%26%20hello%0Aline%202`)
  })

  it('formats the English booking message line by line', () => {
    const url = buildBookingUrl(dict.en.form.message, {
      service: 'Ceramic coating',
      name: '  Sara ',
      car: 'Nissan Patrol',
      when: 'Today',
      notes: '  Coffee stain on the back seat ',
    })
    expect(url.startsWith(WA_PREFIX)).toBe(true)
    expect(decodeText(url)).toBe(
      "Hello First Gear, I'd like to book: Ceramic coating.\nName: Sara\nCar: Nissan Patrol\nWhen: Today\nNotes: Coffee stain on the back seat",
    )
  })

  it('formats the Arabic booking message line by line and drops empty notes', () => {
    const url = buildBookingUrl(dict.ar.form.message, {
      service: 'طلاء السيراميك',
      name: 'عمر',
      car: 'تويوتا كامري',
      when: 'غدًا',
      notes: '   ',
    })
    expect(decodeText(url)).toBe('مرحبًا فيرست جير، أود حجز: طلاء السيراميك.\nالاسم: عمر\nالسيارة: تويوتا كامري\nالموعد: غدًا')
  })
})

describe('App', () => {
  it('routes every WhatsApp and call link to +971 50 280 0719, in both languages', async () => {
    const user = userEvent.setup()
    render(<App />)
    const check = () => {
      const wa = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href*="wa.me"], a[href*="whatsapp.com"]'))
      // header, hero, fan "ask", open service row, mobile bar
      expect(wa.length).toBeGreaterThanOrEqual(5)
      for (const a of wa) {
        expect(a.href.startsWith(WA_PREFIX)).toBe(true)
        expect(a.target).toBe('_blank')
        expect(a.rel).toContain('noopener')
      }
      const tels = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href^="tel:"]'))
      // hero call, visit phone, mobile bar call
      expect(tels.length).toBeGreaterThanOrEqual(3)
      for (const a of tels) expect(a.getAttribute('href')).toBe(TEL)
      for (const n of FORBIDDEN) expect(document.body.innerHTML).not.toContain(n)
    }
    check()
    await user.click(screen.getByRole('button', { name: dict.en.langSwitchLabel }))
    check()
  })

  it('booking form validates, then opens WhatsApp with the full request', async () => {
    const user = userEvent.setup()
    const open = vi.spyOn(window, 'open').mockReturnValue(null)
    render(<App />)
    const submit = screen.getByRole('button', { name: dict.en.form.submit })
    expect(submit).toBeEnabled()
    await user.click(submit)
    expect(screen.getByRole('alert')).toHaveTextContent(dict.en.form.required)
    expect(open).not.toHaveBeenCalled()
    expect(screen.getByLabelText(dict.en.form.name)).toHaveFocus()

    await user.selectOptions(screen.getByLabelText(dict.en.form.service), 'tint')
    await user.type(screen.getByLabelText(dict.en.form.name), 'Omar')
    await user.type(screen.getByLabelText(dict.en.form.car), 'Toyota Camry')
    await user.click(screen.getByRole('radio', { name: 'This week' }))
    await user.type(screen.getByLabelText(dict.en.form.notes), 'Rear windows only')
    await user.click(submit)
    expect(open).toHaveBeenCalledOnce()
    const [url, target, features] = open.mock.calls[0] as [string, string, string]
    expect(target).toBe('_blank')
    expect(features).toBe('noopener')
    expect(url.startsWith(WA_PREFIX)).toBe(true)
    expect(decodeText(url)).toBe(
      "Hello First Gear, I'd like to book: Window tinting.\nName: Omar\nCar: Toyota Camry\nWhen: This week\nNotes: Rear windows only",
    )
  })

  it('sends the booking message in Arabic when the page is in Arabic', async () => {
    window.history.replaceState(null, '', '/?lang=ar')
    const user = userEvent.setup()
    const open = vi.spyOn(window, 'open').mockReturnValue(null)
    render(<App />)
    await user.type(screen.getByLabelText(dict.ar.form.name), 'عمر')
    await user.type(screen.getByLabelText(dict.ar.form.car), 'تويوتا كامري')
    await user.click(screen.getByRole('button', { name: dict.ar.form.submit }))
    const url = open.mock.calls[0][0] as string
    expect(url.startsWith(WA_PREFIX)).toBe(true)
    expect(decodeText(url)).toBe('مرحبًا فيرست جير، أود حجز: طلاء السيراميك.\nالاسم: عمر\nالسيارة: تويوتا كامري\nالموعد: اليوم')
  })

  it('marks unverified facts as placeholders and invents no prices', () => {
    render(<App />)
    expect(document.querySelectorAll('.ph').length).toBeGreaterThanOrEqual(3)
    expect(document.body.textContent).not.toMatch(/AED|درهم|testimonial/i)
  })

  it('labels itself as an unofficial demo', () => {
    render(<App />)
    expect(screen.getByRole('note')).toHaveTextContent('Not the official First Gear website')
  })

  it('switches to Arabic with RTL and back', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: dict.en.langSwitchLabel }))
    expect(document.documentElement.dir).toBe('rtl')
    expect(document.documentElement.lang).toBe('ar')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(dict.ar.hero.title.split(NBSP).join(' '))
    await user.click(screen.getByRole('button', { name: dict.ar.langSwitchLabel }))
    expect(document.documentElement.dir).toBe('ltr')
  })

  it('opens Arabic directly from ?lang=ar', () => {
    window.history.replaceState(null, '', '/?lang=ar')
    render(<App />)
    expect(document.documentElement.dir).toBe('rtl')
  })

  it('selecting a swatch syncs the hero, the book and the form', async () => {
    const user = userEvent.setup()
    render(<App />)
    const fan = screen.getByRole('list', { name: dict.en.hero.pick })
    await user.click(within(fan).getByRole('button', { name: /FG-03/ }))
    expect(within(fan).getByRole('button', { name: /FG-03/ })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: /FG-03 Window tinting/ })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByLabelText(dict.en.form.service)).toHaveValue('tint')
    const href = screen.getByRole('link', { name: dict.en.hero.ask }).getAttribute('href')!
    expect(href.startsWith(WA_PREFIX)).toBe(true)
    expect(decodeText(href)).toBe("Hello First Gear, I'd like to ask about Window tinting.")
  })

  it('folding the fan takes strips out of the tab order', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: dict.en.hero.fanToggleClose }))
    const fan = screen.getByRole('list', { name: dict.en.hero.pick })
    for (const b of within(fan).getAllByRole('button')) expect(b).toHaveAttribute('tabindex', '-1')
    expect(screen.getByRole('button', { name: dict.en.hero.fanToggleOpen })).toHaveAttribute('aria-expanded', 'false')
  })
})
