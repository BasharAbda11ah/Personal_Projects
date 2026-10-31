import { useState } from 'react'
import type { ServiceId } from './content'
import { LangProvider } from './lang'
import { BookingForm } from './components/BookingForm'
import { DemoBar, SkipLink, Footer, Header, Hero, How, MobileBar, Services, Visit, Work } from './components/Sections'

export default function App() {
  const [selected, setSelected] = useState<ServiceId>('ceramic')
  const [open, setOpen] = useState(true)

  return (
    <LangProvider>
      <SkipLink />
      <DemoBar />
      <Header />
      <main id="main">
        <Hero selected={selected} onSelect={setSelected} open={open} onToggle={() => setOpen((o) => !o)} />
        <Services selected={selected} onSelect={setSelected} />
        <How />
        <Work />
        <Visit>
          <BookingForm selected={selected} onSelect={setSelected} />
        </Visit>
      </main>
      <Footer />
      <MobileBar />
    </LangProvider>
  )
}
