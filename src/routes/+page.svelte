<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import BaseForm from '$lib/components/BaseForm.svelte';
	import OrdersScroll from '$lib/components/OrdersScroll.svelte';
	import FidelMatrix from '$lib/components/FidelMatrix.svelte';
	import Numerals from '$lib/components/Numerals.svelte';
	import Outro from '$lib/components/Outro.svelte';
</script>

<svelte:head>
	<title>ፊደል — Anatomy of a Letter</title>
	<meta
		name="description"
		content="A bilingual scrollytelling piece on Ethiopic script — how one consonant becomes seven letters through the Fidel system."
	/>
	<meta property="og:title" content="ፊደል — Anatomy of a Letter" />
	<meta
		property="og:description"
		content="One consonant. Seven vowel orders. The whole Ethiopic writing system, animated."
	/>
</svelte:head>

<main>
	<Hero />
	<BaseForm />
	<OrdersScroll />
	<FidelMatrix />
	<Numerals />
	<Outro />
</main>
