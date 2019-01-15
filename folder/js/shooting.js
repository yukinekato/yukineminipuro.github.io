// 手も足も出なかったのでとりあえず
// https://lambdalisue.hatenablog.com/entry/2013/12/25/160910"use strict"
// で一週間ほどかけて勉強してからつくりました。
// コードのコメントを書かないとわかりにくいことに気づき最後の方に書き足しています


// FPS：なめらかさを表す単位
var FPS = 30;
var MSPF = 1000 / FPS;
 // 弾発射インターバル
var FIRE_INTERVAL = 20;
// 無敵インターバル（敵に当たった時に無敵になる時間）
var STAR_INTERVAL = 20;
// 鴨がでるまでのインターバル、無敵になるまでのインターバル
var playerFireInterval = 0;
var playerStarInterval = 0;
// 弾の数を定義
var BULLETS = 5;
// 現在位置。BULLETSの要素数で配列を作っていく。
var bulletsX = new Array(BULLETS);
var bulletsY = new Array(BULLETS);
var bulletsHp = new Array(BULLETS);

for (var i=0; i<BULLETS; i++) {
  bulletsX[i] = 0;
  bulletsY[i] = 0;
  bulletsHp[i] = 0;
}
// カラスの数を定義
var ENEMIES = 10;
// 現在位置。BULLETSの要素数で配列を作っていく。
var enemiesX = new Array(ENEMIES);
var enemiesY = new Array(ENEMIES);
var enemiesHp = new Array(ENEMIES);
var keys = new Array(256);
var imgs = {}

// jQuery
// ページロード時に呼び出される処理を指定

