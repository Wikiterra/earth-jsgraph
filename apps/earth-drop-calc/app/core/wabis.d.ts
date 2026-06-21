// Global type declarations for the wabis framework (vendor), loaded at runtime
// as side-effect imports. No module exports — they publish on globalThis.

// ---- wiki.js ----
declare var xOnLoad: (fn: () => void) => void;
declare var xGet: (id: string) => HTMLElement | null;
declare var xArray: (v: unknown) => boolean;
declare var xDefNum: (v: unknown, def: number) => number;
declare var xStr: (v: unknown) => boolean;
declare var xNum: (v: unknown) => boolean;
declare var globalThis: typeof globalThis & Record<string, unknown>;

// ---- jsg.js ----
declare namespace JsgColor {
  function RGB(r: number, g: number, b: number): number[];
  function RGBA(r: number, g: number, b: number, a: number): number[];
  function BW(v: number): number[];
  function Black(): number[];
  function White(): number[];
  function Copy(src: number[]): number[];
}
declare namespace JsgVect3 {
  function Norm(v: number[]): number[];
  function ScalarProd(a: number[], b: number[]): number;
  function Sub(a: number[], b: number[]): number[];
  function Add(a: number[], b: number[]): number[];
  function Mult(a: number[], b: number[]): number[];
  function Scale(v: number[], s: number): number[];
}
declare namespace JsgMat3 {
  function RotatingZ(angle: number): number[][];
  function Trans(m: number[][], v: number[]): number[];
}

// ---- jsgx3d.js / Graph3D ----
interface Graph3DInstance {
  MaxCurveSegments: number;
  CanvasWidth: number;
  CanvasHeight: number;
  ContainerDiv: HTMLDivElement;
  Canvas: HTMLCanvasElement;
  CheckResizeRegularly: () => void;
  Redraw(): void;
  SetAngleMeasure(m: string): void;
  SetViewport(a: number, b: number, c: number, d: number): void;
  SetGraphClipping(a: boolean, b: string, c: number): void;
  SetCameraClipping(a: number): void;
  SetWindowToCameraScreen(): void;
  SetCamera(c: { SceneSize?: number; CamPos: number[]; CamUp: number[]; CamViewCenter: number[] }): void;
  SetCameraZoom(z: number): void;
  SetLineAttr(col: string, w: number): void;
  SetLineWidth(w: number): void;
  SetAlpha(a: number): void;
  Line3D(a: number[], b: number[]): void;
  SetTextAttr(font: string, size: number, col: string, ...args: (string | number)[]): void;
  SetTextRotation(r: number): void;
  Text3D(text: string, pos: number[]): void;
  SetPlane(origin: number[], xAxis: number[], yAxis: number[]): void;
  CircleOnPlane(cx: number, cy: number, r: number, segments: number): void;
  ArcOnPlane(cx: number, cy: number, r: number, startAngle: number, endAngle: number, segments: number): void;
  PolygonOnPlane(pts: number[][]): void;
  SetClipRect(x: number, y: number, w: number, h: number, mode: string): void;
  SetColor(col: number[]): void;
  SetBackgroundColor(col: number[]): void;
  FillRect(x: number, y: number, w: number, h: number): void;
  SetFillAttr(col: string): void;
  ClearCanvas(): void;
}
declare function NewGraphX3D(config: {
  Id: string; Width: string; Height: string;
  DrawFunc: (g: Graph3DInstance) => void;
  AutoReset?: boolean; AutoClear?: boolean; AutoScalePix?: boolean;
}): Graph3DInstance;
declare function createGraph3D(config: {
  Id: string; Width: string; Height: string;
  DrawFunc: (g: Graph3DInstance) => void;
  AutoReset?: boolean; AutoClear?: boolean; AutoScalePix?: boolean;
}): Graph3DInstance;

// ---- ControlPanel.js ----
declare namespace ControlPanels {
  function Update(): void;
  function NewPanel(opts: Record<string, unknown>): { Render(): void; RenderInto(container: HTMLElement): void };
  function NewSliderPanel(opts: Record<string, unknown>): { Render(): void; RenderInto(container: HTMLElement): void };
}

// ---- Tabs.js ----
declare namespace Tabs {
  function AddButtonClickHandler(tabId: string, btnId: string, handler: () => void): void;
}

// ---- DataX.js ----
declare namespace DataX {
  function AssignApp(name: string, app: object, metadata: object, resetFn: unknown, changeFn: () => void): void;
  function AssignSaveRestoreDomObj(id: string): void;
  function SetupUrlStateHandler(name: string): void;
}

// ---- NumFormatter ----
declare class CNumFormatter {
  NumToString(v: number, opts: { Mode: string; Precision: number; UsePrefix?: boolean; Units?: string }): string;
  StringToNum(s: string): number;
}
declare var NumFormatter: CNumFormatter;

// ---- Slider ----
declare class Slider {
  constructor(container: HTMLElement, opts: Record<string, unknown>);
}

// ---- helpers.js (vendor core) ----
declare function toRad(a: number): number;
declare function toDeg(a: number): number;
declare function ToRad(x: number): number;
declare function ToDeg(x: number): number;
declare function sqr(x: number): number;
declare function Limit1(x: number): number;
declare function Limit01(x: number): number;
declare function ToRange(x: number, max: number): number;

// ---- curveApp.js / setup.js ----
declare var CurveApp: import("./curveApp.js").CurveAppInstance;
declare var graph: Graph3DInstance;
declare var ResetApp: (all: boolean) => void;
declare var UpdateAll: () => void;
declare var UpdateAllChanged: () => void;
declare var HandleUrlCommands: () => void;
declare var SetStdRefraction: () => void;
declare var Set0Refraction: () => void;