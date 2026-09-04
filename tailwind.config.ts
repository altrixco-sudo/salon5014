import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        cream: "#F7F2E9",
        sand: "#EFE6D7",
        ivory: "#FCF9F3",
        ink: "#221C15",
        muted: "#6E6355",
        line: "#E3D8C6",
        copper: "#9A5B33",
        "copper-deep": "#7C4526",
        "copper-soft": "#C99A74",
        sage: "#7C7A62"
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      letterSpacing: {
        wide2: "0.18em",
        wide3: "0.26em"
      },
      maxWidth: {
        shell: "1440px",
        copy: "68ch"
      },
      boxShadow: {
        lift: "0 18px 50px -22px rgba(34,28,21,0.25)",
        card: "0 1px 0 rgba(34,28,21,0.06), 0 10px 30px -18px rgba(34,28,21,0.18)"
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        chatIn: {
          "0%": { opacity: "0", transform: "translateY(14px) scale(0.985)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" }
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" }
        }
      },
      animation: {
        fadeUp: "fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) both",
        fadeIn: "fadeIn 0.5s ease both",
        chatIn: "chatIn 0.4s cubic-bezier(0.22,1,0.36,1) both",
        marquee: "marquee 40s linear infinite"
      }
    }
  },
  plugins: []
};

export default config;
