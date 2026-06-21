/**
 * Amharic TTS via Web Speech API.
 * Degrades silently when no 'am' voice is available.
 */

let amVoice: SpeechSynthesisVoice | null | undefined = undefined;

function resolveVoice(): SpeechSynthesisVoice | null {
	if (typeof window === 'undefined' || !window.speechSynthesis) return null;
	if (amVoice !== undefined) return amVoice;

	const voices = window.speechSynthesis.getVoices();
	amVoice =
		voices.find((v) => v.lang === 'am' || v.lang.startsWith('am-')) ??
		voices.find((v) => v.lang === 'am-ET') ??
		null;
	return amVoice;
}

// Voices load async on first call in some browsers
if (typeof window !== 'undefined' && window.speechSynthesis) {
	window.speechSynthesis.addEventListener('voiceschanged', () => {
		amVoice = undefined; // invalidate cache
		resolveVoice();
	});
}

export function speak(text: string): void {
	if (typeof window === 'undefined' || !window.speechSynthesis) return;

	window.speechSynthesis.cancel();
	const utt = new SpeechSynthesisUtterance(text);
	utt.lang = 'am';
	utt.rate = 0.85;

	const voice = resolveVoice();
	if (voice) utt.voice = voice;

	window.speechSynthesis.speak(utt);
}

export function hasTTS(): boolean {
	return typeof window !== 'undefined' && 'speechSynthesis' in window;
}
