ControlPanels.NewPanel({
    Name: 'OptionPanel',
    ModelRef: 'FeDomeApp',
    NCols: 2,
    OnModelChange: UpdateAll,
    Format: 'fix0',
    FormatTab: true,
    Digits: 2,
    PanelFormat: 'InputNormalWidth'
}).AddCheckboxField({
    Name: 'Show',
    NCols: 5,
    ColSpan: 3,
    Items: [
        {
            Name: 'ShowFeGrid',
            Text: 'FE Grid',
        }, {
            Name: 'ShowDomeGrid',
            Text: 'Dome Grid',
        }, {
            Name: 'ShowShadow',
            Text: 'Shadow',
        }, {
            Name: 'ShowSunTrack',
            Text: 'Sun Track',
        }, {
            Name: 'ShowMoonTrack',
            Text: 'Moon Track',
        }, {
            Name: 'ShowSphere',
            Text: 'Sphere',
            EnabledRef: 'IsRayTargetObserver',
        }, {
            Name: 'ShowStars',
            Text: 'Stars',
            EnabledRef: 'IsRayTargetObserver',
        }, {
            Name: 'ShowDomeRays',
            Text: 'Dome Rays',
            EnabledRef: 'IsRayTargetObserver',
        }, {
            Name: 'ShowSphereRays',
            Text: 'Sphere Rays',
            EnabledRef: 'IsRayTargetObserver',
        }, {
            Name: 'ShowManyRays',
            Text: 'Many Rays',
            EnabledRef: 'ManyRaysEnabled',
        }
    ]
}).AddRadiobuttonField({
    Name: 'RayTarget',
    ValueType: 'int',
    ColSpan: 1,
    Items: [
        {
            Name: 'Observer',
            Value: 0
        }, {
            Name: 'FlatEarth',
            Value: 1
        }
    ]
}).AddRadiobuttonField({
    Name: 'RaySource',
    ValueType: 'int',
    ColSpan: 1,
    EnabledRef: 'RayTarget',
    Items: [
        {
            Name: 'Sun',
            Value: 0
        }, {
            Name: 'Moon',
            Value: 1
        }, {
            Name: 'Star',
            Value: 2
        }
    ]
}).Render();
