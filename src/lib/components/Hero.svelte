<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { t } from '$lib/i18n/index';
	import { gsap, ScrollTrigger, DrawSVGPlugin, SplitText } from '$lib/gsap/register';
	import GlyphMorph from './GlyphMorph.svelte';

	let container: HTMLElement;
	let glyphEl: SVGElement;

	onMount(() => {
		if (!browser) return;

		const mm = gsap.matchMedia();

		mm.add(
			{
				motion: '(prefers-reduced-motion: no-preference)',
				reduced: '(prefers-reduced-motion: reduce)',
			},
			(ctx) => {
				const { reduced } = ctx.conditions as { motion: boolean; reduced: boolean };

				if (reduced) {
					// Static fallback: show everything immediately
					gsap.set(container.querySelectorAll('[data-animate]'), { autoAlpha: 1, y: 0 });
					return;
				}

				const ctx2 = gsap.context(() => {
					// 1. Background glyph scale in
					const glyphEl = container.querySelector('.hero-glyph');
					if (glyphEl) {
						gsap.from(glyphEl, { scale: 0.92, autoAlpha: 0, duration: 1.2, ease: 'power2.out' });
					}

					// 2. Eyebrow fade in — no SplitText so locale changes work live
					const eyebrow = container.querySelector('[data-eyebrow]');
					if (eyebrow) {
						gsap.from(eyebrow, {
							y: 8,
							autoAlpha: 0,
							duration: 0.6,
							ease: 'power3.out',
							delay: 0.8,
						});
					}

					// 3. Subtitle fade up
					const subtitle = container.querySelector('[data-subtitle]');
					if (subtitle) {
						gsap.from(subtitle, {
							y: 24,
							autoAlpha: 0,
							duration: 0.8,
							ease: 'power2.out',
							delay: 1.4,
						});
					}

					// 4. Scroll hint
					const scrollHint = container.querySelector('[data-scroll-hint]');
					if (scrollHint) {
						gsap.from(scrollHint, {
							y: 12,
							autoAlpha: 0,
							duration: 0.6,
							ease: 'power2.out',
							delay: 2,
						});
					}
				}, container);

				return () => ctx2.revert();
			},
		);

		return () => mm.revert();
	});
</script>

<section
	bind:this={container}
	class="relative min-h-[100dvh] flex flex-col items-center justify-center px-[var(--section-x)] pt-24 pb-16 overflow-hidden"
	aria-label="Hero"
>
	<!-- Large background glyph — draw on via DrawSVG -->
	<div
		class="hero-glyph absolute inset-0 flex items-center justify-center pointer-events-none select-none"
		aria-hidden="true"
	>
		<GlyphMorph
			char="ሀ"
			class="w-[70vmin] h-[70vmin] text-ink opacity-[0.07]"
			strokeWidth={8}
			filled={true}
		/>
	</div>

	<!-- Content -->
	<div class="relative z-10 text-center max-w-3xl">
		<p
			data-eyebrow
			class="latin-display text-label tracking-[0.25em] uppercase text-muted mb-6"
		>
			{$t.hero.eyebrow}
		</p>

		<h1
			class="et-display font-normal leading-none text-hero text-ink mb-8 select-none"
			aria-label="ፊደል"
		>
			{$t.hero.title}
		</h1>

		<p
			data-subtitle
			class="text-sub text-muted max-w-md mx-auto leading-relaxed"
		>
			{$t.hero.subtitle}
		</p>
	</div>

	<!-- Scroll hint -->
	<div
		data-scroll-hint
		class="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
		aria-hidden="true"
	>
		<span class="text-label tracking-widest uppercase text-muted">
			{$t.hero.scroll}
		</span>
		<div class="w-px h-12 bg-[var(--color-border)]"></div>
	</div>
</section>
