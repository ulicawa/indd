import '../polyfills/map';
import '../polyfills/forEach';
import '../polyfills/indexOf';

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
  // 後で結果を取り出すためのリスト
    // チェックボックスを追加する
  var cb = target.add('checkbox', undefined, label);
  // デフォルト値にチェックを付ける
  if(checked) cb.value = true;

  return function () {
    return cb.value;
  }
}

function createRadios(target, values) {
  // 後で結果を取り出すためのリスト
  var boolList = values.map(function (value) {
    // チェックボックスを追加する
    var cb = target.add('radiobutton', undefined, value.label);
    // デフォルト値にチェックを付ける
    if(value.checked) cb.value = true;
    return cb;
  });

  return function () {
    var val;
    // trueが返ってきているインデックスのvalueを返却リストに追加する
    boolList.forEach(function (res, i) {
      if (res.value) {
        val = values[i].value
      }
    });

    return val;
  }
}

function createCheckboxes(target, values) {
  // 後で結果を取り出すためのリスト
  var elms = values.map(function (value) {
    // チェックボックスを追加する
    var cb = target.add('checkbox', undefined, value.label);
    // デフォルト値にチェックを付ける
    if(value.checked) cb.value = true;
    return cb;
  });

  return function () {
    var valList = [];
    // trueが返ってきているインデックスのvalueを返却リストに追加する
    elms.forEach(function (res, i) {
      if (res.value) {
        valList.push(values[i].value);
      }
    });

    return valList;
  }
}

function createInput(target, label, value, options) {
  var op = options | {};
  var wrap = target.add('group');
  wrap.add('statictext', undefined, label);

  var input = wrap.add('edittext', undefined, value);
  input.characters = op.length || 30 - (label.length*2);

  return function () {
    return input.text;
  }
}

// createGroup(window, 'group', [{type: checkbox, ...}])
function createGroupLike(target, type, label) {
  // 設定の取得
  var _type = type;
  var orientation = '';
  if (isArray(type)) {
    _type = type[0];
    orientation = type[1];
  }

  // グループ作成
  var groupLike = target.add(_type, undefined, label);
  if(orientation) groupLike.orientation = orientation;
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

  // 値のツリー
  var res = {};

  // ダイアログが閉じられるまで値を待機する関数のリスト
  var waiting = [];
  setting.forEach(function(group) {
    var area = createGroupLike(window, group.type, group.label);
    res[group.key] = {};
    group.items.forEach(function(item) {
      var elm = createElement(area, item);
      waiting.push(function() {
        res[group.key][item.key] = elm();
      });
    })
  })

  createButtons(window);

  var decision = window.show();

  if(decision === 1) {
    waiting.forEach(function(f){ f();});
    // 値を解決
    return res;
  }
  return;
}

export default createDialog;