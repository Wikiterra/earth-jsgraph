/* eslint-disable @typescript-eslint/no-explicit-any */
import { test, expect } from "@playwright/test";

// Render safety net: screenshots each app's canvas so gross render regressions
// (blank canvas, missing geometry, the offsetWidth-class bug from the vendor
// convergence) fail loudly. The math specs don't look at pixels.
//
// State is pinned where the default render depends on the wall clock — fed uses
// new Date() at init, so without pinning the sun/moon move every run. earth-drop
// has no clock, so its default render is already deterministic.

interface AppCase {
  url: string;
  canvas: string;
  ready: () => boolean;
  pin?: () => void;
}

const EDC = "http://localhost:5301/";
const edcReady = () => typeof (globalThis as any).CurveAppClass === "function";

const apps: Record<string, AppCase> = {
  "earth-drop-calc": {
    url: EDC,
    canvas: "canvas",
    ready: edcReady,
  },
  // Globe+FE split view — exercises the FE grid, globe grid, split-screen camera and
  // the data panels (branches the default Globe render doesn't reach).
  "earth-drop-calc-both": {
    url: EDC,
    canvas: "canvas",
    ready: edcReady,
    pin: () => {
      (globalThis as any).CurveApp.ShowModel = 3;
      (globalThis as any).UpdateAll();
    },
  },
  "fed-wabis": {
    url: "http://localhost:5302/",
    canvas: "#FeGraph-Canvas",
    ready: () => typeof (globalThis as any).FeDomeApp?.Update === "function",
    pin: () => {
      const app = (globalThis as any).FeDomeApp;
      Object.assign(app, {
        ObserverLat: 0, ObserverLong: 15, Zoom: 1.4, CameraDirection: 30,
        CameraHeight: 25, CameraDistance: 200150, DateTime: 360.5,
        DomeSize: 1, DomeHeight: 9000,
      });
      app.Update();
      app.Draw();
    },
  },
};

test.describe("canvas render characterization", () => {
  for (const [name, app] of Object.entries(apps)) {
    test(name, async ({ page }) => {
      await page.goto(app.url);
      await page.waitForFunction(app.ready);
      if (app.pin) await page.evaluate(app.pin);
      await page.waitForTimeout(400); // let the canvas settle
      await expect(page.locator(app.canvas)).toHaveScreenshot(`${name}-canvas.png`, {
        maxDiffPixelRatio: 0.02,
      });
    });
  }
});
