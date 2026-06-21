/* eslint-disable @typescript-eslint/no-explicit-any */
import { test, expect } from "@playwright/test";

// Characterizes fed-wabis's model (FeDomeApp). Each scenario is one of the app's
// own canonical saved states (from saveRestore); we apply it, call Update(), and
// snapshot every numeric / number-array field. This is the regression net protecting
// the Phase 1 rewire (and any later changes) — FeDomeApp is a singleton, but each
// scenario sets its inputs fully, so application order is deterministic.

const FED_URL = "http://localhost:5302/";

const DEFAULT_STATE = {
  ObserverLat: 0,
  ObserverLong: 15,
  Zoom: 1.4,
  CameraDirection: 30,
  CameraHeight: 25,
  CameraDistance: 200150,
  DateTime: 360.5,
  DomeSize: 1,
  DomeHeight: 9000,
};

const TFE_STATE = {
  ObserverLat: -79.78324896,
  ObserverLong: -83.33692904,
  Zoom: 1.4,
  CameraDirection: -50,
  CameraHeight: 25,
  CameraDistance: 200150,
  DateTime: 2904.5,
  DomeSize: 1,
  DomeHeight: 9000,
};

const scenarios: Record<string, Record<string, unknown>> = {
  "default-state": DEFAULT_STATE,
  "tfe-state": TFE_STATE,
};

test.describe("fed-wabis · FeDomeApp model characterization", () => {
  for (const [name, overrides] of Object.entries(scenarios)) {
    test(name, async ({ page }) => {
      await page.goto(FED_URL);
      await page.waitForFunction(
        () => typeof (globalThis as any).FeDomeApp?.Update === "function",
      );

      const state = await page.evaluate((ov) => {
        const round = (x: number): number | string => {
          if (Number.isNaN(x)) return "NaN";
          if (!Number.isFinite(x)) return x > 0 ? "Infinity" : "-Infinity";
          if (x === 0) return 0;
          return Number(x.toPrecision(10));
        };
        const app = (globalThis as any).FeDomeApp;
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
