# Serbify

Interactive showcase and landing experience for **Serbify** — a Filipino on-demand home services app connecting homeowners with ID- and NBI-verified local pros (plumbers, electricians, locksmiths, aircon technicians, and general home repair) with upfront pricing and safe in-app payments.

## Features

- **6-Level Interactive Walkthrough (`SerbifyGameStage`)**: Full-viewport (`100dvh`) playable demo inside a 3D-tilted smartphone chassis:
  1. **Start Portal** with GSAP spatial suction into the phone screen
  2. **Floating Service Bubbles** (**Plumber**, **Electrician**, **Locksmith**) with particle burst and tactile phone jump/shake
  3. **Live Radar Matching** snapping onto a verified local pro card
  4. **Multi-Modal Zigzag Highway Transit** powered by GSAP `MotionPathPlugin` + `transit-zigzag.mp4` across 6 sequential stages (Walking, Motorcycle, Car, Bus, Philippine Jeepney, Walking) with `2x Speed` toggle
  5. **3D Job Execution** playing service-specific animations (`/animations/job-plumber.mp4`, `/animations/job-electrician.mp4`, `/animations/job-locksmith.mp4`)
  6. **Safe In-App Payment** pulse transfer, twinkling star confirmation, and smooth transition into the full landing page
- **3D Philippines & Metro Manila Coverage Map (`PhilippinesCoverageScene`)**: Extruded archipelago and Metro Manila bay/Pasig River contours built with Three.js (`@react-three/fiber` + `@react-three/drei`), interactive city beacons, `OrbitControls`, and live per-city dispatch stats.
- **Landing Showcase (`LandingSections`)**: Interactive upfront price estimator, verified pro trust highlights, official Apple App Store & Google Play badges, and a scannable `QRCodeSVG` card (`qrcode.react`) pointing to `https://serbisyohubph.com`.

## Tech Stack

- **Framework**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, `Plus Jakarta Sans`
- **Motion & 3D**: Framer Motion, GSAP (`MotionPathPlugin`), Lenis, Three.js (`@react-three/fiber`, `@react-three/drei`)
- **Icons & QR**: `lucide-react`, `qrcode.react`

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Production Build

```bash
npm run build
npm run start
```

## Deploying to Vercel

1. Push this repository to GitHub as `serbify`:
   ```bash
   git remote add origin https://github.com/rimuelcodes/serbify.git
   git push -u origin main
   ```
2. In [Vercel](https://vercel.com), import the `serbify` repository.
3. Vercel automatically detects Next.js and applies [vercel.json](./vercel.json) (`npm install`, `npm run build`, and immutable cache headers for `/animations/*` and `/assets/*`).
