<script lang="ts">
	/**
	 * Centerpiece: pinned scroll section.
	 * As the user scrolls, MorphSVGPlugin tweens the SVG path
	 * through all 7 vowel orders of ሀ → ሁ → ሂ → ሃ → ሄ → ህ → ሆ.
	 * Labels update on each order.
	 */
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { t } from '$lib/i18n/index';
	import { gsap, ScrollTrigger, MorphSVGPlugin } from '$lib/gsap/register';
	import { ORDERS } from '$lib/data/fidel';
	import glyphData from '$lib/data/glyphs.json';

	type GlyphsFile = { _note: string; glyphs: Record<string, { d: string; viewBox: string }> };
	const glyphs = (glyphData as GlyphsFile).glyphs;

	let container: HTMLElement;
	let morphPath: SVGPathElement;
	let activeIndex = $state(0);

	const currentOrder = $derived(ORDERS[activeIndex]);

	onMount(() => {
		if (!browser) return;

		const paths = ORDERS.map((o) => glyphs[o.glyph]?.d ?? '');

		if (paths.some((p) => !p)) {
			console.warn('OrdersScroll: missing glyph paths, falling back to static');
			return;
		}

		const mm = gsap.matchMedia();

		mm.add(
			{
				motion: '(prefers-reduced-motion: no-preference)',
				reduced: '(prefers-reduced-motion: reduce)',
			},
			(ctx) => {
				const { reduced } = ctx.conditions as { motion: boolean; reduced: boolean };

				if (reduced) {
					// Static: show final form
					activeIndex = ORDERS.length - 1;
					if (morphPath && paths[ORDERS.length - 1]) {
						morphPath.setAttribute('d', paths[ORDERS.length - 1] ?? '');
					}
					return;
				}

				const ctx2 = gsap.context(() => {
					// Build a timeline with one morph tween per order transition
					const tl = gsap.timeline({
						scrollTrigger: {
							trigger: container,
							start: 'top top',
							end: `+=${ORDERS.length * 150}%`,
							pin: true,
							scrub: 1.2,
							anticipatePin: 1,
							onUpdate(self) {
								const idx = Math.min(
									ORDERS.length - 1,
									Math.floor(self.progress * ORDERS.length),
								);
								activeIndex = idx;
							},
						},
					});

					// Chain morph from each order to the next
					for (let i = 1; i < paths.length; i++) {
						const shape = paths[i];
						if (!shape) continue;
						tl.to(morphPath, {
							morphSVG: { shape, type: 'rotational' },
							duration: 1,
							ease: 'power1.inOut',
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
	class="relative w-full"
	aria-label="The seven Fidel orders"
>
	<!-- 100vh sticky viewport -->
	<div class="min-h-screen flex flex-col md:flex-row items-center justify-between px-[var(--section-x)] gap-12">

		<!-- Left: labels -->
		<div class="flex-1 flex flex-col justify-center max-w-xs">
			<p class="text-label tracking-widest uppercase text-muted mb-6">
				{$t.orders.eyebrow}
			</p>

			<h2
				class="latin-display text-display leading-none mb-10"
				style="font-kerning: none;"
			>
				{$t.orders.heading}
			</h2>

			<!-- Order metadata — updates as morph progresses -->
			{#if currentOrder}
				<div class="space-y-4 border-t border-border pt-6">
					<div class="flex justify-between items-baseline">
						<span class="text-label tracking-widest uppercase text-muted">
							{$t.orders.orderLabel}
						</span>
						<span class="et text-2xl">{currentOrder.numeral}</span>
					</div>
					<div class="flex justify-between items-baseline">
						<span class="text-label tracking-widest uppercase text-muted">
							{$t.orders.soundLabel}
						</span>
						<span class="font-semibold">{currentOrder.sound}</span>
					</div>
					<div class="flex justify-between items-baseline">
						<span class="text-label tracking-widest uppercase text-muted">
							{$t.orders.nameLabel}
						</span>
						<span class="et text-xl" title={currentOrder.nameEn}>{currentOrder.name}</span>
					</div>
				</div>
			{/if}

			<!-- Progress dots -->
			<div class="flex gap-2 mt-8" aria-hidden="true">
				{#each ORDERS as order, i}
					<div
						class="w-1.5 h-1.5 rounded-full transition-colors duration-200 {i === activeIndex
							? 'bg-ink'
							: 'bg-border'}"
					></div>
				{/each}
			</div>
		</div>

		<!-- Right: morphing glyph -->
		<div class="flex-1 flex items-center justify-center">
			<svg
				viewBox={glyphs['ሀ']?.viewBox ?? '0 0 1000 1000'}
				xmlns="http://www.w3.org/2000/svg"
				class="w-[clamp(240px,45vmin,520px)] h-[clamp(240px,45vmin,520px)] text-ink"
				aria-label={currentOrder?.glyph}
				role="img"
				style="will-change: transform;"
			>
				<path
					bind:this={morphPath}
					d={glyphs['ሀ']?.d ?? ''}
					fill="currentColor"
					stroke="none"
				/>
			</svg>
		</div>
	</div>

	<!-- Body copy below the pin area -->
	<div class="px-[var(--section-x)] pb-[var(--section-y)] max-w-lg">
		<p class="text-body text-muted leading-relaxed">
			{$t.orders.body}
		</p>
	</div>
</section>
