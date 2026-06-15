// =============================================================================
// setup.js - Instantiates the global CurveApp, registers it with DataX,
//            and defines the central UpdateAll/UpdateAllChanged loop.
//
//   Loaded BEFORE any panel script because panels reference `CurveApp` and
//   `UpdateAll` via the ControlPanels.NewSliderPanel({ ModelRef: 'CurveApp',
//   OnModelChange: UpdateAll, ... }) declarations.
// =============================================================================

var CurveApp = new CurveAppClass();
var UpdateAllRunning = false;

DataX.AssignApp('AdvCurveApp', CurveApp, CurveAppMetaData, null, UpdateAllChanged);
DataX.AssignSaveRestoreDomObj('SaveRestorePanel');
DataX.SetupUrlStateHandler('App');

function UpdateAll() {
  if (UpdateAllRunning) return;
  UpdateAllRunning = true;
  try {
    CurveApp.Update();
    ControlPanels.Update();
    graph.Redraw();
  } finally {
    UpdateAllRunning = false;
  }
}

function UpdateAllChanged() {
  CurveApp.AllStatesChanged = true;
  UpdateAll();
}
