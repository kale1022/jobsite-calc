# JobSite Calc

Trade calculator suite for iOS. Eight material estimators (concrete, paint, framing, drywall, tile, roofing, mulch/gravel, board feet) with a one-time IAP unlock. No backend, no accounts, no data collection — everything runs on-device.

## Stack

- Expo SDK 56 + React Native 0.85, TypeScript strict
- React Navigation (native stack)
- `expo-iap` (StoreKit 2) — single non-consumable product `unlock_all_calculators`
- No analytics, no network calls

## Development

```bash
npm install
npm run typecheck
npx expo run:ios        # builds the dev client and launches the simulator
```

### Testing purchases locally

`ios/Products.storekit` defines the IAP product for local testing, and the shared Xcode scheme references it. Purchases in the simulator run against StoreKit's local test environment — no App Store Connect setup or network needed. To manage test transactions (refund, clear purchase history): open `ios/JobSiteCalc.xcworkspace` in Xcode → Debug → StoreKit → Manage Transactions.

**Note:** `npx expo prebuild --clean` regenerates the native project and drops two things that local StoreKit testing needs:

1. The `Products.storekit` file reference in `project.pbxproj` (required for the file to appear in Xcode's scheme options).
2. This block inside `<LaunchAction>` of `ios/JobSiteCalc.xcodeproj/xcshareddata/xcschemes/JobSiteCalc.xcscheme`:

```xml
<StoreKitConfigurationFileReference
   identifier = "../Products.storekit">
</StoreKitConfigurationFileReference>
```

Fastest re-setup after a clean prebuild: open the workspace in Xcode → File → Add Files ("Products.storekit") → Product → Scheme → Edit Scheme → Run → Options → StoreKit Configuration → select it.

## App Store submission checklist (owner account, NOT Gameplan Apps)

1. **App Store Connect → My Apps → New App**
   - Bundle ID: `com.jobsitecalc.app` (register in developer.apple.com → Identifiers first)
   - Name: "JobSite Calc" (fallbacks if taken: "JobSite Calc — Trade Estimator", "JobCalc Pro")
2. **IAP product** (App Store Connect → app → Monetization → In-App Purchases):
   - Type: **Non-Consumable**
   - Product ID: `unlock_all_calculators` (must match `src/iap/useEntitlement.tsx`)
   - Reference name: Unlock All Calculators
   - Price: $7.99 (Tier: whatever maps to 7.99 USD)
   - Display name: "Unlock All Calculators"; description: "Unlock all 8 trade calculators forever."
   - Add a review screenshot of the paywall (required for IAP review)
3. **Privacy**: Data collection = "Data Not Collected" (true: no analytics, no network). Privacy policy URL + support URL: GitHub Pages (see `docs/`).
4. **Archive & upload**: open `ios/JobSiteCalc.xcworkspace`, select "Any iOS Device", Product → Archive → Distribute. Signing team = personal Apple Developer account.
5. Submit IAP **with** the app version on first submission.

## ASO (draft)

- Title: `JobSite Calc: Trade Estimator`
- Subtitle: `Concrete, framing & drywall`
- Keywords: `concrete calculator,construction,contractor,framing,drywall,tile,roofing,board feet,estimator,lumber,paint,mulch`
