const express = require('express'); // expressモジュールを読み込む
const multer = require('multer'); // multerモジュールを読み込む
const uuidv4 = require('uuid/v4'); // uuidモジュールを読み込む

const app = express(); // expressアプリを生成する
app.use(multer().none()); // multerでブラウザから送信されたデータを解釈する
app.use(express.static('web')); // webフォルダの中身を公開する

var bbb_api_generator = require('./bigbluebutton-api.js');
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

////////////////////////////////////////////////
// ubuntu@ubuntu:~$ sudo bbb-conf --secret
// [sudo] password for ubuntu:
//
//     URL: https://demo-bbb.dtosh-digitalschool.com/bigbluebutton/
//     Secret: brVgoyAKhraDOlpO9X1lA8JJhqX2IHSEZDv74KKA
////////////////////////////////////////////////

var server = 'https://demo-bbb.dtosh-digitalschool.com/bigbluebutton/api'
var salt = 'brVgoyAKhraDOlpO9X1lA8JJhqX2IHSEZDv74KKA'
var classId = '9239433'  // the unique id of a classroom
var roomId = '001'      // the number of the room in the classroom $classId
var meetingID = classId+'_'+roomId;
var moderatorPW = 'mp';
var attendeePW = 'ap';
var password = '';
var meetingName = 'Test Class';
var fullName = 'Toshiki Hirao';
var redirect = true;

api = new bbb_api_generator.BigBlueButtonApi(server, salt);
params = { meetingID: meetingID, moderatorPW: moderatorPW,
  attendeePW: attendeePW, name: meetingName, fullName: fullName, redirect: redirect, password: password};
urls = [];
_ref = api.availableApiCalls();

for (method of _ref) {
  if (method === 'join') {
    params['password'] = params['attendeePW'];
  }
  urls.push({ name: method, description: method, url: api.urlFor(method, params) });
};
//console.log(api);
//console.log(params)
console.log(urls);

const todoList = [];

// http://localhost:3000/api/v1/list にアクセスしてきたときに
// TODOリストを返す
app.get('/api/v1/create', (req, res) => {
    // JSONを送信する
    console.log('comming here')
    let out = '';
    let url = server;
    xhr.open("GET", urls[1]['url'], false);
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

app.get('/api/v1/join_as_moderator', (req, res) => {
    // JSONを送信する
    let out = '';
    let url = server;
    console.log(urls[2]['url'])
    xhr.open("GET", urls[2]['url'], false);
    xhr.onload = function (e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
             //   console.log(xhr.responseText);
                out = xhr.responseText
                console.log("successed")
            } else {
                console.log("failed")
                console.error(xhr.responseText);
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
