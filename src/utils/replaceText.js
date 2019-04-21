export default function (target, from, to) {
  app.findGrepPreferences.findWhat = from;
  app.changeGrepPreferences.changeTo = to;
  target.changeGrep();
  // reset
  app.findGrepPreferences.findWhat = NothingEnum.nothing;//検索の設定
  app.changeGrepPreferences.changeTo = NothingEnum.nothing;//置換の設定
}