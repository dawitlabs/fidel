<script lang="ts">
	/**
	 * Renders a single Ge'ez glyph as an inline SVG <path>.
	 * Used by Hero (DrawSVG) and OrdersScroll (MorphSVG).
	 * The path `d` and viewBox come from glyphs.json (extracted by opentype.js).
	 */
	import glyphData from '$lib/data/glyphs.json';

	type GlyphEntry = {
		char: string;
		d: string;
		font: string;
		upem: number;
		viewBox: string;
		bbox: { x1: number; y1: number; x2: number; y2: number };
	};

	type GlyphsFile = {
		_note: string;
		glyphs: Record<string, GlyphEntry>;
	};

	const data = glyphData as GlyphsFile;

	let {
		char,
		class: className = '',
		strokeWidth = 12,
		filled = false,
	}: {
		char: string;
		class?: string;
		strokeWidth?: number;
		filled?: boolean;
	} = $props();

	const glyph = $derived(data.glyphs[char]);
</script>

{#if glyph}
	<svg
		viewBox={glyph.viewBox}
		xmlns="http://www.w3.org/2000/svg"
		aria-label={char}
		role="img"
		class={className}
	>
		<path
			d={glyph.d}
			fill={filled ? 'currentColor' : 'none'}
			stroke="currentColor"
			stroke-width={strokeWidth}
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{:else}
	<!-- Fallback to webfont text if path not extracted -->
	<span class="et-display {className}" aria-label={char}>{char}</span>
{/if}
