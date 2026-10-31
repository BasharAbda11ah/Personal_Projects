// One stroke family, 1.75 on a 24 grid, currentColor.
const base = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

export function WhatsAppIcon() {
  return (
    <svg {...base}>
      <path d="M4.5 19.5l1.1-3.6A8 8 0 1 1 8.4 18.6z" />
      <path d="M9.2 8.6c.2-.5.6-.5.9-.5h.4c.2 0 .4.1.5.4l.6 1.4c.1.2 0 .5-.1.6l-.5.6c.6 1.2 1.6 2.1 2.8 2.7l.6-.6c.2-.2.4-.2.6-.1l1.4.6c.3.1.4.3.4.5v.5c0 .4-.2.8-.6 1-1.3.6-3.1.1-4.8-1.6S8.6 9.9 9.2 8.6z" />
    </svg>
  )
}

export function PhoneIcon() {
  return (
    <svg {...base}>
      <path d="M5 4.5h3l1.5 4-2 1.3a10 10 0 0 0 6.7 6.7l1.3-2 4 1.5v3a1.5 1.5 0 0 1-1.6 1.5A15.5 15.5 0 0 1 3.5 6.1 1.5 1.5 0 0 1 5 4.5z" />
    </svg>
  )
}

export function PinIcon() {
  return (
    <svg {...base}>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.4" />
    </svg>
  )
}

export function ClockIcon() {
  return (
    <svg {...base}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  )
}

export function StarIcon() {
  return (
    <svg {...base} fill="currentColor" stroke="none">
      <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z" />
    </svg>
  )
}

export function ArrowIcon() {
  return (
    <svg {...base} className="icon-arrow">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}
