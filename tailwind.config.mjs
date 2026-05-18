/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				dark: {
					950: '#030303',
					900: '#070707',
					800: '#111111',
					700: '#242424',
				},
				neon: '#CCFF00',
				cyan: '#CCFF00',
				coral: '#FF7A59',
				lilac: '#9DB7FF',
			},
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
				mono: ['JetBrains Mono', 'monospace'],
				display: ['Michroma', 'sans-serif'],
			},
			borderRadius: {
				'xl': '1rem',
				'2xl': '1.25rem',
				'3xl': '1.5rem',
				'4xl': '2rem',
				'5xl': '2.5rem',
				'6xl': '3rem',
			},
		},
	},
	plugins: [],
}
