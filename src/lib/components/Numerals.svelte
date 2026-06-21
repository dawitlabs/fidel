<script lang="ts">
	/**
	 * Ge'ez numeral system interlude.
	 * Counter tweens: 1 → 10 → 100 → 10,000 using gsap ticker.
	 */
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { t } from '$lib/i18n/index';
	import { gsap, ScrollTrigger } from '$lib/gsap/register';
	import { GEEZ_NUMERALS } from '$lib/data/fidel';

	let container: HTMLElement;

	// The four showcase values
	const STEPS = [1, 10, 100, 10000] as const;
	type Step = (typeof STEPS)[number];

	function toGeez(n: number): string {
		const keys = [10000, 100, 90, 80, 70, 60, 50, 40, 30, 20, 9, 8, 7, 6, 5, 4, 3, 2, 1] as const;
		let result = '';
		let remaining = n;
		for (const k of keys) {
			const glyph = GEEZ_NUMERALS[k];
			if (glyph && remaining >= k) {
				const times = Math.floor(remaining / k);
				result += glyph.repeat(times);
				remaining -= times * k;
			}
		}
		return result || '፩';
	}

	// Reactive display values per step (start at arabic 0)
	let displayValues = $state<Record<Step, string>>({ 1: '0', 10: '0', 100: '0', 10000: '0' });
	let geezValues = $state<Record<Step, string>>({ 1: '፩', 10: '፲', 100: '፻', 10000: '፼' });

	onMount(() => {
		if (!browser) return;

		const mm = gsap.matchMedia();
		mm.add('(prefers-reduced-motion: no-preference)', () => {
			const ctx = gsap.context(() => {
				const proxy = { v1: 0, v10: 0, v100: 0, v10000: 0 };

				gsap.to(proxy, {
					v1: 1,
					v10: 10,
					v100: 100,
					v10000: 10000,
					duration: 2.5,
					ease: 'power2.out',
					onUpdate() {
						displayValues = {
							1: Math.round(proxy.v1).toString(),
							10: Math.round(proxy.v10).toString(),
							100: Math.round(proxy.v100).toString(),
							10000: Math.round(proxy.v10000).toLocaleString(),
						};
						geezValues = {
							1: toGeez(Math.max(1, Math.round(proxy.v1))),
							10: toGeez(Math.max(1, Math.round(proxy.v10))),
							100: toGeez(Math.max(1, Math.round(proxy.v100))),
							10000: toGeez(Math.max(1, Math.round(proxy.v10000))),
						};
					},
					scrollTrigger: {
						trigger: container,
						start: 'top 70%',
						toggleActions: 'play none none none',
					},
				});
			}, container);

			return () => ctx.revert();
		});

		return () => mm.revert();
	});
</script>

<section
	bind:this={container}
	class="px-[var(--section-x)] py-[var(--section-y)] bg-ink text-paper"
>
	<div class="max-w-6xl mx-auto">
		<p class="text-label tracking-widest uppercase opacity-50 mb-6">
			{$t.numerals.eyebrow}
		</p>

		<h2
			class="latin-display text-heading leading-none mb-10"
			style="font-kerning: none; color: var(--color-paper);"
		>
			{$t.numerals.heading}
		</h2>

		<p class="text-body opacity-60 leading-relaxed max-w-lg mb-16">
			{$t.numerals.body}
		</p>

		<!-- Counter grid -->
		<div class="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 mb-12">
			{#each STEPS as step}
				<div class="flex flex-col gap-3">
					<!-- Ge'ez glyph -->
					<div class="et-display text-[clamp(3rem,8vw,6rem)] leading-none opacity-90">
						{geezValues[step]}
					</div>
					<!-- Arabic numeral -->
					<div class="text-small font-semibold tracking-widest opacity-40 tabular-nums">
						{displayValues[step]}
					</div>
					<!-- Divider -->
					<div class="w-8 h-px bg-current opacity-20"></div>
					<!-- Value label -->
					<div class="text-label tracking-widest uppercase opacity-40">
						{step.toLocaleString()}
					</div>
				</div>
			{/each}
		</div>

		<p class="text-label opacity-40 max-w-sm leading-relaxed">
			{$t.numerals.caption}
		</p>
	</div>
</section>
