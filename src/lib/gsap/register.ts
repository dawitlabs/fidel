import { browser } from '$app/environment';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';

let registered = false;

export function registerGSAP() {
  if (!browser || registered) return;
  gsap.registerPlugin(
    ScrollTrigger,
    ScrollSmoother,
    DrawSVGPlugin,
    MorphSVGPlugin,
    SplitText,
    Flip,
  );
  registered = true;
}

export { gsap, ScrollTrigger, ScrollSmoother, DrawSVGPlugin, MorphSVGPlugin, SplitText, Flip };
