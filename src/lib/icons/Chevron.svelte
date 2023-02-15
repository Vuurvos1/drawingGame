<script>
	export let size = 24;
	export let strokeWidth = 2;
	export let direction = 'up';

	$: size = typeof size == Number ? `${size}px` : size;
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width={strokeWidth}
	stroke-linecap="round"
	stroke-linejoin="round"
	style:transform="rotate({direction === 'right'
		? 90
		: direction === 'down'
		? 180
		: direction === 'left'
		? 270
		: 0}deg)"
>
	<polyline points="18 15 12 9 6 15" />
</svg>
