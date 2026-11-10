/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Core Verity Pastel Palette
        berriesCream: {
          light: "#FDF2F5",
          DEFAULT: "#F2BAC7", // Soft pastel pink
          dark: "#D88A9F",
          border: "#E99FAF",
        },
        prosecco: {
          light: "#FCF5EA",
          DEFAULT: "#F6D6A7", // Warm champagne gold
          dark: "#DCAB68",
          border: "#E8BF82",
        },
        deltaMint: {
          light: "#EFF8F3",
          DEFAULT: "#CAE7D3", // Calm soothing mint green
          dark: "#96CEA7",
          border: "#B2DEC0",
        },
        polarOpposite: {
          light: "#EFF5FC",
          DEFAULT: "#C0D8F2", // Soft sky blue
          dark: "#8EBCE4",
          border: "#A6C7EB",
        },
        foggyLove: {
          light: "#F5EFFB",
          DEFAULT: "#D8C6EB", // Muted lavender
          dark: "#AF92D5",
          border: "#C7AFE2",
        },

        // Editorial Bronze & Line Art (Matches Verity Emblem)
        bronze: {
          subtle: "#F5EFE9",
          tint: "#C4A485",
          DEFAULT: "#7A5230", // Primary emblem line art
          rich: "#5C3E1E",
          deep: "#3D2714",
        },

        // Luxury Editorial Neutrals
        linen: {
          50: "#FCFAF7",
          100: "#FAF8F5", // Main light background
          200: "#F2ECE3",
          300: "#E5DDD1",
        },
        velvet: {
          900: "#121118", // Main dark background
          800: "#1A1822",
          700: "#242130",
        },
        charcoal: {
          DEFAULT: "#232120", // Editorial primary text
          muted: "#6B6661",
          subtle: "#9E9891",
        },
      },
      fontFamily: {
        serif: ["PlayfairDisplay_400Regular", "serif"],
        "serif-semibold": ["PlayfairDisplay_600SemiBold", "serif"],
        "serif-bold": ["PlayfairDisplay_700Bold", "serif"],
        "serif-italic": ["PlayfairDisplay_400Regular_Italic", "serif"],
        sans: ["Inter_400Regular", "sans-serif"],
        "sans-light": ["Inter_300Light", "sans-serif"],
        "sans-medium": ["Inter_500Medium", "sans-serif"],
        "sans-semibold": ["Inter_600SemiBold", "sans-serif"],
        "sans-bold": ["Inter_700Bold", "sans-serif"],
      },
      borderRadius: {
        "2xl": "20px",
        "3xl": "28px",
        "4xl": "36px",
      },
      boxShadow: {
        luxury: "0 10px 30px -10px rgba(122, 82, 48, 0.08)",
        "luxury-lg": "0 20px 40px -15px rgba(122, 82, 48, 0.12)",
        glow: "0 0 25px rgba(246, 214, 167, 0.35)",
      },
    },
  },
  plugins: [],
};
