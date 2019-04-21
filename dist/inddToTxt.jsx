'use strict';

if (!Array.prototype.map) {
  Array.prototype.map = function (callback
  ) {
    var T, A, k;
    if (this == null) {
      throw new TypeError('this is null or not defined');
    }
    var O = Object(this);
    var len = O.length >>> 0;
    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
    }
    if (arguments.length > 1) {
      T = arguments[1];
    }
    A = new Array(len);
    k = 0;
    while (k < len) {
      var kValue, mappedValue;
      if (k in O) {
        kValue = O[k];
        mappedValue = callback.call(T, kValue, k, O);
        A[k] = mappedValue;
      }
      k++;
    }
    return A;
  };
}

if (!Array.prototype.forEach) {
  Array.prototype.forEach = function (callback
  ) {
    var T, k;
    if (this == null) {
      throw new TypeError('this is null or not defined');
    }
    var O = Object(this);
    var len = O.length >>> 0;
    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
    }
    if (arguments.length > 1) {
      T = arguments[1];
    }
    k = 0;
    while (k < len) {
      var kValue;
      if (k in O) {
        kValue = O[k];
        callback.call(T, kValue, k, O);
      }
      k++;
    }
  };
}

(function () {
  app.findChangeGrepOptions.includeLockedLayersForFind = false;
  app.findChangeGrepOptions.includeLockedStoriesForFind = false;
  app.findChangeGrepOptions.includeHiddenLayers = false;
  app.findChangeGrepOptions.includeMasterPages = false;
  app.findChangeGrepOptions.includeFootnotes = false;
  app.findChangeGrepOptions.kanaSensitive = true;
  app.findChangeGrepOptions.widthSensitive = true;
})();

(function () {
  app.findTextPreferences = NothingEnum.nothing;
  app.changeTextPreferences = NothingEnum.nothing;
  app.findTextPreferences.rubyType = NothingEnum.nothing;
})();

if (!Array.prototype.indexOf) Array.prototype.indexOf = function (Object, max, min) {
  return function indexOf(member, fromIndex) {
    if (this === null || this === undefined) throw TypeError("Array.prototype.indexOf called on null or undefined");
    return -1;
  };
}(Object, Math.max, Math.min);

function isArray(arrayLike) {
  return Object.prototype.toString.call(arrayLike) === '[object Array]';
}
function createButtons(target, okLabel, cancelLabel) {
  var group = target.add('group');
  group['buttons'] = {};
  group.buttons.ok = group.add('button', undefined, okLabel || 'OK');
  group.buttons.cancel = group.add('button', undefined, cancelLabel || 'Cancel');
  return group;
}
function createToggle(target, label, checked) {
  var cb = target.add('checkbox', undefined, label);
  if (checked) cb.value = true;
  return function () {
    return cb.value;
  };
}
function createRadios(target, values) {
  var boolList = values.map(function (value) {
    var cb = target.add('radiobutton', undefined, value.label);
    if (value.checked) cb.value = true;
    return cb;
  });
  return function () {
    var val;
    boolList.forEach(function (res, i) {
      if (res.value) {
        val = values[i].value;
      }
    });
    return val;
  };
}
function createCheckboxes(target, values) {
  var elms = values.map(function (value) {
    var cb = target.add('checkbox', undefined, value.label);
    if (value.checked) cb.value = true;
    return cb;
  });
  return function () {
    var valList = [];
    elms.forEach(function (res, i) {
      if (res.value) {
        valList.push(values[i].value);
      }
    });
    return valList;
  };
}
function createInput(target, label, value, options) {
  var op = options | {};
  var wrap = target.add('group');
  wrap.add('statictext', undefined, label);
  var input = wrap.add('edittext', undefined, value);
  input.characters = op.length || 30 - label.length * 2;
  return function () {
    return input.text;
  };
}
function createGroupLike(target, type, label) {
  var _type = type;
  var orientation = '';
  if (isArray(type)) {
    _type = type[0];
    orientation = type[1];
  }
  var groupLike = target.add(_type, undefined, label);
  if (orientation) groupLike.orientation = orientation;
  groupLike.alignChildren = 'left';
  return groupLike;
}
function createElement(target, setting) {
  var type = setting.type;
  if (type === 'checkbox') {
    return createCheckboxes(target, setting.values);
  }
  if (type === 'radio') {
    return createRadios(target, setting.values);
  }
  if (type === 'input') {
    return createInput(target, setting.label, setting.value);
  }
  if (type === 'toggle') {
    return createToggle(target, setting.label, setting.checked);
  }
}
function createDialog(label, setting) {
  var window = new Window('dialog', label);
  window.alignChildren = "fill";
  var res = {};
  var waiting = [];
  setting.forEach(function (group) {
    var area = createGroupLike(window, group.type, group.label);
    res[group.key] = {};
    group.items.forEach(function (item) {
      var elm = createElement(area, item);
      waiting.push(function () {
        res[group.key][item.key] = elm();
      });
    });
  });
  createButtons(window);
  var decision = window.show();
  if (decision === 1) {
    waiting.forEach(function (f) {
      f();
    });
    return res;
  }
  return;
}

