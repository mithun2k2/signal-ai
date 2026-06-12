# ⚡ SignalAI
### Turn conference chaos into career capital — automatically.

Built for the **Progress x GitNation Hackathon 2026** (JSNation / React Summit)

🌐 **Live Demo:** [signal-ai-blond.vercel.app](https://signal-ai-blond.vercel.app)

---

## The Problem

You spend £1,500 to attend a tech conference.
You sit through 20 talks. You collect 50 contacts. You screenshot 30 slides.

Then you go home — and 80% of it evaporates within 72 hours.

The notes go nowhere. The contacts go cold. The insights never make it into your actual work.

**SignalAI fixes this.**

---

## How It Works

### 1. 📥 Capture (during the conference)
Save anything in seconds — slides, notes, contacts, URLs, quotes — with optional context tagging.

### 2. 🧠 Synthesise (end of day)
Claude AI reads every capture alongside your personal profile (what you're building, what problem you're stuck on) and generates insights **specific to your situation** — not generic takeaways.

### 3. ⚡ Act (Monday morning)
- Personalised action plan for the week
- Follow-up emails written for every contact
- LinkedIn post ready to publish
- Conference ROI score: 0–100

---

## Features

- **5 capture types** — slide, note, contact, URL, quote
- **AI synthesis engine** — Claude API generates personalised insights
- **Follow-up email writer** — one per contact, referencing exactly how you met
- **LinkedIn post generator** — your unique take, not a generic recap
- **ROI Dashboard** — Kendo UI RadialGauge + Chart components
- **No backend** — fully client-side with localStorage
- **Works offline** — all data stays on your device

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 + TypeScript |
| UI Components | **Kendo UI for React** (required) |
| AI Engine | Claude API (Anthropic) |
| Styling | Tailwind CSS |
| Deployment | Vercel |
| Storage | localStorage (no backend) |

### Kendo UI Components Used
- `Button` — onboarding, capture, synthesis actions
- `Input` / `TextArea` — capture and onboarding forms
- `ProgressBar` — synthesis loading indicator
- `RadialGauge` — ROI score visualisation
- `Chart` + `ChartSeries` — captures by type (column) + insight relevance (bar)

---

## Getting Started

```bash
git clone https://github.com/YOUR_USERNAME/signal-ai.git
cd signal-ai
npm install
```

Create `.env.local`:
```
NEXT_PUBLIC_ANTHROPIC_API_KEY=your_key_here
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

app/
├── page.tsx          # Onboarding (3 questions)
├── capture/          # Capture hub
├── synthesis/        # AI synthesis + insights
└── roi/              # ROI dashboard
lib/
├── types.ts          # TypeScript interfaces
├── storage.ts        # localStorage helpers
└── claude.ts         # Claude API integration

---

## Hackathon

**Event:** Progress x GitNation Hackathon 2026
**Prize Pool:** €10,000
**Stack requirement:** Kendo UI for React ✅
**Team:** ForgeAI (solo)
**Builder:** Mahmudul Hassan Mithun

---

## License

MIT
