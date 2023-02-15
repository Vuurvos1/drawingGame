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
		d="M21.46 11.187V9.825h-2.082l-6.297-6.298.566-.566L12.685 2l-8.187 8.187a2.607 2.607 0 0 0-1.775.597c-1.43 1.17-1.974 3.867-1.616 8.018l1.355-.117c-.294-3.411.093-5.177.552-6.09l.5.5.566-.566 9.92 9.92 9-9-2.262-2.262h.723Zm-.384 2.261L14 20.524l-8.958-8.957L12.12 4.49l5.335 5.335H13.33a2.027 2.027 0 0 0-1.917-1.348 2.043 2.043 0 0 0 0 4.081 2.028 2.028 0 0 0 1.926-1.373h5.476l2.261 2.262ZM11.894 11a.676.676 0 0 1-.962 0 .68.68 0 1 1 .962 0Z"
	/>
</svg>
