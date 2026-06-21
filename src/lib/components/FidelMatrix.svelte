<script lang="ts">
	/**
	 * Full Fidel grid — HTML webfont text with staggered SplitText reveal.
	 * Rows = consonant families, columns = the 7 orders.
	 */
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { t } from '$lib/i18n/index';
	import { gsap, ScrollTrigger, SplitText } from '$lib/gsap/register';
	import { MATRIX_ROWS, ORDERS } from '$lib/data/fidel';
	import { speak, hasAudio } from '$lib/audio';

	let container: HTMLElement;

	onMount(() => {
		if (!browser) return;

		const mm = gsap.matchMedia();
		mm.add('(prefers-reduced-motion: no-preference)', () => {
			const ctx = gsap.context(() => {
				// Heading reveal
				const heading = container.querySelector('[data-heading]');
				if (heading) {
					SplitText.create(heading, {
						type: 'lines',
						mask: 'lines',
						aria: 'auto',
						autoSplit: true,
						onSplit(self) {
							return gsap.from(self.lines, {
								yPercent: 110,
								duration: 0.7,
								stagger: 0.1,
								ease: 'power3.out',
								scrollTrigger: { trigger: heading, start: 'top 80%' },
							});
						},
					});
				}

				// Body copy fade
				gsap.from(container.querySelector('[data-body]'), {
					y: 16,
					autoAlpha: 0,
					duration: 0.7,
					ease: 'power2.out',
					scrollTrigger: { trigger: container, start: 'top 70%' },
				});

				// Grid cells stagger — each cell is a small element
				const cells = container.querySelectorAll('[data-cell]');
				gsap.from(cells, {
					autoAlpha: 0,
					y: 8,
					stagger: { each: 0.015, from: 'start' },
					duration: 0.4,
					ease: 'power2.out',
					scrollTrigger: {
						trigger: container.querySelector('[data-grid]'),
						start: 'top 80%',
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
	class="px-[var(--section-x)] py-[var(--section-y)] max-w-7xl mx-auto"
>
	<p class="text-label tracking-widest uppercase text-muted mb-6">
		{$t.matrix.eyebrow}
	</p>

	<h2
		data-heading
		class="latin-display text-heading leading-none mb-6"
		style="font-kerning: none;"
	>
		{$t.matrix.heading}
	</h2>

	<p data-body class="text-body text-muted leading-relaxed max-w-lg mb-16">
		{$t.matrix.body}
	</p>

	<!-- Grid: 8 columns (1 label + 7 orders) -->
	<div
		data-grid
		class="overflow-x-auto -mx-[var(--section-x)] px-[var(--section-x)]"
		role="table"
		aria-label="Fidel syllable matrix"
	>
		<!-- Column headers -->
		<div
			class="grid gap-px mb-2 min-w-[32rem]"
			style="grid-template-columns: 3rem repeat(7, minmax(3.5rem, 1fr));"
			role="row"
		>
			<div
				class="text-label text-muted tracking-wide text-center py-2"
				role="columnheader"
			>
				{$t.matrix.rowHeader}
			</div>
			{#each ORDERS as order}
				<div
					class="text-center py-2 flex flex-col items-center gap-0.5"
					role="columnheader"
				>
					<span class="et text-xs text-muted">{order.numeral}</span>
					<span class="text-label text-muted tracking-wide">{order.sound}</span>
				</div>
			{/each}
		</div>

		<!-- Rows -->
		{#each MATRIX_ROWS as row}
			<div
				class="grid gap-px border-t border-border min-w-[32rem]"
				style="grid-template-columns: 3rem repeat(7, minmax(3.5rem, 1fr));"
				role="row"
			>
				<!-- Row label -->
				<div
					class="flex items-center justify-center py-3 text-label text-muted"
					role="rowheader"
					aria-label="base {row.sound}"
				>
					{row.sound}
				</div>
				<!-- 7 order cells -->
				{#each row.orders as glyph, i}
					<div
						data-cell
						class="flex items-center justify-center py-3 et text-[clamp(1rem,2vw,1.5rem)] transition-colors duration-100 hover:text-ink text-ink-2
						{i === 0 ? 'font-semibold et-display' : ''}
						{hasAudio(glyph) ? 'cursor-pointer select-none' : 'cursor-default'}"
						role="cell"
						tabindex={hasAudio(glyph) ? 0 : undefined}
						aria-label="{row.sound}{ORDERS[i]?.sound ?? ''}"
						title="{ORDERS[i]?.name ?? ''}"
						onclick={() => speak(glyph)}
						onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && speak(glyph)}
					>
						{glyph}
					</div>
				{/each}
			</div>
		{/each}
	</div>
</section>
