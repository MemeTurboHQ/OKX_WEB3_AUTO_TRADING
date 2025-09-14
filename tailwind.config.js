/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			colors: {
				// Dark theme with red/pink color scheme
				dark: {
					DEFAULT: '#0a0a0a',
					light: '#1a1a1a',
					mid: '#2a2a2a',
				},
				red: {
					DEFAULT: '#dc2626',
					dark: '#991b1b',
					light: '#ef4444',
					glow: '#fca5a5',
				},
				pink: {
					DEFAULT: '#ec4899',
					dark: '#be185d',
					light: '#f472b6',
					glow: '#fbcfe8',
				},
				gray: {
					DEFAULT: '#6b7280',
					dark: '#374151',
					light: '#9ca3af',
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#dc2626',
					foreground: '#ffffff',
				},
				secondary: {
					DEFAULT: '#ec4899',
					foreground: '#ffffff',
				},
				accent: {
					DEFAULT: '#f472b6',
					foreground: '#ffffff',
				},
				destructive: {
					DEFAULT: '#991b1b',
					foreground: '#ffffff',
				},
				muted: {
					DEFAULT: '#374151',
					foreground: '#9ca3af',
				},
				popover: {
					DEFAULT: '#1a1a1a',
					foreground: '#ffffff',
				},
				card: {
					DEFAULT: '#1a1a1a',
					foreground: '#ffffff',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: 0 },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: 0 },
				},
				pulse: {
					'0%, 100%': { opacity: 1 },
					'50%': { opacity: 0.5 },
				},
				'glow-pulse': {
					'0%, 100%': { 
						boxShadow: '0 0 5px #dc2626, 0 0 10px #dc2626, 0 0 15px #dc2626',
						transform: 'scale(1)'
					},
					'50%': { 
						boxShadow: '0 0 10px #dc2626, 0 0 20px #dc2626, 0 0 30px #dc2626',
						transform: 'scale(1.02)'
					},
				},
				'slide-up': {
					'0%': { transform: 'translateY(10px)', opacity: 0 },
					'100%': { transform: 'translateY(0)', opacity: 1 },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
				'slide-up': 'slide-up 0.3s ease-out',
			},
			boxShadow: {
				'neumorphism': 'inset 5px 5px 10px #0a0a0a, inset -5px -5px 10px #2a2a2a',
				'neumorphism-raised': '5px 5px 10px #0a0a0a, -5px -5px 10px #2a2a2a',
				'neumorphism-pressed': 'inset 3px 3px 6px #0a0a0a, inset -3px -3px 6px #2a2a2a',
				'glow-red': '0 0 20px rgba(220, 38, 38, 0.5)',
				'glow-pink': '0 0 20px rgba(236, 72, 153, 0.5)',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
}