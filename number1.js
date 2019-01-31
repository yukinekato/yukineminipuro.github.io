//info1で使ったもの
var count;
var Start,End;
var cnt;

//cookieを使えるかどうか
if (navigator.cookieEnabled)
{
	//変数countにcookieデータを入れる
  count=document.cookie + ";";


  Start = count.indexOf("counts=",0);

  //データがあるかどうか
  if (Start == -1)
  {
    //データの無い場合
    document.write("1回目の訪問です！");

    //cookieに訪問回数=1を書き込む
    document.cookie="counts=1;";
  }
  else
  {

    End=count.indexOf(";",Start);

    cnt=count.substring(Start+7,End);
    try
    {
      //回数+1で表示する
      cnt=parseInt(cnt)+1;
      document.write(cnt+"回目の訪問です！");

      //cookieに訪問回数を記入
      document.cookie="counts="+cnt+";";
    }
    catch(e)
    {
      document.write("訪問回数の取得に失敗しました。");
    }
  }
}
else
{
  //cookieが使えない場合
  document.write("cookieが使用できません。");
}
