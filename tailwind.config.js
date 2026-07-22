/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        flow: {
          bg: "#f4faff",
          surface: "#ffffff",
          "surface-container": "#e4eff7",
          "surface-dim": "#d0dce3",
          dark: "#121d22",
          border: "#c5c5d3",
          primary: {
            DEFAULT: "#00236f",
            dark: "#00164e",
            container: "#1e3a8a",
            light: "#b6c4ff",
            fixed: "#dce1ff",
          },
          secondary: {
            DEFAULT: "#fd761a",
            dark: "#9d4300",
            light: "#ffdbca",
          },
          tertiary: {
            DEFAULT: "#212c32",
            container: "#374249",
          },
          status: {
            pending: "#7f8a91",
            paid: "#10b981",
            transit: "#1e3a8a",
            delivered: "#059669",
            incident: "#ef4444",
          },
        },
      },
      fontFamily: {
        headline: ["Montserrat", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      boxShadow: {
        flow: "0 4px 20px rgba(0, 35, 111, 0.08)",
        "flow-lg": "0 12px 36px rgba(0, 35, 111, 0.12)",
      },
      borderRadius: {
        pill: "9999px",
      },
    },
  },
  plugins: [],
};
