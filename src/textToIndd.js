import './polyfills/map';
import './polyfills/forEach';

import './utils/resetOptions';
import './utils/resetPreferences'

import createDialog from './utils/createDialogWindow';
import replace from './utils/replaceText';

function escapeRegExp(s) {
  return s.replace(/[\\^$.*+?()\[\]{}|]/g, '\\$&')
}

// コンストラクタ
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

TxtToIndd.prototype.init = function()  {
  var dialog = this.createDialog();
  if(!dialog) return;

  var foundTexts = this._findRubyTarget();
  var len = foundTexts.length;
  for(var i = 0; i < len; i++) {
    this.setRuby(foundTexts[i]);
  }

  this.format();
  this.convertNewPage();
};

// 検索
TxtToIndd.prototype._findRubyTarget = function()  {
  var findExp =
    escapeRegExp(this.setting.target.start) +
    '.+?' + escapeRegExp(this.setting.target.delimiter) +
    '.+?' + escapeRegExp(this.setting.target.end);

  // 対象の漢字一覧を検索
  // 検索クエリを設定
  app.findGrepPreferences.findWhat = findExp;

  // 検索実行
  var foundSetList = this.document.findGrep();

  // 検索設定を初期化
  app.findGrepPreferences.findWhat = NothingEnum.nothing;

  if(foundSetList && foundSetList.length > 0) {
    return foundSetList;
  }
  return [];
};


TxtToIndd.prototype.createDialog = function () {
  var target = {
    type: 'panel',
    label: '置き換え対象の検索設定',
    key: 'target',
    items: [
      {type: 'input', key: 'start',label: '開始', value: this.setting.target.start},
      {type: 'input', key: 'delimiter', label: '区切り', value: this.setting.target.delimiter},
      {type: 'input', key: 'end', label: '終了', value: this.setting.target.end}
    ],
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
      values: [
        { value: 'RUBY_CENTER', label: '中付き'},
        { value: 'RUBY_EQUAL_AKI', label: '均等アキ', checked: true},
        { value: 'RUBY_FULL_JUSTIFY', label: '両端揃え'},
        { value: 'RUBY_JIS', label: '1-2-1 JISルール'}
      ],
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
  }

  // ダイアログを表示
  var dialog = createDialog('変換設定', [target, rubyAlignment, newPage, format]);

  // OKの場合はflagにtrueが入る
  if (dialog) {
    // 検索対象
    this.setting = dialog;
    return true;

    // キャンセルされたらなにもしない
  } else {
    return false;
  }
};

//選択されたテキストをルビに変換する
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

  //以下の単位はポイント
  textObj.rubyFontSize = this.setting.ruby.size - 0 || 0.6 * fontSize;
}

TxtToIndd.prototype.convertNewPage = function() {
  if(this.setting.newPage.tripleNL[0]) {
    replace(this.document, '[\\r\\n]{3,}', '~P')
  }
  if (this.setting.newPage.str) {
    replace(this.document,'\\s?' + escapeRegExp(this.setting.newPage.str) + '\\r','~P');
  }
}

TxtToIndd.prototype.format = function() {
  if(this.setting.format.indent) {
    replace(this.document, '^\\s(\\w)', '$1')
  }
}

var converter = new TxtToIndd();
converter.init();
