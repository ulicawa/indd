import './polyfills/map';
import './polyfills/forEach';

import './utils/resetOptions';
import './utils/resetPreferences'

import createDialog from './utils/createDialogWindow';
import replace from './utils/replaceText';

var lang = {
  dividerString: {
    '~M' : '改段',
    '~P' : '改ページ',
  }
}

// コンストラクタ
function Formatter() {
  this.document = app.activeDocument;

  this.setting = {
    target: {
      start : '[[rb:',
      end : ']]',
      delimiter : ' > ',
    },
    newPage: {
      str: '[newpage]',
      break: true,
      target: ['~M', '~P'],
    },
    format: {
      indent: true
    }
  }
}

// 検索
Formatter.prototype._find = function()  {
  // グループルビ
  // 検索クエリを設定
  app.findTextPreferences.rubyType = RubyTypes.GROUP_RUBY;
  // 検索実行
  var groupList = this.document.findText();
  app.findTextPreferences.rubyType = NothingEnum.nothing;

  // モノルビ
  app.findTextPreferences.rubyType = RubyTypes.PER_CHARACTER_RUBY;
  var monoList = this.document.findText();

  // 検索設定を初期化
  app.findTextPreferences.rubyType = NothingEnum.nothing;

  return groupList.concat(monoList);
};

//指定書式に変換する
Formatter.prototype._replace = function (textObj) {
  if (!textObj) return;

  var content = String(textObj.contents);
  var ruby = String(textObj.rubyString);

  textObj.contents = this.setting.target.start
    + content + this.setting.target.delimiter
    + ruby + this.setting.target.end;

  textObj.rubyFlag = false;
}

Formatter.prototype.init = function () {
  var dialog = this.createDialog();
  // なにもしない
  if(!dialog) return;
  this.convertRuby();
  this.convertNewPage();
  this.convertIndent();
};

Formatter.prototype.createDialog = function () {
  var target = {
    type: 'panel',
    label: 'ルビ置き換え設定',
    key: 'target',
    items: [
      {type: 'input', key: 'start',label: '開始', value: this.setting.target.start},
      {type: 'input', key: 'delimiter', label: '区切り', value: this.setting.target.delimiter},
      {type: 'input', key: 'end', label: '終了', value: this.setting.target.end}
    ]
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
    },{
      type: 'toggle',
      key: 'break',
      label: '改ページ文字の前後を改行',
      checked: this.setting.newPage.break,
    },{
      type: 'checkbox',
      key: 'target',
      label: '改ページ文字への置き換え対象',
      values: this.setting.newPage.target.map(function(str){
        return {
          label: lang.dividerString[str],
          value: str,
          checked: true
        }
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
  }

  // ダイアログを表示
  var dialog = createDialog('置き換え設定', [target, newPage, format]);

  // OKの場合はflagにtrueが入る
  if (dialog) {
    this.setting = dialog;

    return true;

  // キャンセルされたらなにもしない
  } else {
    return false;
  }
};

Formatter.prototype.convertIndent = function() {
  if(this.setting.format.indent) {
    app.findGrepPreferences.findWhat = '(^.)';//検索の設定
    app.changeGrepPreferences.changeTo = '　$1';//置換の設定
    this.document.changeGrep();

    app.findGrepPreferences.properties.findWhat = NothingEnum.nothing;//検索の設定
    app.changeGrepPreferences.properties.changeTo = NothingEnum.nothing;//置換の設定

  }
}

Formatter.prototype.convertNewPage = function() {
  var _that = this;
  var to = this.setting.newPage.str;
  if(this.setting.newPage.break) {
    to = '\r' + to + '\r';
  }
  this.setting.newPage.target.forEach(function(str) {
    // 改ページ
    replace(_that.document, str, to);
  })
}

Formatter.prototype.convertRuby = function() {
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
