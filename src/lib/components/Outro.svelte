<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { t } from '$lib/i18n/index';
	import { gsap, SplitText } from '$lib/gsap/register';

	let container: HTMLElement;

	onMount(() => {
		if (!browser) return;

		const mm = gsap.matchMedia();
		mm.add('(prefers-reduced-motion: no-preference)', () => {
			const ctx = gsap.context(() => {
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
								duration: 0.9,
								stagger: 0.12,
								ease: 'power3.out',
								scrollTrigger: { trigger: heading, start: 'top 80%' },
							});
						},
					});
				}

				gsap.from(container.querySelector('[data-body]'), {
					y: 20,
					autoAlpha: 0,
					duration: 0.8,
					ease: 'power2.out',
					delay: 0.2,
					scrollTrigger: { trigger: container, start: 'top 75%' },
				});

				gsap.from(container.querySelector('[data-credit]'), {
					y: 12,
					autoAlpha: 0,
					duration: 0.6,
					ease: 'power2.out',
					delay: 0.4,
					scrollTrigger: { trigger: container, start: 'top 70%' },
				});
			}, container);

			return () => ctx.revert();
		});

		return () => mm.revert();
	});
</script>

<section
	bind:this={container}
	class="px-[var(--section-x)] py-[var(--section-y)] max-w-4xl mx-auto text-center"
>
	<!-- Large decorative Ge'ez glyph -->
	<div class="et-display text-[clamp(5rem,15vw,12rem)] leading-none opacity-[0.06] select-none mb-16" aria-hidden="true">
		ፊደል
	</div>

	<h2
		data-heading
		class="latin-display text-display leading-none mb-8"
		style="font-kerning: none;"
	>
		{$t.outro.heading}
	</h2>

	<p
		data-body
		class="text-sub text-muted leading-relaxed max-w-xl mx-auto mb-16"
	>
		{$t.outro.body}
	</p>

	<p data-credit class="text-label tracking-widest uppercase text-muted">
		{$t.outro.credit}
	</p>
</section>
