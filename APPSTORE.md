# App Store Submission Pack

## App record (App Store Connect → My Apps → + → New App)

| Field | Value |
|---|---|
| Platform | iOS |
| Name | **JobSite Calc: Trade Estimator** (30-char limit; fallback: "JobSite Calc — Estimator") |
| Primary language | English (U.S.) |
| Bundle ID | `com.jobsitecalc.app` (register first at developer.apple.com → Identifiers) |
| SKU | `jobsite-calc-001` |
| Category | Primary: Productivity. Secondary: Utilities |
| Price | Free (IAP inside) |

## Subtitle (30 chars)

`Concrete, framing & drywall`

## Keywords (100 chars, comma-separated, no spaces after commas)

`concrete,calculator,construction,contractor,framing,drywall,tile,roofing,lumber,paint,estimator`

## Promotional text (170 chars)

Instant material estimates on the job: concrete yards & bags, studs, drywall sheets, tile, shingles, paint and more. See a live diagram of every pour and wall.

## Description

Stop doing napkin math at the supply house. JobSite Calc turns your measurements into exact material quantities in seconds — with a live diagram of every estimate so you can sanity-check the job before you order.

FREE CALCULATORS
• Concrete Slab — cubic feet, cubic yards, and bag count (80/60/40 lb)
• Paint Coverage — gallons by wall area, coats, doors and windows

PRO CALCULATORS (one-time purchase, no subscription)
• Wall Framing — stud count at 16" or 24" OC plus plate footage
• Drywall — sheets with waste, joint compound, and screw counts
• Tile — tile count with cut waste for any tile size
• Roofing — squares and shingle bundles from roof area
• Mulch & Gravel — cubic yards and bag counts for beds and fill
• Board Feet — lumber volume and cost for rough stock

PRO PROJECTS
Name a job, save estimates to it from any calculator, and get one combined shopping list of everything to buy — share it straight to a text or email for the supply run.

BUILT FOR THE JOB SITE
• Works fully offline — no signal needed in the field
• No account, no sign-up, no ads
• No data collection. Everything stays on your phone
• One-time PRO unlock. Never a subscription

Every calculator uses standard trade formulas with typical waste factors. Always verify against site conditions before ordering.

## IAP product (App Store Connect → app → Monetization → In-App Purchases)

| Field | Value |
|---|---|
| Type | **Non-Consumable** |
| Product ID | `unlock_all_calculators` ← must match code exactly |
| Reference name | Unlock All Calculators |
| Price | $7.99 (Tier where USD = 7.99) |
| Display name | Unlock All Calculators |
| Description | Unlock all 8 trade calculators plus Projects with combined shopping lists. |
| Review screenshot | screenshot of the paywall screen (required) |

Submit the IAP together with the first app version — check the IAP box on the version page before submitting.

## URLs

| Field | Value |
|---|---|
| Privacy policy URL | https://kale1022.github.io/jobsite-calc/ |
| Support URL | https://kale1022.github.io/jobsite-calc/ |

## App privacy (App Store Connect → App Privacy)

Data collection: **Data Not Collected** (truthful: no analytics, no accounts, no network calls).

## Screenshots (required: 6.9" — 1320×2868 or 6.7" — 1290×2796)

Suggested five, in order:
1. Home screen (Essentials + Pro Toolkit list)
2. Concrete calculator with results + diagram
3. Framing calculator showing stud layout diagram
4. Project detail with shopping list
5. Paywall (doubles as IAP review screenshot)

## Build upload

1. Xcode → scheme device: **Any iOS Device (arm64)**
2. Product → Archive
3. Organizer → Distribute App → App Store Connect → Upload
4. Signing: personal team (kaleguymon) — NOT Gameplan Apps
5. In App Store Connect, select the processed build on the version page

## Review notes (paste into App Review notes field)

The app is fully functional offline with no account. The single in-app purchase
"Unlock All Calculators" ($7.99, non-consumable) unlocks the six PRO calculators
and the Projects feature. To review the purchase, tap any calculator marked with
a lock, then "Unlock All". Restore Purchases is available on the paywall and in
Settings.
