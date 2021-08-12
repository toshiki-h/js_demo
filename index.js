const express = require('express'); // expressモジュールを読み込む
const multer = require('multer'); // multerモジュールを読み込む
const uuidv4 = require('uuid/v4'); // uuidモジュールを読み込む

const app = express(); // expressアプリを生成する
app.use(multer().none()); // multerでブラウザから送信されたデータを解釈する
app.use(express.static('web')); // webフォルダの中身を公開する

var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

const todoList = [];

// http://localhost:3000/api/v1/list にアクセスしてきたときに
// TODOリストを返す
app.get('/api/v1/bbb', (req, res) => {
    // JSONを送信する
    console.log('comming here')
    let out = '';
    let url = 'https://test-install.blindsidenetworks.com/bigbluebutton/api/'
    xhr.open("GET", url, false);    
    xhr.onload = function (e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
             //   console.log(xhr.responseText);
                out = xhr.responseText
            } else {
                console.error(xhr.statusText);
            }
        }
    };
    xhr.onerror = function (e) {
    console.error(xhr.statusText);
    };
    xhr.send(null);
    console.log(out)
    res.header('Content-Type', 'text/xml; charset=utf-8');
    res.send(out)
});

// ポート3000でサーバを立てる
app.listen(3000, () => console.log('Listening on port 3000'));