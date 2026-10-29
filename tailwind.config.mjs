import {palette} from './src/data/palette.mjs';
/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				dark: {
					950: palette.deep,
					900: palette.background,
					800: palette.surface,
					700: palette.raised,
					600: '#4C5054',
				},
				white: palette.ink,
				gray: palette.gray,
				accent: palette.accent,
				'accent-light': palette.accentLight,
				action: palette.link,
				'action-hover': palette.linkHover,
				neon: palette.accent,
				cyan: palette.slate,
				coral: palette.rose,
				lilac: '#AEB6BE',
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
