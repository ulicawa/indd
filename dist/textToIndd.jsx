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

function escapeRegExp(s) {
  return s.replace(/[\\^$.*+?()\[\]{}|]/g, '\\$&');
}
function TxtToIndd() {
  app.findTextPreferences.rubyType = NothingEnum.nothing;
  this.document = app.activeDocument;
  this.setting = {
    target: {
      start: '[[rb:',
      end: ']]',
      delimiter: ' > '
    },
    newPage: {
      str: '[newpage]',
      tripleNL: true
    },
    ruby: {
      alignment: 'RUBY_CENTER',
      size: '6'
    },
    format: {
      indent: true
    }
  };
}
TxtToIndd.prototype.init = function () {
  var dialog = this.createDialog();
  if (!dialog) return;
  var foundTexts = this._findRubyTarget();
  var len = foundTexts.length;
  for (var i = 0; i < len; i++) {
    this.setRuby(foundTexts[i]);
  }
  this.format();
  this.convertNewPage();
};
TxtToIndd.prototype._findRubyTarget = function () {
  var findExp = escapeRegExp(this.setting.target.start) + '.+?' + escapeRegExp(this.setting.target.delimiter) + '.+?' + escapeRegExp(this.setting.target.end);
  app.findGrepPreferences.findWhat = findExp;
  var foundSetList = this.document.findGrep();
  app.findGrepPreferences.findWhat = NothingEnum.nothing;
  if (foundSetList && foundSetList.length > 0) {
    return foundSetList;
  }
  return [];
};
TxtToIndd.prototype.createDialog = function () {
  var target = {
    type: 'panel',
    label: '置き換え対象の検索設定',
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
    }],
    options: {
      length: '30'
    }
  };
  var rubyAlignment = {
    label: 'ルビ設定',
    type: 'panel',
    key: 'ruby',
    items: [{
      type: 'radio',
      key: 'alignment',
      values: [{
        value: 'RUBY_CENTER',
        label: '中付き'
      }, {
        value: 'RUBY_EQUAL_AKI',
        label: '均等アキ',
        checked: true
      }, {
        value: 'RUBY_FULL_JUSTIFY',
        label: '両端揃え'
      }, {
        value: 'RUBY_JIS',
        label: '1-2-1 JISルール'
      }],
      defaultValue: 'RUBY_EQUAL_AKI'
    }, {
      type: 'input',
      key: 'size',
      label: 'ルビサイズ',
      value: '6'
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
      key: 'tripleNL',
      label: '3連続以上の改行を改ページ扱い',
      checked: true
    }]
  };
  var format = {
    label: 'フォーマット調整',
    type: 'panel',
    key: 'format',
    items: [{
      type: 'toggle',
      key: 'indent',
      label: '段落行頭の空白を削除する',
      checked: true
    }]
  };
  var dialog = createDialog('変換設定', [target, rubyAlignment, newPage, format]);
  if (dialog) {
    this.setting = dialog;
    return true;
  } else {
    return false;
  }
};
TxtToIndd.prototype.setRuby = function (textObj) {
  if (!textObj) return;
  var set = String(textObj.contents).split(this.setting.target.delimiter);
  var content = set[0].replace(this.setting.target.start, '');
  var ruby = set[1].replace(this.setting.target.end, '');
  textObj.contents = content;
  textObj.rubyString = ruby;
  textObj.rubyFlag = true;
  textObj.rubyOpenTypePro = false;
  textObj.rubyType = RubyTypes.GROUP_RUBY;
  textObj.rubyAlignment = RubyAlignments[this.setting.ruby.alignment];
  var fontSize = textObj.pointSize;
  textObj.rubyFontSize = this.setting.ruby.size - 0 || 0.6 * fontSize;
};
TxtToIndd.prototype.convertNewPage = function () {
  if (this.setting.newPage.tripleNL[0]) {
    replace(this.document, '[\\r\\n]{3,}', '~P');
  }
  if (this.setting.newPage.str) {
    replace(this.document, '\\s?' + escapeRegExp(this.setting.newPage.str) + '\\r', '~P');
  }
};
TxtToIndd.prototype.format = function () {
  if (this.setting.format.indent) {
    replace(this.document, '^\\s(\\w)', '$1');
  }
};
var converter = new TxtToIndd();
converter.init();
