# Insta-Dm Frontend UI Premium Redesign - TODO

## Step 1: Global light theme depth + grid
- [x] Update `src/index.css` body background to layered radial gradients + subtle grid overlay (as specified).
- [x] Ensure dark theme remains unchanged.


## Step 2: Exact Global Card System + Premium Hover
- [x] Update `src/components/ui/card.tsx` to match the specified glass card system exactly (rgba background, blur, border, shadow, radius).
- [x] Implement exact hover lift + glow + ::before glow layer.
- [x] Add magnetic cursor effect (Framer Motion spring) to cards.


## Step 3: Section transitions into view
- [ ] Add a reusable Framer Motion in-view wrapper or utility class.
- [ ] Apply it to key landing/dashboard sections (starting with Overview + Pricing if needed).

## Step 4: Dashboard premium analytics feel
- [ ] Upgrade `src/pages/dashboard/Overview.tsx` stat cards with animated counters.
- [ ] Ensure chart containers and feed use the global card system.

## Step 5: Stripe-style Pricing highlight
- [ ] Update `src/components/landing/Pricing.tsx` for the highlighted plan: gradient background, glowing border, floating shadow, float animation.

## Step 6: QA
- [ ] Run `npm run build` (and/or `npm run dev`) and fix any TS/ESLint issues.
- [ ] Verify reduced-motion behavior.

