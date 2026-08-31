# ✦ Baby Name Ranker (Babynaam Vergelijker)

> **Head-to-head pairwise comparison tool for couples to agree on baby names without the arguments.**

[![Live Demo](https://img.shields.io/badge/Demo-baby.casteleijn.com-1C1815?style=flat-square&logo=google-chrome&logoColor=white)](https://baby.casteleijn.com)
[![Privacy](https://img.shields.io/badge/Privacy-100%25%20Offline%20First-emerald?style=flat-square)](https://baby.casteleijn.com)
[![Dependencies](https://img.shields.io/badge/Dependencies-Zero%20Build%20Step-stone?style=flat-square)](https://baby.casteleijn.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

---

## 💡 Why This Exists

Choosing a baby name together often leads to decision fatigue when scrolling through endless lists of 500+ names.

**Baby Name Ranker** simplifies this into simple 1-on-1 duels:
1. **Curate:** Paste your name ideas or pick from cultural starter packs (Dutch, Arabic, English, French, Spanish, Nordic).
2. **Rank:** Pick your favorite between two names at a time (*"Do you prefer Name A or Name B?"*). A mathematical merge-sort algorithm builds your top-to-bottom ranking in minimal steps.
3. **Compare & Consensus:** Compare both partners' rankings on one screen to instantly reveal your mutual top favorites and agreement level.

---

## ✨ Features

- **⚡ Zero Build Step & Zero Dependencies:** Pure static HTML5, modern vanilla JavaScript, and Tailwind CSS. No `npm install`, no build tools, no framework overhead.
- **🔒 100% Private & Offline-First:** Everything runs in the browser using `localStorage`. No accounts, no analytics cookies, no servers saving your baby names.
- **🌍 Multi-Lingual (i18n):** Automatically detects user language with full support for:
  - English (`en`)
  - Dutch (`nl`)
  - French (`fr`)
  - Spanish (`es`)
  - German (`de`)
  - Arabic (`ar` with full RTL layout support)
- **📚 Curated Cultural Starter Packs:** 50+ popular names per category (Girls, Boys, Unisex) across 6 cultures with instant 1-click append and deduplication.
- **📲 Seamless Export / Import:** Share your rankings between partner devices via WhatsApp / Web Share API, clipboard, or `.json` file download.
- **🔁 Interactive Re-ranking:** Eliminate unwanted names and re-rank remaining favorites into a Round 2 playoff.

---

## 🚀 Quick Start (Run Locally)

You can run this project locally in seconds using any of the methods below:

### Option 1: Just Open in Your Browser
Simply double-click `index.html` in your file explorer to open it in Chrome, Safari, Firefox, or Edge.

### Option 2: Python One-Liner
```bash
python3 -m http.server 8080
# Open http://localhost:8080
```

### Option 3: Node / npx
```bash
npx serve .
# Open http://localhost:3000
```

### Option 4: Docker Compose
```bash
docker compose up -d
# Open http://localhost:8080
```

---

## 🌐 Deploy to Production

Because the app is 100% static, you can deploy it for free anywhere:

- **GitHub Pages:** Go to repository *Settings* → *Pages* → select `main` branch → Save.
- **Cloudflare Pages / Vercel / Netlify:** Import the repository and set the root directory as `/` (no build command needed).
- **Self-Hosted (Nginx / VPS):** An optimized `nginx.conf` with Gzip compression, multi-tier caching, security headers, and clean URL routing is included.

---

## 🧪 Running the Test Suite

A headless DOM and logic test suite is included to verify state management, pairwise merge-sort accuracy, sanitization, i18n completeness, and SEO structure.

Run with Node.js (zero external test dependencies):

```bash
node test-suite.js
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE). Feel free to use, modify, and self-host for your family!
