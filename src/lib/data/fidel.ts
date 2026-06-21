export type FidelOrder = {
  order: number;
  glyph: string;
  sound: string;
  name: string;         // traditional Ge'ez order name
  nameEn: string;       // English transliteration of order name
  numeral: string;      // Ge'ez ordinal
};

export type FidelRow = {
  base: string;         // consonant Unicode character (used as key)
  sound: string;        // IPA-ish romanisation of the base
  orders: string[];     // 7 glyphs in order
};

export const ORDERS: FidelOrder[] = [
  { order: 1, glyph: 'ሀ', sound: 'hä', name: 'ግዕዝ',  nameEn: "Ge'ez",  numeral: '፩' },
  { order: 2, glyph: 'ሁ', sound: 'hu', name: 'ካዕብ',  nameEn: 'Kaeb',   numeral: '፪' },
  { order: 3, glyph: 'ሂ', sound: 'hi', name: 'ሣልስ',  nameEn: 'Salis',  numeral: '፫' },
  { order: 4, glyph: 'ሃ', sound: 'ha', name: 'ራብዕ',  nameEn: "Rabi'",  numeral: '፬' },
  { order: 5, glyph: 'ሄ', sound: 'he', name: 'ኃምስ',  nameEn: 'Hamis',  numeral: '፭' },
  { order: 6, glyph: 'ህ', sound: 'hə', name: 'ሳድስ',  nameEn: 'Sadis',  numeral: '፮' },
  { order: 7, glyph: 'ሆ', sound: 'ho', name: 'ሳብዕ',  nameEn: "Sabi'",  numeral: '፯' },
];

// Ge'ez numeral system — additive/multiplicative
export const GEEZ_NUMERALS: Record<number, string> = {
  1: '፩', 2: '፪', 3: '፫', 4: '፬', 5: '፭', 6: '፮', 7: '፯', 8: '፰', 9: '፱',
  10: '፲', 20: '፳', 30: '፴', 40: '፵', 50: '፶', 60: '፷', 70: '፸', 80: '፹', 90: '፺',
  100: '፻', 10000: '፼',
};

// Full Amharic Fidel matrix — 30 consonant family rows × 7 vowel orders
export const MATRIX_ROWS: FidelRow[] = [
  { base: 'ሀ', sound: 'h',  orders: ['ሀ','ሁ','ሂ','ሃ','ሄ','ህ','ሆ'] },
  { base: 'ለ', sound: 'l',  orders: ['ለ','ሉ','ሊ','ላ','ሌ','ል','ሎ'] },
  { base: 'ሐ', sound: 'ḥ',  orders: ['ሐ','ሑ','ሒ','ሓ','ሔ','ሕ','ሖ'] },
  { base: 'መ', sound: 'm',  orders: ['መ','ሙ','ሚ','ማ','ሜ','ም','ሞ'] },
  { base: 'ሠ', sound: 'ś',  orders: ['ሠ','ሡ','ሢ','ሣ','ሤ','ሥ','ሦ'] },
  { base: 'ረ', sound: 'r',  orders: ['ረ','ሩ','ሪ','ራ','ሬ','ር','ሮ'] },
  { base: 'ሰ', sound: 's',  orders: ['ሰ','ሱ','ሲ','ሳ','ሴ','ስ','ሶ'] },
  { base: 'ቀ', sound: 'q',  orders: ['ቀ','ቁ','ቂ','ቃ','ቄ','ቅ','ቆ'] },
  { base: 'ቸ', sound: 'č',  orders: ['ቸ','ቹ','ቺ','ቻ','ቼ','ች','ቾ'] },
  { base: 'በ', sound: 'b',  orders: ['በ','ቡ','ቢ','ባ','ቤ','ብ','ቦ'] },
  { base: 'ተ', sound: 't',  orders: ['ተ','ቱ','ቲ','ታ','ቴ','ት','ቶ'] },
  { base: 'ነ', sound: 'n',  orders: ['ነ','ኑ','ኒ','ና','ኔ','ን','ኖ'] },
  { base: 'ኘ', sound: 'ñ',  orders: ['ኘ','ኙ','ኚ','ኛ','ኜ','ኝ','ኞ'] },
  { base: 'አ', sound: 'ā',  orders: ['አ','ኡ','ኢ','ኣ','ኤ','እ','ኦ'] },
  { base: 'ከ', sound: 'k',  orders: ['ከ','ኩ','ኪ','ካ','ኬ','ክ','ኮ'] },
  { base: 'ወ', sound: 'w',  orders: ['ወ','ዉ','ዊ','ዋ','ዌ','ው','ዎ'] },
  { base: 'ዐ', sound: 'ʕ',  orders: ['ዐ','ዑ','ዒ','ዓ','ዔ','ዕ','ዖ'] },
  { base: 'ዘ', sound: 'z',  orders: ['ዘ','ዙ','ዚ','ዛ','ዜ','ዝ','ዞ'] },
  { base: 'ዠ', sound: 'ž',  orders: ['ዠ','ዡ','ዢ','ዣ','ዤ','ዥ','ዦ'] },
  { base: 'የ', sound: 'y',  orders: ['የ','ዩ','ዪ','ያ','ዬ','ይ','ዮ'] },
  { base: 'ደ', sound: 'd',  orders: ['ደ','ዱ','ዲ','ዳ','ዴ','ድ','ዶ'] },
  { base: 'ጀ', sound: 'j',  orders: ['ጀ','ጁ','ጂ','ጃ','ጄ','ጅ','ጆ'] },
  { base: 'ገ', sound: 'g',  orders: ['ገ','ጉ','ጊ','ጋ','ጌ','ግ','ጎ'] },
  { base: 'ጠ', sound: 'ṭ',  orders: ['ጠ','ጡ','ጢ','ጣ','ጤ','ጥ','ጦ'] },
  { base: 'ጨ', sound: 'č̣', orders: ['ጨ','ጩ','ጪ','ጫ','ጬ','ጭ','ጮ'] },
  { base: 'ጰ', sound: 'p̣', orders: ['ጰ','ጱ','ጲ','ጳ','ጴ','ጵ','ጶ'] },
  { base: 'ጸ', sound: 'ṣ',  orders: ['ጸ','ጹ','ጺ','ጻ','ጼ','ጽ','ጾ'] },
  { base: 'ፀ', sound: 'ṣ̈', orders: ['ፀ','ፁ','ፂ','ፃ','ፄ','ፅ','ፆ'] },
  { base: 'ፈ', sound: 'f',  orders: ['ፈ','ፉ','ፊ','ፋ','ፌ','ፍ','ፎ'] },
  { base: 'ፐ', sound: 'p',  orders: ['ፐ','ፑ','ፒ','ፓ','ፔ','ፕ','ፖ'] },
];
