import { browser } from '$app/environment';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';

// Register at module-load time so plugins are available when child components'
// onMount callbacks fire (child onMount runs before parent/layout onMount).
if (browser) {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother, DrawSVGPlugin, MorphSVGPlugin, SplitText, Flip);
}

// Kept for backward compat — callers in layout.svelte still call this, now a no-op
export function registerGSAP() {}

export { gsap, ScrollTrigger, ScrollSmoother, DrawSVGPlugin, MorphSVGPlugin, SplitText, Flip };
