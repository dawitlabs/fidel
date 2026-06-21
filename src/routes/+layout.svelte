<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import '../app.css';
	import { registerGSAP, gsap, ScrollTrigger, ScrollSmoother } from '$lib/gsap/register';
	import LangToggle from '$lib/components/LangToggle.svelte';

	let { children } = $props();
	let smoother: ReturnType<typeof ScrollSmoother.create> | null = null;

	onMount(() => {
		if (!browser) return;
		registerGSAP();

		// ScrollSmoother breaks native touch scroll — desktop only
		const isTouch = window.matchMedia('(pointer: coarse)').matches;
		if (!isTouch) {
			document.documentElement.classList.add('smoother-active');
			smoother = ScrollSmoother.create({
				wrapper: '#smooth-wrapper',
				content: '#smooth-content',
				smooth: 1.5,
				effects: true,
			});
		}

		// Refresh ScrollTrigger after Ethiopic fonts load to correct trigger positions
		document.fonts.ready.then(() => {
			ScrollTrigger.refresh();
		});

		return () => {
			smoother?.kill();
			ScrollTrigger.getAll().forEach((t) => t.kill());
		};
	});
</script>

<nav class="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-10">
	<a href="/" class="text-ink text-sm font-semibold tracking-widest uppercase">
		ፊደል
	</a>
	<LangToggle />
</nav>

<div id="smooth-wrapper">
	<div id="smooth-content">
		{@render children()}
	</div>
</div>
