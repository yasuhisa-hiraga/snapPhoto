/********
*
* 
* 2018.11.20
* created by Yasuhisa Hiraga
*******/


var video;
var count = 0;
window.onload = function(){
    //videoタグを取得
    video = document.getElementById('camera');
    //カメラが起動できたかのフラグ
    var localMediaStream = null;
    //カメラ使えるかチェック
    var hasGetUserMedia = function() {
        return (navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia);
    };

    //エラー
    var onFailSoHard = function(e) {
        console.log('エラー!', e);
    };

    if(!hasGetUserMedia()) {
        alert("未対応ブラウザです。");
    } else {
        window.URL = window.URL || window.webkitURL;
        navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        navigator.getUserMedia({video: true}, function(stream) {
            video.src = window.URL.createObjectURL(stream);
            localMediaStream = stream;
        }, onFailSoHard);
    }
};

// カメラの映像をcanvasへ出力
function cameraToCanvas(){
    var canvas = document.getElementById('myCanvas');
    //canvasの描画モードを2sに
    var ctx = canvas.getContext('2d');
    var img = document.getElementById('img');

    //videoの縦幅横幅を取得
    var w = video.offsetWidth;
    var h = video.offsetHeight;

    //同じサイズをcanvasに指定
    canvas.setAttribute("width", w);
    canvas.setAttribute("height", h);

    //canvasにコピー
    ctx.drawImage(video, 0, 0, w, h);
}


// canvas上のイメージを保存
function saveCanvas(){

    // カメラの画像をcanvasに保存
    cameraToCanvas();

    // ファイル名決定
    var fileName = "face_" + count + ".png";
    count++;

    var canvas = document.getElementById("myCanvas");
    // base64エンコードされたデータを取得 「data:image/png;base64,iVBORw0k～」
    var base64 = canvas.toDataURL('png');
    // base64データをblobに変換
    var blob = Base64toBlob(base64);
    // blobデータをa要素を使ってダウンロード
    saveBlob(blob, fileName);
}
 
// Base64データをBlobデータに変換
function Base64toBlob(base64)
{
    // カンマで分割して以下のようにデータを分ける
    // tmp[0] : データ形式（data:image/png;base64）
    // tmp[1] : base64データ（iVBORw0k～）
    var tmp = base64.split(',');
    // base64データの文字列をデコード
    var data = atob(tmp[1]);
    // tmp[0]の文字列（data:image/png;base64）からコンテンツタイプ（image/png）部分を取得
	var mime = tmp[0].split(':')[1].split(';')[0];
    //  1文字ごとにUTF-16コードを表す 0から65535 の整数を取得
	var buf = new Uint8Array(data.length);
	for (var i = 0; i < data.length; i++) {
        buf[i] = data.charCodeAt(i);
    }
    // blobデータを作成
	var blob = new Blob([buf], { type: mime });
    return blob;
}
 
// 画像のダウンロード
function saveBlob(blob, fileName)
{
    var url = (window.URL || window.webkitURL);
    // ダウンロード用のURL作成
    var dataUrl = url.createObjectURL(blob);
    // イベント作成
    var event = document.createEvent("MouseEvents");
    event.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    // a要素を作成
    var a = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
    // ダウンロード用のURLセット
    a.href = dataUrl;
    // ファイル名セット
    a.download = fileName;
    // イベントの発火
    a.dispatchEvent(event);
}