$(window).on({
  load: function () {
   var canvas = $("#screen")[0];
   var ctx = canvas.getContext("2d");
// 画像の表示
  var idOfImgs = ["player", "bullet", "enemy"];
    for (var id of idOfImgs) {
      imgs[id] = $("#" + id)[0];
    }
 // 鴨の初期位置＆hp
  var playerX = (canvas.width - player.width) / 2;
   var playerY = (canvas.height - player.height) - 20;
  var playerHp = 10;

// カラスの初期位置＆hp
    for (var i=0; i<ENEMIES; i++) {
      enemiesX[i] = Math.random() * (canvas.width - imgs.enemy.width);
      enemiesY[i] = Math.random() * (canvas.height - imgs.enemy.height);
      enemiesHp[i] = 2;
    }
// 倒したカラスの数を保存する数の定義
  var killed = 0;

    for (var i=0; i<keys.length; i++) {
      keys[i] = false;
    }

 var redraw = function () {
       // ctx.clearRect（x,y,w,h）- 四角形の形にクリアする
      ctx.clearRect(0,0,canvas.width,canvas.height);
      if (playerHp > 0){
        ctx.save();
         // 鴨が生きている場合のみ描画
        if (playerStarInterval % 2 != 0) {
          // globalAlpha属性は、図形やイメージの透明度を指定する際に使用
          ctx.globalAlpha = 0.5;
        }
        ctx.drawImage(imgs.player, playerX, playerY);
        ctx.restore();
      }

      for (var i=0; i<BULLETS; i++) {
        if (bulletsHp[i] > 0) {
          ctx.drawImage(imgs.bullet, bulletsX[i], bulletsY[i]);
        }
      }

      for (var i=0; i<ENEMIES; i++) {
        if (enemiesHp[i] > 0) {
          ctx.drawImage(imgs.enemy, enemiesX[i], enemiesY[i]);
        }
      }
　// 現在の描画状態を保存する
      ctx.save();
  // 線・輪郭の色やスタイルを指定する（ラインで装飾）
      ctx.fillStyle = "#fff";
      ctx.fillRect(10, canvas.height-10, 10 * 5, 5);
      ctx.fillStyle = "#f00";
      ctx.fillRect(10, canvas.height-10, playerHp * 5, 5);
    var text = "Killed: " + killed + "/" + ENEMIES;
      // テキストの描画幅を測定する
   var width = ctx.measureText(text).width;
      // 線・輪郭の色やスタイルを指定する（鴨残りhp）
      ctx.fillStyle = "#fff";
      ctx.fillText(text,
      canvas.width - 10 - width,
      canvas.height - 10);
      if (playerHp <= 0) {
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1.0;
        ctx.font = "20px sans-serif";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#f00";
        text = "Game Over";
        width = ctx.measureText(text).width;
        ctx.fillText(text, (canvas.width-width)/2, canvas.height/2);
      }
      else if (killed == ENEMIES) {
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1.0;
        ctx.font = "20px sans-serif";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#fff";
        text = "Game Clear";
        width = ctx.measureText(text).width;
        ctx.fillText(text, (canvas.width-width)/2, canvas.height/2);
        }

        ctx.restore();
    };


   var movePlayer = function () {
      // もしも(playerHp <= 0)なら
      if (playerHp <= 0) {
        // returnが実行されるとそれ以降の処理は実行されずに中断する＝つまり、playerHp <= 0のとき以下は行わない
        return;
      }
// 移動速度を定義
      var SPEED = 2;
  // これは四角から鴨が飛びなさないようにするため
      if (keys[74] && playerX + imgs.player.width < canvas.width) {
        playerX += SPEED;
      }

      if (keys[70] && playerX > 0) {
        playerX -= SPEED;
      }

// (KEYS[UP]（スペースキーが押される） && duck_fire_interval == 0（インターバルが０に戻っている
      if (keys[32] && playerFireInterval == 0) { 
        for (var i=0; i<BULLETS;  i++) {
          if (bulletsHp[i] == 0) {
             // 弾は鴨が発射するので初期位置が同じ
            bulletsX[i] = playerX;
            bulletsY[i] = playerY;
            // 弾のhpは１。弾を撃ったらFIRE_INTERVALの値が上がる。
            bulletsHp[i] = 1;
            playerFireInterval = FIRE_INTERVAL;
            // 繰り返し文のループ処理から抜け出すことができる、弾を撃ったので抜け出す
            break;
          }
        }
      }
 // プレイヤーがはみ出てしまった場合は強制的に中に戻す
      if (playerFireInterval > 0) {
        playerFireInterval--;
      }

      if (playerX < 0) {
        playerX = 0;
      }
      else if (playerX + imgs.player.width > canvas.width) {
        playerX = canvas.width - imgs.player.width;
      }
    };

// 弾移動処理
    var movePlayerBullets = function () {
     var SPEED = -6;

      for (var i=0; i<BULLETS; i++) {
        if (bulletsHp[i] <= 0) {
          continue;
        }

        bulletsY[i] += SPEED;

        if (bulletsY[i] < imgs.bullet.height) {
          bulletsHp[i] = 0;
        }
      }
    };
// カラス移動処理
    var moveEnemies = function () {
      var SPEED = 2;
      for (var i=0; i<ENEMIES; i++) {
        if (enemiesHp[i] <= 0){
          continue;
        }

        enemiesY[i] += SPEED;

        if (enemiesY[i] > canvas.height) {
          enemiesY[i] = -imgs.enemy.height;
          enemiesX[i] = Math.random() * (canvas.width - imgs.enemy.width);
        }
      }
    };

    // 当たり判定（三平方の定理でx、y座標にしたがっていく）（正直当たり判定はあまり理解できていない）
    //今回は 自分・対象の中心座標と自分・対象の当たり判定用円の半径の二つからなる
    var hitCheck = function (x1, y1, obj1, x2, y2, obj2) {
     var cx1, cy1, cx2, cy2, r1, r2, d;
      cx1 = x1 + obj1.width / 2;
      cy1 = y1 + obj1.height / 2;
      cx2 = x2 + obj2.width / 2;
      cy2 = y2 + obj2.height / 2;
      r1 = (obj1.width+obj1.height) / 4
      r2 = (obj2.width+obj2.height) / 4;
      //  Math.sqrt(d) -- dのルートを返す　　Math.pow(x, a) -- xのa乗を返す
      d = Math.sqrt(Math.pow(cx1-cx2, 2) + Math.pow(cy1-cy2, 2));

      if (r1 + r2 > d) {
        return true;
      }
      else {
        return false;
      }
    };


   var mainLoop = function () {
    var startTime = new Date();
// 鴨、弾、カラスの移動処理
      movePlayer();
      movePlayerBullets();
      moveEnemies();
      // プレイヤーと敵キャラの当たり判定（プレイヤーが生きている場合）
    // かつプレイヤーが無敵ではない場合
      if (playerHp > 0 && playerStarInterval == 0) {
        for (var i=0; i<ENEMIES; i++) {
          if (enemiesHp[i] > 0) {
            if (hitCheck(playerX, playerY, imgs.player, enemiesX[i], enemiesY[i], imgs.enemy)) {
            // ヒットしたので鴨カラス共にhpを−１する
              playerHp -= 1;
              enemiesHp[i] -=1;
              // カラスが死んだら killed  （倒したカラスの数を保存する変数）をふやす
              if (enemiesHp[i] == 0) {
                killed++;
              }
               // 鴨を無敵にする
              playerStarInterval = STAR_INTERVAL;
            }
          }
        }
      }
// プレイヤーが無敵である時、その時間を減少させていく
      if (playerStarInterval > 0) {
        playerStarInterval--;
      }

      if (playerHp > 0) {
        for (var i=0; i<ENEMIES; i++) {
          if (enemiesHp[i] <= 0) {
            continue;
          }

          for (var j=0; j<BULLETS; j++) {
            // 弾が死んでいる場合はcontinue（そのまま進める
            if (bulletsHp[j] <= 0) {
              continue;
            }

            if (hitCheck(bulletsX[j], bulletsY[j], imgs.bullet, enemiesX[i], enemiesY[i], imgs.enemy)) {
              bulletsHp[j] -= 1;
              enemiesHp[i] -=1;
              if (enemiesHp[i] == 0) {
                killed++;
              }
            }
          }
        }
      }
// 描画する
      redraw();

     var deltaTime = (new Date()) - startTime;
      var interval = MSPF - deltaTime;
      if (interval > 0) {
          setTimeout(mainLoop, interval);
      }
      else {
        setTimeout(mainLoop, 0);
      }
    };

    var blinker = 0;
   var titleLoop = function() {
      var startTime = new Date();
      // 　　　最初の画面をつくる
　　　// ctx.clearRect（x,y,w,h）- 四角形の形にクリアする
　　　 ctx.clearRect(0, 0, canvas.width, canvas.height);
　　　　// 現在の描画状態を保存する
　　　 ctx.save();
      // 線・輪郭の色やスタイルを指定する（ラインで装飾）
      ctx.strokeStyle = '#fff';
      // 現在のパスをリセットする
      // 授業でやった星と考え方はおなじ
	    ctx.beginPath();
      // 新しいサブパスの開始点を座標指定する
	    ctx.moveTo(20, 100);
	    ctx.lineTo(canvas.width-20, 100);
	    ctx.stroke();
	    ctx.beginPath();
	    ctx.moveTo(20, 145);
	    ctx.lineTo(canvas.width-20, 145);
	    ctx.stroke();
	    ctx.strokeStyle = '#444';
	    ctx.beginPath();
	    ctx.moveTo(30, 90);
	    ctx.lineTo(canvas.width-30, 90);
	    ctx.stroke();
	    ctx.beginPath();
	    ctx.moveTo(30, 155);
	    ctx.lineTo(canvas.width-30, 155);
	    ctx.stroke();

      var text, width;
      ctx.font = "20px serif";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#fff";
      text = "crow hunter";
      width = ctx.measureText(text).width;
      ctx.fillText(text, (canvas.width - width) / 2, 120);

      blinker++;

      if (blinker > 20) {
        ctx.globalAlpha = 0.5;
          if (blinker > 30) {
            blinker = 0;
          }
      }

      ctx.font = "12px sans-serif";
      ctx.textBaseline = "middle";
      text = "Hit esc to Start";
      width = ctx.measureText(text).width;
      ctx.fillText(text, (canvas.width - width) / 2, 240);
      ctx.globalAlpha = 1.0;
      ctx.restore();
      if (keys[27]) {
        mainLoop();
        return;
      }

     var deltaTime = (new Date()) - startTime;
     var interval = MSPF - deltaTime;
      if (interval > 0) {
         setTimeout(titleLoop, interval);
      }
      else {
        setTimeout(titleLoop, 0);
      }
    };
    // タイトルループを開始
    titleLoop();
  },

   // キーが押された時（onkeydown）に呼び出される処理を指定
  keyup: function (e) {
    keys[e.keyCode] = false;
  },
  keydown: function (e) {
    keys[e.keyCode] = true;
  }
});
