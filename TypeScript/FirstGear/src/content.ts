// Every business fact here comes from a public listing or the business's own archived site.
// Contact: +971 50 280 0719 is First Gear’s number for both calls and WhatsApp (public Google Maps listing).
// Anything not verified is rendered with the Placeholder marker, never invented.

export type Lang = 'en' | 'ar'

export const business: {
  readonly whatsapp: string
  readonly phone: string
  readonly phoneDisplay: string
  readonly rating: string
  readonly mapsUrl: string
  readonly directionsUrl: string
} = {
  whatsapp: '971502800719',
  phone: '+971502800719',
  phoneDisplay: '+971 50 280 0719',
  rating: '4.7',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=First+Gear+Car+Polish+and+Cleaning+Ajman',
  directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=25.404454,55.494688',
}

export type ServiceId =
  | 'polish'
  | 'ceramic'
  | 'tint'
  | 'wash'
  | 'underbody'
  | 'headlight'
  | 'engine'

export interface Service {
  id: ServiceId
  code: string
  /** Swatch shade, light (clear film) to dark (deep smoke). */
  shade: string
  /** Opacity of smoke film for the fan strip, laid over the clear ground. */
  film: number
  ink: string
}

export const services: Service[] = [
  { id: 'polish', code: 'FG-01', shade: '#eef1ef', film: 0.05, ink: '#121617' },
  { id: 'ceramic', code: 'FG-02', shade: '#d9dedc', film: 0.16, ink: '#121617' },
  { id: 'tint', code: 'FG-03', shade: '#b5bcba', film: 0.3, ink: '#121617' },
  { id: 'wash', code: 'FG-04', shade: '#8a9391', film: 0.45, ink: '#0b0e0f' },
  { id: 'underbody', code: 'FG-05', shade: '#5c6564', film: 0.62, ink: '#f2f4f3' },
  { id: 'headlight', code: 'FG-06', shade: '#373e3e', film: 0.8, ink: '#f2f4f3' },
  { id: 'engine', code: 'FG-07', shade: '#1a1f20', film: 0.93, ink: '#f2f4f3' },
]

type ServiceCopy = { name: string; short: string; body: string }

export interface Dict {
  dir: 'ltr' | 'rtl'
  skip: string
  langSwitch: string
  langSwitchLabel: string
  demoBar: string
  demoBarLink: string
  brand: string
  brandSub: string
  nav: { services: string; visit: string; how: string }
  whatsapp: string
  whatsappShort: string
  call: string
  hero: {
    title: string
    lede: string
    rating: string
    ratingLink: string
    pick: string
    fanToggleOpen: string
    fanToggleClose: string
    selected: string
    hint: string
    ask: string
  }
  servicesTitle: string
  servicesLede: string
  service: Record<ServiceId, ServiceCopy>
  priceLabel: string
  pricePlaceholder: string
  askAbout: string
  how: {
    title: string
    steps: { title: string; body: string }[]
  }
  band: { alt: string; caption: string }
  work: {
    title: string
    lede: string
    illustrative: string
    owner: string
    altA: string
    altB: string
  }
  visit: {
    title: string
    area: string
    address: string
    hoursLabel: string
    hours: string
    hoursNote: string
    phoneTag: string
    phones: string
    directions: string
    reviews: string
  }
  form: {
    title: string
    lede: string
    service: string
    name: string
    car: string
    when: string
    whenOptions: string[]
    notes: string
    submit: string
    hint: string
    required: string
    message: (v: { service: string; name: string; car: string; when: string; notes: string }) => string
  }
  placeholder: string
  footer: {
    disclaimer: string
    credit: string
    photos: string
    sources: string
  }
  defaultMessage: (service?: string) => string
}