function replace (target, from, to) {
  app.findGrepPreferences.findWhat = from;
  app.changeGrepPreferences.changeTo = to;
  target.changeGrep();
  app.findGrepPreferences.findWhat = NothingEnum.nothing;
  app.changeGrepPreferences.changeTo = NothingEnum.nothing;
}

var lang = {
  dividerString: {
    '~M': '改段',
    '~P': '改ページ'
  }
};
function Formatter() {
  this.document = app.activeDocument;
  this.setting = {
    target: {
      start: '[[rb:',
      end: ']]',
      delimiter: ' > '
    },
    newPage: {
      str: '[newpage]',
      "break": true,
      target: ['~M', '~P']
    },
    format: {
      indent: true
    }
  };
}
Formatter.prototype._find = function () {
  app.findTextPreferences.rubyType = RubyTypes.GROUP_RUBY;
  var groupList = this.document.findText();
  app.findTextPreferences.rubyType = NothingEnum.nothing;
  app.findTextPreferences.rubyType = RubyTypes.PER_CHARACTER_RUBY;
  var monoList = this.document.findText();
  app.findTextPreferences.rubyType = NothingEnum.nothing;
  return groupList.concat(monoList);
};
Formatter.prototype._replace = function (textObj) {
  if (!textObj) return;
  var content = String(textObj.contents);
  var ruby = String(textObj.rubyString);
  textObj.contents = this.setting.target.start + content + this.setting.target.delimiter + ruby + this.setting.target.end;
  textObj.rubyFlag = false;
};
Formatter.prototype.init = function () {
  var dialog = this.createDialog();
  if (!dialog) return;
  this.convertRuby();
  this.convertNewPage();
  this.convertIndent();
};
Formatter.prototype.createDialog = function () {
  var target = {
    type: 'panel',
    label: 'ルビ置き換え設定',
    key: 'target',
    items: [{
      type: 'input',
      key: 'start',
      label: '開始',
      value: this.setting.target.start
    }, {
      type: 'input',
      key: 'delimiter',
      label: '区切り',
      value: this.setting.target.delimiter
    }, {
      type: 'input',
      key: 'end',
      label: '終了',
      value: this.setting.target.end
    }]
  };
  var newPage = {
    label: '改ページ設定',
    type: 'panel',
    key: 'newPage',
    items: [{
      type: 'input',
      key: 'str',
      label: '改ページ文字',
      value: this.setting.newPage.str
    }, {
      type: 'toggle',
      key: 'break',
      label: '改ページ文字の前後を改行',
      checked: this.setting.newPage["break"]
    }, {
      type: 'checkbox',
      key: 'target',
      label: '改ページ文字への置き換え対象',
      values: this.setting.newPage.target.map(function (str) {
        return {
          label: lang.dividerString[str],
          value: str,
          checked: true
        };
      })
    }]
  };
  var format = {
    label: 'フォーマット調整',
    type: 'panel',
    key: 'format',
    items: [{
      type: 'toggle',
      key: 'indent',
      label: '段落の頭で一字下げ',
      checked: true
    }]
  };
  var dialog = createDialog('置き換え設定', [target, newPage, format]);
  if (dialog) {
    this.setting = dialog;
    return true;
  } else {
    return false;
  }
};
Formatter.prototype.convertIndent = function () {
  if (this.setting.format.indent) {
    app.findGrepPreferences.findWhat = '(^.)';
    app.changeGrepPreferences.changeTo = '　$1';
    this.document.changeGrep();
    app.findGrepPreferences.properties.findWhat = NothingEnum.nothing;
    app.changeGrepPreferences.properties.changeTo = NothingEnum.nothing;
  }
};
Formatter.prototype.convertNewPage = function () {
  var _that = this;
  var to = this.setting.newPage.str;
  if (this.setting.newPage["break"]) {
    to = '\r' + to + '\r';
  }
  this.setting.newPage.target.forEach(function (str) {
    replace(_that.document, str, to);
  });
};
Formatter.prototype.convertRuby = function () {
  var foundTexts = this._find();
  var len = foundTexts.length || [];
  if (len === 0) {
    alert('置き換え対象が見つかりませんでした');
  }
  for (var i = 0; i < len; i++) {
    this._replace(foundTexts[i]);
  }
};
var formatter = new Formatter();
formatter.init();
