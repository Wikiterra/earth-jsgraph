// Target 1 & 2 panels. Replaces the four near-identical files obj1/obj2/
// obj1Options/obj2Options.js — they differed only by the object index (0/1) and
// the destination container. Built once, instantiated per target.

function MakeObjectSliders(ix, container) {
  const i = '[' + ix + ']';
  const p = ControlPanels.NewSliderPanel({
    Name: 'Object-Sliders' + ix,
    ModelRef: 'CurveApp',
    OnModelChange: UpdateAll,
    Format: 'std',
    Digits: DefaultDigits,
    ReadOnly: false,
    PanelFormat: 'InputMediumWidth',
  });
  // NObjects only on target 1 — second target's count stays controlled by the model.
  if (ix === 0) p.AddValueSliderField({ Name: 'NObjects', ValueRef: 'NObjects' + i, Label: 'NObjects', Color: 'black', Format: 'fix', Digits: 0, Min: 0, Max: 200, Steps: 200, Inc: 1 });
  p
    .AddValueSliderField({ Name: 'ObjSurfDist', Label: 'Dist', ValueRef: 'ObjSurfDist' + i, SliderValueRef: 'SliderObjSurfDistLog' + i, UnitsData: 'LengthUnits', Color: 'blue', Min: 0, Max: 5, Inc: 100 })
    .AddValueSliderField({ Name: 'ObjSize', ValueRef: 'ObjSize' + i, SliderValueRef: 'SliderObjSizeLog' + i, UnitsData: 'HeightUnits', Color: 'red', Min: 0, Max: 4, Inc: 1 })
    .AddValueSliderField({ Name: 'ObjDeltaDist', Label: 'DeltaDist', ValueRef: 'ObjDeltaDist' + i, SliderValueRef: 'SliderObjDeltaDistLog' + i, UnitsData: 'LengthUnits', Color: 'blue', Min: 0, Max: 4, Inc: 10 })
    .AddValueSliderField({ Name: 'ObjSidePos', Label: 'SidePos', ValueRef: 'ObjSidePos' + i, SliderValueRef: 'SliderObjSidePosLog' + i, UnitsData: 'LengthUnits', Color: 'green', Min: -3, Max: 3, Inc: 10 })
    .AddValueSliderField({ Name: 'ObjSideVar', Label: 'SideVar', ValueRef: 'ObjSideVar' + i, SliderValueRef: 'SliderObjSideVarLog' + i, UnitsData: 'LengthUnits', Color: 'green', Min: -5, Max: 5, Inc: 10 })
    .AddValueSliderField({ Name: 'ObjSizeVar', ValueRef: 'ObjSizeVar' + i, Label: 'SizeVar', Units: '%', Mult: 0.01, Color: 'red', Min: -1, Max: 1, Inc: 0.01 })
    .RenderInto(container);
}

function MakeObjectOptions(ix, container) {
  const i = '[' + ix + ']';
  ControlPanels.NewPanel({ Name: 'Object-Options' + ix, ModelRef: 'CurveApp', NCols: 1, OnModelChange: UpdateAll })
    .AddRadiobuttonField({
      Name: 'ObjType' + i, Label: 'ObjType', ValueType: 'int',
      Items: [{ Name: 'M-Rod', Value: 0 }, { Name: 'Mountain', Value: 1 }],
    })
    .AddRadiobuttonField({
      Name: 'ObjSideType' + i, Label: 'SideVar', ValueType: 'int',
      Items: [{ Name: 'Lin', Value: 0 }, { Name: '2-Col', Value: 1 }, { Name: 'Rand', Value: 2 }, { Name: 'Cos', Value: 3 }, { Name: 'Sin', Value: 4 }],
    })
    .AddRadiobuttonField({
      Name: 'ObjSizeType' + i, Label: 'SizeVar', ValueType: 'int',
      Items: [{ Name: 'Lin', Value: 1 }, { Name: 'Rand', Value: 2 }, { Name: 'Cos', Value: 3 }, { Name: 'Sin', Value: 4 }],
    })
    .RenderInto(container);
}

// Only target 1 is shown; target 2 (index 1) stays in the model but has no panel.
MakeObjectSliders(0, 'panel-obj1');
MakeObjectOptions(0, 'panel-obj1');