export const dict: Record<Lang, Dict> = {
  en: {
    dir: 'ltr',
    skip: 'Skip to content',
    langSwitch: 'العربية',
    langSwitchLabel: 'اعرض الموقع باللغة العربية',
    demoBar: 'Independent demo by Bashar Abdallah. Not the official First Gear website.',
    demoBarLink: 'About this demo',
    brand: 'First Gear',
    brandSub: 'Car Polish & Cleaning',
    nav: { services: 'Services', how: 'How it works', visit: 'Visit' },
    whatsapp: 'WhatsApp us',
    whatsappShort: 'WhatsApp',
    call: 'Call',
    hero: {
      title: 'Polish, coating and tint in Al Jerf 2, Ajman.',
      lede: 'Seven services, from a full wash to ceramic coating and window tint. Pick one and send it to the team on WhatsApp.',
      rating: '4.7 on Google from 224 reviews',
      ratingLink: 'Read them',
      pick: 'Pick a service from the swatch',
      fanToggleOpen: 'Fan out the swatches',
      fanToggleClose: 'Fold the swatches',
      selected: 'Selected',
      hint: 'Tap any strip to choose a service.',
      ask: 'Ask about this on WhatsApp',
    },
    servicesTitle: 'The swatch book',
    servicesLede: 'Every service First Gear lists publicly, from lightest job to deepest.',
    service: {
      polish: {
        name: 'Wash & polish, inside and out',
        short: 'Inside & out',
        body: 'A wash outside, a clean-up inside, and polishing to bring back gloss and soften light swirl marks.',
      },
      ceramic: {
        name: 'Ceramic coating',
        short: 'Ceramic',
        body: 'A liquid coating bonded to the clear coat, so water beads off and dirt washes away more easily between visits.',
      },
      tint: {
        name: 'Window tinting',
        short: 'Tint',
        body: 'Film applied to the side and rear glass to cut glare and heat in the cabin. Ask which shades are allowed for your car.',
      },
      wash: {
        name: 'Car wash',
        short: 'Wash',
        body: 'A straightforward wash for the everyday dust of the northern emirates.',
      },
      underbody: {
        name: 'Underbody wash on a lift',
        short: 'Underbody',
        body: 'The car goes up on a lift so sand, mud and salt can be washed from underneath, where a normal wash never reaches.',
      },
      headlight: {
        name: 'Headlight restoration',
        short: 'Headlights',
        body: 'Yellowed, cloudy headlight lenses are sanded and polished back to clear.',
      },
      engine: {
        name: 'Engine bay detailing',
        short: 'Engine bay',
        body: 'Careful cleaning of the engine bay, for upkeep or before selling the car.',
      },
    },
    priceLabel: 'Price',
    pricePlaceholder: 'Added by First Gear',
    askAbout: 'Ask about',
    how: {
      title: 'How a visit works',
      steps: [
        { title: 'Choose a service', body: 'From the swatch book above, or just describe the car and what bothers you.' },
        { title: 'Send it on WhatsApp', body: 'Your message opens ready to send. Ask for the price and a time slot.' },
        { title: 'Drive in to Al Jerf 2', body: 'The shop is in Jurf 2, near Ajman City Centre.' },
      ],
    },
    band: {
      alt: 'Gloved hands machine-polishing the bonnet of a dark blue car (stock photo)',
      caption: 'Illustrative stock photo, not First Gear’s work',
    },
    work: {
      title: 'Work in the bay',
      lede: 'The real gallery goes here: before and after shots from First Gear’s own jobs.',
      illustrative: 'Illustrative stock photo, not First Gear’s work',
      owner: 'Owner photo',
      altA: 'Detailer in black gloves machine-polishing a black car (stock photo)',
      altB: 'Gloved hand brushing a tyre sidewall (stock photo)',
    },
    visit: {
      title: 'Visit the shop',
      area: 'Al Jerf 2, Ajman',
      address: 'Jurf 2, near Ajman City Centre, Ajman, UAE',
      hoursLabel: 'Hours',
      hours: 'To be confirmed',
      hoursNote: 'Public listings disagree (8:00 to 23:30, or 9:30 to 1:00). First Gear to confirm.',
      phoneTag: 'Calls and WhatsApp',
      phones: 'Phone',
      directions: 'Get directions',
      reviews: 'Google reviews',
    },
    form: {
      title: 'Book by message',
      lede: 'Fill this in and WhatsApp opens with your request written out.',
      service: 'Service',
      name: 'Your name',
      car: 'Car make and model',
      when: 'When suits you',
      whenOptions: ['Today', 'Tomorrow', 'This week', 'Flexible'],
      notes: 'Anything else (optional)',
      submit: 'Open in WhatsApp',
      hint: 'Nothing is sent until you press send in WhatsApp.',
      required: 'Please add your name and car so the team can quote.',
      message: ({ service, name, car, when, notes }) =>
        [
          `Hello First Gear, I'd like to book: ${service}.`,
          `Name: ${name}`,
          `Car: ${car}`,
          `When: ${when}`,
          notes ? `Notes: ${notes}` : '',
        ]
          .filter(Boolean)
          .join('\n'),
    },
    placeholder: 'Placeholder',
    footer: {
      disclaimer:
        'This is an independent, unofficial demonstration website created by Bashar Abdallah to show First Gear Car Polish and Cleaning what a website could look like. It was not commissioned by the business. Contact details and rating are taken from public listings and the business’s own archived website, and still need the owner’s confirmation.',
      credit: 'Design and build: Bashar Abdallah',
      photos: 'Photos: Luay Barani and Zac Nielson on Unsplash (illustrative stock photos, not First Gear’s work).',
      sources: 'Sources: First Gear’s Google Maps listing (rating and 224 reviews as of 31 October 2026), First Gear’s archived 2022 website, Local Emirates and 2GIS listings.',
    },
    defaultMessage: (service) =>
      service
        ? `Hello First Gear, I'd like to ask about ${service}.`
        : "Hello First Gear, I'd like to ask about a booking.",
  },
  ar: {
    dir: 'rtl',
    skip: 'تخطَّ إلى المحتوى',
    langSwitch: 'English',
    langSwitchLabel: 'View the site in English',
    demoBar: 'نموذج مستقل من تصميم بشار عبدالله. ليس الموقع الرسمي لفيرست جير.',
    demoBarLink: 'عن هذا النموذج',
    brand: 'فيرست جير',
    brandSub: 'تلميع وتنظيف السيارات',
    nav: { services: 'الخدمات', how: 'كيف تتم الزيارة', visit: 'الموقع' },
    whatsapp: 'راسلنا على واتساب',
    whatsappShort: 'واتساب',
    call: 'اتصال',
    hero: {
      title: 'تلميع وحماية سيراميك وتظليل في الجرف 2، عجمان.',
      lede: 'سبع خدمات، من الغسيل الكامل إلى طلاء السيراميك وتظليل النوافذ. اختر خدمة وأرسلها للفريق عبر واتساب.',
      rating: 'تقييم 4.7 على Google من 224 مراجعة',
      ratingLink: 'اقرأ المراجعات',
      pick: 'اختر خدمة من العيّنات',
      fanToggleOpen: 'افتح العيّنات',
      fanToggleClose: 'اطوِ العيّنات',
      selected: 'الخدمة المختارة',
      hint: 'اضغط على أي شريحة لاختيار الخدمة.',
      ask: 'اسأل عنها على واتساب',
    },
    servicesTitle: 'دفتر العيّنات',
    servicesLede: 'كل الخدمات المعلنة لفيرست جير، من الأخف إلى الأعمق.',
    service: {
      polish: {
        name: 'غسيل وتلميع داخلي وخارجي',
        short: 'داخلي وخارجي',
        body: 'غسيل من الخارج، وتنظيف من الداخل، وتلميع لاستعادة اللمعان وتخفيف الخدوش الدائرية الخفيفة.',
      },
      ceramic: {
        name: 'طلاء السيراميك',
        short: 'سيراميك',
        body: 'طبقة سائلة ترتبط بالطلاء الشفاف، فينزلق الماء عن السطح ويسهل تنظيف الأوساخ بين الزيارات.',
      },
      tint: {
        name: 'تظليل النوافذ',
        short: 'تظليل',
        body: 'فيلم يُركّب على الزجاج الجانبي والخلفي لتخفيف الوهج والحرارة داخل السيارة. اسأل عن درجات التظليل المسموح بها لسيارتك.',
      },
      wash: {
        name: 'غسيل السيارات',
        short: 'غسيل',
        body: 'غسيل مباشر لغبار الإمارات الشمالية اليومي.',
      },
      underbody: {
        name: 'غسيل أسفل السيارة على الرافعة',
        short: 'أسفل السيارة',
        body: 'ترفع السيارة على الرافعة ليُغسل الرمل والطين والملح من الأسفل، حيث لا يصل الغسيل العادي.',
      },
      headlight: {
        name: 'تجديد المصابيح الأمامية',
        short: 'المصابيح',
        body: 'تُصنفر عدسات المصابيح المصفرّة والباهتة وتُلمّع حتى تعود شفافة.',
      },
      engine: {
        name: 'تنظيف حجرة المحرك',
        short: 'حجرة المحرك',
        body: 'تنظيف دقيق لحجرة المحرك، للعناية الدورية أو قبل بيع السيارة.',
      },
    },
    priceLabel: 'السعر',
    pricePlaceholder: 'يضيفه فيرست جير',
    askAbout: 'اسأل عن',
    how: {
      title: 'كيف تتم الزيارة',
      steps: [
        { title: 'اختر الخدمة', body: 'من دفتر العيّنات أعلاه، أو صف سيارتك وما يزعجك فيها.' },
        { title: 'أرسلها على واتساب', body: 'تفتح الرسالة جاهزة للإرسال. اسأل عن السعر والموعد المتاح.' },
        { title: 'تعال إلى الجرف 2', body: 'المحل في الجرف 2، بالقرب من عجمان سيتي سنتر.' },
      ],
    },
    band: {
      alt: 'يدان بقفازين تلمّعان غطاء محرك سيارة زرقاء داكنة بالماكينة (صورة من مكتبة صور)',
      caption: 'صورة توضيحية من مكتبة صور، ليست من أعمال فيرست جير',
    },
    work: {
      title: 'من داخل الورشة',
      lede: 'هنا مكان معرض الصور الحقيقي: صور قبل وبعد من أعمال فيرست جير.',
      illustrative: 'صورة توضيحية، ليست من أعمال فيرست جير',
      owner: 'صورة من المالك',
      altA: 'فني بقفازات سوداء يلمّع سيارة سوداء بالماكينة (صورة من مكتبة صور)',
      altB: 'يد بقفاز تنظف جانب الإطار بفرشاة (صورة من مكتبة صور)',
    },
    visit: {
      title: 'زورونا',
      area: 'الجرف 2، عجمان',
      address: 'الجرف 2، بالقرب من عجمان سيتي سنتر، عجمان، الإمارات',
      hoursLabel: 'ساعات العمل',
      hours: 'بانتظار التأكيد',
      hoursNote: 'القوائم العامة متضاربة (8:00 حتى 23:30، أو 9:30 حتى 1:00). يؤكدها فيرست جير.',
      phoneTag: 'اتصال وواتساب',
      phones: 'الهاتف',
      directions: 'الاتجاهات',
      reviews: 'مراجعات Google',
    },
    form: {
      title: 'احجز برسالة',
      lede: 'املأ النموذج وسيفتح واتساب ومعه طلبك مكتوبًا.',
      service: 'الخدمة',
      name: 'الاسم',
      car: 'نوع السيارة وطرازها',
      when: 'الموعد المناسب',
      whenOptions: ['اليوم', 'غدًا', 'هذا الأسبوع', 'مرن'],
      notes: 'ملاحظات أخرى (اختياري)',
      submit: 'افتح في واتساب',
      hint: 'لن يُرسل شيء حتى تضغط إرسال في واتساب.',
      required: 'أضف اسمك ونوع سيارتك ليتمكن الفريق من إعطائك السعر.',
      message: ({ service, name, car, when, notes }) =>
        [
          `مرحبًا فيرست جير، أود حجز: ${service}.`,
          `الاسم: ${name}`,
          `السيارة: ${car}`,
          `الموعد: ${when}`,
          notes ? `ملاحظات: ${notes}` : '',
        ]
          .filter(Boolean)
          .join('\n'),
    },
    placeholder: 'مؤقت',
    footer: {
      disclaimer:
        'هذا موقع نموذجي مستقل وغير رسمي صممه بشار عبدالله ليعرض على فيرست جير لتلميع وتنظيف السيارات كيف يمكن أن يبدو موقعهم. لم يطلبه النشاط التجاري. بيانات التواصل والتقييم مأخوذة من القوائم العامة ومن موقع فيرست جير السابق المؤرشف، وتحتاج إلى تأكيد من المالك.',
      credit: 'التصميم والتطوير: بشار عبدالله',
      photos: 'الصور: Luay Barani وZac Nielson على Unsplash (صور توضيحية، ليست من أعمال فيرست جير).',
      sources: 'المصادر: صفحة فيرست جير على خرائط Google (التقييم و224 مراجعة حتى 31 أكتوبر 2026)، وموقع فيرست جير المؤرشف لعام 2022، وLocal Emirates و2GIS.',
    },
    defaultMessage: (service) =>
      service ? `مرحبًا فيرست جير، أود الاستفسار عن ${service}.` : 'مرحبًا فيرست جير، أود الاستفسار عن حجز.',
  },
}

export function whatsappUrl(text: string, number: string = business.whatsapp): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`
}

export function buildBookingUrl(
  message: Dict['form']['message'],
  v: { service: string; name: string; car: string; when: string; notes: string },
): string {
  return whatsappUrl(
    message({ service: v.service, name: v.name.trim(), car: v.car.trim(), when: v.when, notes: v.notes.trim() }),
  )
}
