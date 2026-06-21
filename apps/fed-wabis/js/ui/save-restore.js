export function sync() {}

export function init() {
  const wire = (id, fn) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', fn);
  };
  wire('sr-get-state',  () => DataX.GetAppState(true));
  wire('sr-get-url',    () => DataX.GetAppStateUrl(ThisPageUrl));
  wire('sr-set-state',  () => DataX.SetAppState());
  wire('sr-clear',      () => DataX.ClearSaveRestoreDomObj());
}
