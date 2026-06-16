# FED v2 — Roadmap

See [`roadmap/DO.md`](roadmap/DO.md) for pending work and [`roadmap/DONE.md`](roadmap/DONE.md) for completed phases.

---

## UI target — one-screen layout

```
┌─────────────────────────────────────────────────────────────────┐
│  [Intro] [Eclipses] [Equinox] [DayNight] [Poles] [Stars] [TFE]  │  ← fixed top bar
│  [Reset]                  ⏮ ▶ ⏭  ☀☾yr  ½×1×2×  Day  T  [📅]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                     CANVAS (fills viewport)                     │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  [Grid][Dome][Shadow][☀][☾][⊙][★][D·][S·][R+]  sliders  rays  │  ← fixed bottom bar
└─────────────────────────────────────────────────────────────────┘
```

## Guiding principles

- **No scroll.** All controls live in fixed bars. The canvas IS the page.
- **Mouse replaces sliders where possible.** Only expose sliders for values with no gesture equivalent.
- **Don't break what works.** ControlPanel/Tabs engine stays untouched until Phase 7.
- **One phase at a time.** Each phase leaves the app in a working, shippable state.
- **Assets are read-only** until Phase 7. New code goes in `css/` and `js/` only.
- **No abstraction without a second use case.**
