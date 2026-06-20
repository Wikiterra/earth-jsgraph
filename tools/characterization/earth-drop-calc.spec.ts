/* eslint-disable @typescript-eslint/no-explicit-any */
import { test, expect } from "@playwright/test";

// Characterizes earth-drop-calc's math engine (CurveAppClass). For each scenario we
// build a FRESH instance, apply known input overrides, call Update(), and snapshot
// every numeric / number-array field. Any future change to the math (e.g. during the
// Phase 3 ESM migration) that alters an output will fail this test.

const EDC_URL = "http://localhost:5301/";

const scenarios: Record<string, Record<string, unknown>> = {
  // default constructor state (height 2 m, one M-Rod object, no refraction)
  defaults: {},
  // high observer, refraction coefficient k = 0.13 (RefractionSync 3)
  "high-observer-k013": { Height: 2000, RefractionSync: 3 },
  // a tall, distant target partly hidden behind the horizon
  "tall-object-far": { Height: 2, ObjSize: [100, 10], ObjSurfDist: [50000, 20000], NObjects: [1, 0] },
  // camera tilt / pan / zoom changes (exercises CompCameraParams + scene sizing)
  "tilt-pan-zoom": { Tilt: 10, Pan: 30, ViewAngleField: 2 },
};

test.describe("earth-drop-calc · CurveApp math characterization", () => {
  for (const [name, overrides] of Object.entries(scenarios)) {
    test(name, async ({ page }) => {
      await page.goto(EDC_URL);
      await page.waitForFunction(() => typeof (globalThis as any).CurveAppClass === "function");

      const state = await page.evaluate((ov) => {
        const round = (x: number): number | string => {
          if (Number.isNaN(x)) return "NaN";
          if (!Number.isFinite(x)) return x > 0 ? "Infinity" : "-Infinity";
          if (x === 0) return 0;
          return Number(x.toPrecision(10)); // absorb last-ULP noise
        };
        const G = globalThis as any;
        const app = new G.CurveAppClass();
        Object.assign(app, ov);
        app.Update();
        const out: Record<string, unknown> = {};
        for (const k of Object.keys(app).sort()) {
          const v = app[k];
          if (typeof v === "number") out[k] = round(v);
          else if (Array.isArray(v) && v.every((e) => typeof e === "number")) out[k] = v.map(round);
        }
        return out;
      }, overrides);

      expect(JSON.stringify(state, null, 2)).toMatchSnapshot(`${name}.json`);
    });
  }
});
