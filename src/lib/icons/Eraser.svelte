<script>
	export let size = 24;
	export let strokeWidth = 0;

	$: size = typeof size == Number ? `${size}px` : size;
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	fill="none"
	viewBox="0 0 24 24"
	width={size}
	height={size}
	stroke-width={strokeWidth}
	stroke="currentColor"
>
	<path
		fill="currentColor"
		d="M22.74 7.716 16.284 1.26a.89.89 0 0 0-1.257 0L5 11.287 12.713 19 22.74 8.973a.89.89 0 0 0 0-1.257ZM3.785 13l-2.541 2.541a.832.832 0 0 0 0 1.176l6.038 6.04a.832.832 0 0 0 1.177 0L11 20.215 3.785 13Z"
	/>
</svg>
