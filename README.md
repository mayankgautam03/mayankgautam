# Mayank Gautam — Portfolio (Next.js)

**Kya-kya hai:**
- **AI drone robot** (three.js, code se bana): scroll pe section-to-section udta hai, propellers ghoomte hain, aankhein mouse follow karti hain, har section me face expression badalta hai. Phone pe neeche-right corner me chhota companion.
- **3D laptops + phone, live screens ke saath:** Hero → code typing · Marketing → Ads dashboard + Instagram ad with "New lead 🔔" · AI → chat reply typing · Web → build & "Deployed ✓" · Contact → "Hire Mayank" email.
- **Tech decor:** floating glass KPI cards, mouse se react karta particle mesh, grid lines.
- **Dark mode** = Jack 3D style, **Light mode** = indigo / ice-blue tech.
- Koi bahar ki CDN / 3D model file nahi. Sab code me hai, isliye site fast hai aur kabhi tootegi nahi.

Section order: Hero → Work marquee → About → Services → **01 Performance Marketing (Google + Meta Ads)** → **02 AI Development** → **03 Full-Stack Web** → Journey → Certificates → Contact

## Chalana

```bash
npm install
npm run dev        # http://localhost:3000
```

Deploy: GitHub pe push karo → Vercel me import karo. Bas.

## ✨ Naya project add karna

`src/data/projects.ts` me template copy-paste karo:

```ts
{
  title: "Project Name",
  url: "https://project-link.com/",
  description: "Ek do line me kya banaya.",
  category: "Website",      // "AI App" → AI section me; baaki sab → Web section me
  tags: ["Next.js", "Meta Ads"],
  year: "2026",
  role: "Design · Dev",
  accent: "#ff5a1f",        // optional card colour
},
```

Save karte hi project card, stacking card aur marquee tile apne aap ban jaate hain.

### Website ke hero screenshots

Abhi ke 5 projects ke screenshots `public/projects/` me hain (`<name>.webp` = full hero, `<name>-detail.webp` = zoomed crop).
Naye project ka screenshot `image:` me na do toh woh live URL se browser me hi ban jaata hai (thum.io → microlink → WordPress mShots, ek fail ho toh agla try hota hai).
Pakke aur fast-loading screenshots ke liye apne laptop pe ek baar yeh chalao:

```bash
npx playwright install chromium   # sirf pehli baar
npm run shots                     # saare projects
npm run shots -- "Gabwise"        # sirf ek project
```

Desktop + mobile screenshots `public/projects/` me save ho jaayenge, aur terminal `image:` / `mobileImage:` lines print karega. Unhe project me paste kar do.

## 📈 Naya ad campaign add karna

`src/data/marketing.ts`:
- `googleCases` → Google Ads case viewer (Last 30 days / All time toggle)
- `metaCases` → Meta Ads cards (`featured: true` = full-width card)
- Screenshot `public/ads/` me daalo aur `image` me path likho.
- ⚠️ Campaign names / phone numbers wale screenshots pehle blur karke daalo (abhi wale sab blur kiye hue hain).
- Card pe logos: `logos: ["/ads/hpda-logo.png", "/ads/up-govt-logo.png"]`
- Upar ke KPI numbers → `marketingKpis`

## Baaki content

| Kya | File |
|---|---|
| Naam, email, phone, LinkedIn, about | `src/data/site.ts` |
| Services list, experience, skills, certificates | `src/data/site.ts` |
| Photo / Resume | `public/mayank.png`, `public/Mayank-Gautam-Resume.pdf` |
| Colours (dono themes) | `src/app/globals.css` |
| Robot kahan ude | har section ka `data-bee='{"x":..,"y":..,"s":..}'` (x, y = -1..1 screen position, s = size) |
| Robot ka face | section ka `data-robot` = `wave` · `graph` · `think` · `code` · `happy` · `normal` |
| Laptop/phone kahan dikhe | koi bhi khaali div: `<div data-device="laptop:ads+phone:insta" />` (screens: code, ads, chat, deploy, email, insta, notify) |
| Laptop screens ka content | `src/lib/screens.ts` |

Stack: Next.js 16 · Tailwind CSS 4 · Framer Motion · three.js (procedural robot + devices) · next-themes
