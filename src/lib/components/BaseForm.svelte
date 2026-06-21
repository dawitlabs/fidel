<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { t } from '$lib/i18n/index';
	import { gsap, ScrollTrigger, SplitText } from '$lib/gsap/register';
	import GlyphMorph from './GlyphMorph.svelte';
	import { ORDERS } from '$lib/data/fidel';

	let container: HTMLElement;

	const baseOrder = ORDERS[0];

	onMount(() => {
		if (!browser) return;

		const mm = gsap.matchMedia();
		mm.add('(prefers-reduced-motion: no-preference)', () => {
			const ctx = gsap.context(() => {
				const heading = container.querySelector('[data-heading]');
				if (heading) {
					const split = SplitText.create(heading, {
						type: 'lines',
						mask: 'lines',
						aria: 'auto',
						autoSplit: true,
						onSplit(self) {
							return gsap.from(self.lines, {
								yPercent: 105,
								duration: 0.8,
								stagger: 0.1,
								ease: 'power3.out',
								scrollTrigger: {
									trigger: container,
									start: 'top 75%',
								},
							});
						},
					});
				}

				gsap.from(container.querySelector('[data-body]'), {
					y: 20,
					autoAlpha: 0,
					duration: 0.8,
					ease: 'power2.out',
					scrollTrigger: {
						trigger: container,
						start: 'top 65%',
					},
				});

				gsap.from(container.querySelector('[data-glyph-card]'), {
					scale: 0.92,
					autoAlpha: 0,
					duration: 0.9,
					ease: 'power2.out',
					scrollTrigger: {
						trigger: container,
						start: 'top 70%',
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
	class="px-[var(--section-x)] py-[var(--section-y)] max-w-6xl mx-auto"
>
	<div class="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
		<!-- Text -->
		<div>
			<p class="et-display text-2xl text-muted mb-6" lang="am" aria-label="ha — base consonant">
				ሀ
			</p>
			<h2
				data-heading
				class="latin-display text-heading leading-none mb-8 font-kerning-none"
				style="font-kerning: none; text-rendering: optimizeSpeed;"
			>
				{$t.base.heading}
			</h2>
			<p data-body class="text-body text-muted leading-relaxed max-w-sm">
				{$t.base.body}
			</p>
		</div>

		<!-- Glyph card -->
		<div
			data-glyph-card
			class="flex flex-col items-center justify-center p-12 border border-border rounded-sm aspect-square relative"
		>
			<GlyphMorph
				char="ሀ"
				class="w-48 h-48 text-ink"
				strokeWidth={0}
				filled={true}
			/>

			<div class="absolute bottom-6 left-6 right-6 flex justify-between items-end">
				<span class="text-label tracking-widest uppercase text-muted">
					{$t.base.label}
				</span>
				<span class="et text-xl text-muted" aria-label="Order 1">
					{baseOrder?.numeral}
				</span>
			</div>
		</div>
	</div>
</section>
