const BASE = 'https://d9seco0wfq8yu.cloudfront.net/dict/sounds/mp3';

// Ethiopic glyph → audio filename on amharicteacher.com CloudFront
const GLYPH_AUDIO: Record<string, string> = {
  // ሀ family
  'ሀ':'ha','ሁ':'hu','ሂ':'hee','ሃ':'ha','ሄ':'hae','ህ':'heh','ሆ':'ho',
  // ለ family
  'ለ':'le','ሉ':'lu','ሊ':'lee','ላ':'la','ሌ':'lay','ል':'leh','ሎ':'lo',
  // ሐ family (same sounds as ሀ)
  'ሐ':'ha','ሑ':'hu','ሒ':'hee','ሓ':'ha','ሔ':'hae','ሕ':'heh','ሖ':'ho',
  // መ family
  'መ':'muh','ሙ':'moo','ሚ':'mee','ማ':'ma','ሜ':'mae','ም':'mih','ሞ':'mo',
  // ሠ family (same sounds as ሰ)
  'ሠ':'seh','ሡ':'soo','ሢ':'see','ሣ':'sa','ሤ':'sae','ሥ':'sih','ሦ':'so',
  // ረ family
  'ረ':'reh','ሩ':'roo','ሪ':'ree','ራ':'ra','ሬ':'rae','ር':'rih','ሮ':'ro',
  // ሰ family
  'ሰ':'seh','ሱ':'soo','ሲ':'see','ሳ':'sa','ሴ':'sae','ስ':'sih','ሶ':'so',
  // ቀ family
  'ቀ':'qeh','ቁ':'qoo','ቂ':'qee','ቃ':'qa','ቄ':'qae','ቅ':'qih','ቆ':'qo',
  // ቸ family
  'ቸ':'cheh','ቹ':'choo','ቺ':'chee','ቻ':'cha','ቼ':'chae','ች':'chih','ቾ':'cho',
  // በ family
  'በ':'beh','ቡ':'boo','ቢ':'bee','ባ':'ba','ቤ':'bae','ብ':'bih','ቦ':'bo',
  // ተ family
  'ተ':'teh','ቱ':'too','ቲ':'tee','ታ':'ta','ቴ':'tae','ት':'tih','ቶ':'to',
  // ነ family
  'ነ':'neh','ኑ':'noo','ኒ':'nee','ና':'na','ኔ':'nae','ን':'nih','ኖ':'no',
  // ኘ family
  'ኘ':'gneh','ኙ':'gnoo','ኚ':'gnee','ኛ':'gna','ኜ':'gnae','ኝ':'gnih','ኞ':'gno',
  // አ family
  'አ':'aa','ኡ':'oo','ኢ':'ee','ኣ':'aa','ኤ':'ae','እ':'ih','ኦ':'o',
  // ከ family
  'ከ':'keh','ኩ':'koo','ኪ':'kee','ካ':'ka','ኬ':'kae','ክ':'kih','ኮ':'ko',
  // ወ family
  'ወ':'weh','ዉ':'woo','ዊ':'wee','ዋ':'wa','ዌ':'wae','ው':'wih','ዎ':'wo',
  // ዐ family (same sounds as አ)
  'ዐ':'aa','ዑ':'oo','ዒ':'ee','ዓ':'aa','ዔ':'ae','ዕ':'ih','ዖ':'o',
  // ዘ family
  'ዘ':'ze','ዙ':'zu','ዚ':'zee','ዛ':'zaa','ዜ':'zae','ዝ':'zih','ዞ':'zo',
  // ዠ family
  'ዠ':'zjeh','ዡ':'zjoo','ዢ':'zjee','ዣ':'zjaa','ዤ':'zjae','ዥ':'zjih','ዦ':'zjo',
  // የ family
  'የ':'ye','ዩ':'yu','ዪ':'yee','ያ':'yaa','ዬ':'yae','ይ':'yih','ዮ':'yo',
  // ደ family
  'ደ':'duh','ዱ':'doo','ዲ':'dee','ዳ':'daa','ዴ':'dae','ድ':'dih','ዶ':'do',
  // ጀ family
  'ጀ':'je','ጁ':'joo','ጂ':'jee','ጃ':'jaa','ጄ':'jae','ጅ':'jih','ጆ':'jo',
  // ገ family
  'ገ':'guh','ጉ':'goo','ጊ':'gee','ጋ':'ga','ጌ':'gae','ግ':'gih','ጎ':'go',
  // ጠ family
  'ጠ':'tte','ጡ':'ttu','ጢ':'ttee','ጣ':'ttaa','ጤ':'ttae','ጥ':'ttih','ጦ':'tto',
  // ጨ family
  'ጨ':'chhe','ጩ':'chhoo','ጪ':'chhee','ጫ':'chhaa','ጬ':'chhae','ጭ':'chhih','ጮ':'cho',
  // ጰ family
  'ጰ':'ppuh','ጱ':'ppoo','ጲ':'ppee','ጳ':'ppaa','ጴ':'ppae','ጵ':'ppih','ጶ':'ppo',
  // ጸ family
  'ጸ':'tse','ጹ':'tsoo','ጺ':'tsee','ጻ':'tsaa','ጼ':'tsae','ጽ':'tsih','ጾ':'tso',
  // ፀ family (same sounds as ጸ)
  'ፀ':'tse','ፁ':'tsoo','ፂ':'tsee','ፃ':'tsaa','ፄ':'tsae','ፅ':'tsih','ፆ':'tso',
  // ፈ family
  'ፈ':'fuh','ፉ':'foo','ፊ':'fee','ፋ':'faa','ፌ':'fae','ፍ':'fih','ፎ':'fo',
  // ፐ family
  'ፐ':'peh','ፑ':'poo','ፒ':'pee','ፓ':'paa','ፔ':'pae','ፕ':'pih','ፖ':'po',
};

let current: HTMLAudioElement | null = null;

export function speak(glyph: string): void {
  if (typeof window === 'undefined') return;
  const file = GLYPH_AUDIO[glyph];
  if (!file) return;

  if (current) {
    current.pause();
    current.currentTime = 0;
  }
  current = new Audio(`${BASE}/${file}.mp3`);
  current.play().catch(() => {});
}

export function hasAudio(glyph: string): boolean {
  return glyph in GLYPH_AUDIO;
}

// Legacy shim so existing callers that use hasTTS() still compile
export const hasTTS = () => true;
