export const en = {
  lang: 'EN',
  langFull: 'English',
  nav: {
    toggle: 'አማ',
  },
  hero: {
    eyebrow: 'An anatomy of',
    title: 'ፊደል',
    subtitle: 'Each Ethiopian letter contains a consonant, a vowel, and a universe.',
    scroll: 'Scroll to explore',
  },
  base: {
    heading: 'A single sound',
    body: 'In Amharic and other Ethiopic languages, every letter — called a fidel (ፊደል) — is a syllable, not just a consonant. The base form carries the vowel "ä". It is both a sound and a shape.',
    label: 'Base form — first order',
  },
  orders: {
    eyebrow: 'The seven orders',
    heading: 'One consonant, seven forms',
    body: 'Each base consonant has seven variants, one for each vowel. The shape shifts — sometimes subtly, sometimes dramatically — to encode the vowel in the body of the letter itself.',
    orderLabel: 'Order',
    soundLabel: 'Sound',
    nameLabel: 'Name',
  },
  matrix: {
    eyebrow: 'The full system',
    heading: 'The Fidel matrix',
    body: 'Columns are orders (vowels). Rows are consonant families. Every cell is a syllable, pronounced by combining the row and column.',
    colHeader: 'Order',
    rowHeader: 'Base',
  },
  numerals: {
    eyebrow: 'Counting in Ge\'ez',
    heading: 'The numeral system',
    body: 'Ethiopic has its own numeral glyphs, used decoratively and in traditional contexts. The system is additive and multiplicative.',
    caption: 'Ge\'ez numerals are for decoration and tradition — never for data tables or prices.',
  },
  outro: {
    heading: 'A living script',
    body: 'Ethiopic script has been in continuous use for over two millennia. It is the writing system of more than 50 million people. Every letter you see here is still being written today.',
    credit: 'Made with GSAP · Abyssinica SIL · Noto Sans Ethiopic',
  },
};

export type Translations = typeof en;
