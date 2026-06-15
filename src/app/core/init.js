// =============================================================================
// init.js - DOM-ready bootstrap: wires the global tab buttons (Reset / Std refraction
//           / Zero refraction), restores app state from URL fragment, and triggers
//           the first UpdateAll() once panels and graph DOM are ready.
//
//   Loaded LAST in the page (after vendor libs, core, render, all panels).
// =============================================================================

xOnLoad(function () {
  Tabs.AddButtonClickHandler('CurveSettingsTabs', 'ResetButton', function () {
    ResetApp(true);
  });

  Tabs.AddButtonClickHandler('CurveSettingsTabs', 'StdRefrButton', function () {
    SetStdRefraction();
  });

  Tabs.AddButtonClickHandler('CurveSettingsTabs', 'ZeroRefrButton', function () {
    Set0Refraction();
  });

  HandleUrlCommands();
  UpdateAll();
});
