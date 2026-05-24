// Demos Manager - extracted from app.js
// Imports after app.js, so FeDomeApp, ResetApp, TFE, xOnDomReady are on globalThis.

/* Demos Manager */

var AnimationSpeed = 1;  // > 0

// Click handler gated on the TabEnabled class (replaces Tabs.AddButtonClickHandler).
function wireButton(id, fn) {
  var el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('click', function (e) {
    if (el.classList.contains('TabEnabled')) fn(e);
  });
}

// Demo tabs carry role="tab"; mirror the active demo onto aria-selected.
function syncDemoAriaSelected(activeName) {
  var tabs = document.querySelectorAll('#DomeDemoTabs li[role="tab"]');
  for (var i = 0; i < tabs.length; i++) {
    var tab = tabs[i];
    var isActive = activeName && tab.id === activeName + 'Button';
    tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
  }
}

var Demos = {
  DemoList: [],
  CurrDemo: null,
  LastDemo: null,
  SusDemo: null,
  SusState: 0,
  CurrModAnim: null,
  CurrAnimStep: 0,
  NewCustomDemoName: '',  // custom demos may have a different name then the demo button
  OnStopFunc: null,

  Init: function () {
    // installed demo button click handlers
    var nDemos = this.DemoList.length;
    for (var i = 0; i < nDemos; i++) {
      this.AddButtonClickHandler(i);
    }
  },

  AddButtonClickHandler: function (id) {
    // id as DemoList index or demo name
    if (xStr(id)) id = this.Find(id);
    var demoName = this.DemoList[id].Name;
    wireButton(demoName + 'Button', function () {
      if (Demos.IsCurrDemoName(demoName) && Demos.IsPlaying()) {
        Demos.Next(false, !Demos.IsTargetIsEndPos());
      } else {
        Demos.Play(demoName, true);
      }
    });
  },

  SetButtonText: function (text, button) {
    button = xDefStr(button, 'Custom');
    var buttonName = button + 'Button';
    xRemoveClass(buttonName, 'TabHide');
    xInnerHTML(buttonName, text);
    this.NewCustomDemoName = text;
  },

  Reset: function (callOnStop) {
    callOnStop = xDefBool(callOnStop, true);
    this.Stop(false);
    this.LastDemo = this.CurrDemo;
    if (this.CurrDemo) {
      this.SusDemo = this.CurrDemo;
      this.SusState = this.CurrDemo.Anim.CurrState;
    }
    this.CurrDemo = null;
    this.UpdateDemoPanels();
    if (this.callOnStop && this.OnStopFunc) this.OnStopFunc();
  },

  Find: function (name) {
    var nDemos = this.DemoList.length;
    for (var i = 0; i < nDemos; i++) {
      if (this.DemoList[i].Name == name || this.DemoList[i].Name2 == name) return i;
    }
    return -1;
  },

  UpdateDemoPanels: function () {
    if (this.LastDemo) {
      xRemoveClass(this.LastDemo.Name + 'Button', 'TabActive');
      this.LastDemo = null;
    }
    if (this.CurrDemo) {
      xAddClass('BackButton', 'TabEnabled');
      xAddClass('PlayButton', 'TabEnabled');
      xAddClass('ForwButton', 'TabEnabled');
      xAddClass('CountButton', 'TabEnabled');
      if (this.IsPlaying()) {
        xInnerHTML('PlayButton', 'Stop');
        xAddClass('PlayButton', 'TabActive');
      } else {
        xInnerHTML('PlayButton', 'Play');
        xRemoveClass('PlayButton', 'TabActive');
      }
      var pos = this.GetCurrPos() + 1;
      if (this.IsEndPos()) {
        pos = 'end';
      } else {
        pos = pos.toFixed(0);
      }
      xInnerHTML('CountButton', pos);
      xAddClass(this.CurrDemo.Name + 'Button', 'TabActive');
      syncDemoAriaSelected(this.CurrDemo.Name);
    } else {
      if (this.SusDemo) {
        xInnerHTML('PlayButton', 'Resume');
        xAddClass('PlayButton', 'TabEnabled');
        xAddClass('PlayButton', 'TabActive');
        xInnerHTML('CountButton', (this.SusState + 1).toFixed(0));
      } else {
        xInnerHTML('PlayButton', 'Play');
        xInnerHTML('CountButton', 'x');
        xRemoveClass('PlayButton', 'TabEnabled');
      }
      xRemoveClass('CountButton', 'TabEnabled');
      xRemoveClass('BackButton', 'TabEnabled');
      xRemoveClass('ForwButton', 'TabEnabled');
      syncDemoAriaSelected(null);
    }
  },

  New: function (name) {
    // returns ModelAnimation
    var anim = NewModelAnimation({
      ModelRef: FeDomeApp,
      OnModelChange: function () { UpdateAll(false, false); },
      PauseTime: 0,
      OnAfterStateChange: function (anim, state) { Demos.UpdateDemoPanels(); },
      OnStopPlaying: function (anim, state) {
        Demos.UpdateDemoPanels();
        if (Demos.OnStopFunc) Demos.OnStopFunc();
      }
    });
    var demo = {
      Name: name,
      Name2: this.NewCustomDemoName,
      Anim: anim,
    };
    this.NewCustomDemoName = '';
    var i = this.Find(name);
    if (i >= 0) {
      this.DemoList[i] = demo;
    } else {
      this.DemoList.push(demo);
    }
    this.CurrModAnim = anim;
    this.CurrAnimStep = 0;
    return anim;
  },

  AddState: function (jsonState) {
    var anim = this.CurrModAnim;
    if (!anim) return;
    anim.OnSetState(this.CurrAnimStep,
      function () {
        // prevent setting state for inactive demos
        if (Demos.CurrDemo && Demos.CurrDemo.Anim == anim) {
          DataX.JsonToAppState(jsonState);
        }
      }
    );
    this.CurrAnimStep++;
  },

  AddAnimation: function (animDef) {
    var anim = this.CurrModAnim;
    if (!anim) reurn;
    anim.AnimationToState(this.CurrAnimStep, animDef);
  },

  IsActive: function () {
    return this.CurrDemo != null;
  },

  IsCurrDemoName: function (name) {
    if (!this.CurrDemo) return false;
    return this.CurrDemo.Name == name;
  },

  IsPlaying: function () {
    if (!this.CurrDemo) return false;
    return this.CurrDemo.Anim.IsPlaying;
  },

  IsTransient: function () {
    if (!this.CurrDemo) return false;
    var anim = this.CurrDemo.Anim;
    return anim.CurrState != anim.TargetState;
  },

  GetCurrPos: function () {
    if (!this.CurrDemo) return 0;
    return this.CurrDemo.Anim.CurrState;
  },

  GetNStates: function () {
    if (!this.CurrDemo) return 0;
    return this.CurrDemo.Anim.NStates;
  },

  GetLastPos: function () {
    if (!this.CurrDemo) return 0;
    return this.CurrDemo.Anim.NStates - 1;
  },

  IsStartPos: function () {
    return this.GetCurrPos() == 0;
  },

  IsEndPos: function () {
    if (!this.CurrDemo) return false;
    var anim = this.CurrDemo.Anim;
    return anim.CurrState == anim.NStates - 1;
  },

  IsTargetIsEndPos: function () {
    if (!this.CurrDemo) return false;
    var anim = this.CurrDemo.Anim;
    return anim.TargetState == anim.NStates - 1;
  },

  Stop: function (callOnStop) {
    callOnStop = xDefBool(callOnStop, true);
    if (!this.CurrDemo) return;
    this.CurrDemo.Anim.Stop();
    this.UpdateDemoPanels();
    if (callOnStop && this.OnStopFunc) this.OnStopFunc();
  },

  SetPos: function (pos, play) {
    if (!this.CurrDemo) return;
    this.Stop(false);
    var anim = this.CurrDemo.Anim;
    if (pos > anim.NStates - 1) pos = anim.NStates - 1;
    if (pos < 0) pos = 0;
    anim.SetState(pos);
    if (play) {
      this.Play();
    } else {
      if (this.OnStopFunc) this.OnStopFunc();
    }
  },

  Next: function (wrap, play) {
    if (this.IsEndPos()) {
      if (wrap) {
        this.SetPos(0, play);
      } else {
        this.SetPos(this.GetCurrPos());
      }
    } else {
      this.SetPos(this.GetCurrPos() + 1, play);
    }
  },

  Prev: function (wrap, play) {
    if (this.IsTransient()) {
      this.SetPos(this.GetCurrPos(), play);
    } else {
      if (this.IsStartPos()) {
        if (wrap) {
          this.SetPos(this.GetNStates() - 1, play);
        } else {
          this.SetPos(0, play);
        }
      } else {
        this.SetPos(this.GetCurrPos() - 1, play);
      }
    }
  },

  Step: function (wrap, back, play) {
    if (back) {
      this.Prev(wrap, play);
    } else {
      this.Next(wrap, play);
    }
  },

  IsNewName: function (name) {
    return this.CurrDemo && this.CurrDemo.Name != name;
  },

  RequestName: function (name) {
    if (!xStr(name)) {
      if (!this.CurrDemo) return '';
      name = this.CurrDemo.Name;
    }
    return name;
  },

  Play: function (name, reset) {
    // name: string; name of a new demo or null for current demo
    name = this.RequestName(name);
    if (name == '') return;
    if (this.IsCurrDemoName(name)) {
      if (this.IsPlaying()) return;
    } else {
      this.Stop(false);
    }

    // assert: !this.IsPlaying() -> start new demo or restart curr demo
    if (!this.IsCurrDemoName(name)) {
      if (!this.SetNewDemo(name)) return;
    }
    var demo = this.CurrDemo;
    if (reset) demo.Anim.Reset();
    demo.Anim.Play();
    this.UpdateDemoPanels();
  },

  SetDemo: function (name, play, pos) {
    // name: string; name of a new demo or null for current demo
    pos = xDefNum(pos, 0);
    this.Stop(false);
    if (this.IsCurrDemoName(name)) {
      this.SetPos(pos, play);
      return;
    }

    // assert: !this.IsPlaying() -> start new demo
    if (this.SetNewDemo(name)) {
      this.SetPos(pos, play);
    }
  },

  SetSusDemo: function (play) {
    if (!this.SusDemo) return;
    this.SetDemo(this.SusDemo.Name, play, this.SusState);
  },

  SetNewDemo: function (name) {
    // private function
    var i = this.Find(name);
    if (i < 0) return false;
    this.LastDemo = this.CurrDemo;
    this.CurrDemo = this.DemoList[i];
    return true;
  },

  PlayStop: function (cont) {
    if (!this.CurrDemo) return;
    if (this.IsPlaying()) {
      this.Stop(true);
      return;
    }
    // not playing
    if (this.IsTransient() && !cont) {
      this.Prev();
    }
    this.Play();
  },
};

xOnDomReady(function () {
  Demos.Init();
  wireButton('ResetButton',  function () { ResetApp(); });
  wireButton('TFEButton',    function () { TFE(); });
  wireButton('BackButton',   function () { Demos.Prev(); });
  wireButton('ForwButton',   function () { Demos.Next(true); });
  wireButton('PlayButton',   function () {
    if (Demos.IsActive()) {
      if (Demos.IsPlaying()) Demos.Stop();
      else Demos.Play();
    } else {
      Demos.SetSusDemo();
    }
  });
  wireButton('CountButton',  function () {
    if (Demos.IsEndPos()) Demos.SetPos(0);
    else Demos.SetPos(Demos.GetLastPos());
  });
});

Object.assign(globalThis, { AnimationSpeed, Demos });
export { AnimationSpeed, Demos };
