<script lang="ts">
	import { t, toggleLocale } from '$lib/i18n/index';
</script>

<button
	onclick={toggleLocale}
	aria-label="Switch language"
	class="text-xs font-semibold tracking-widest uppercase px-3 py-1.5 border border-border rounded-full transition-colors duration-150 hover:border-ink hover:bg-ink hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
>
	{$t.nav.toggle}
</button>
