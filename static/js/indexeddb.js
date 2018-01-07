//https://dev.classmethod.jp/ria/html5/html5-indexed-database-api/
var dbName = "mydb";
var dbVersion = "3.0";
var storeName  = 'mystore'; // Table
var db;
var indexedDB = window.indexedDB || window.mozIndexedDB || window.msIndexedDB;

function initIndexedDB(type){
  if (indexedDB) {
    var openRequest = indexedDB.open(dbName, dbVersion);
     
    openRequest.onupgradeneeded = function(event) {
      // 本来テーブルに対し差分を反映しないといけないが、めんどいのでテーブル削除し作り直し
      db = event.target.result;
      db.deleteObjectStore(storeName);
      var store = db.createObjectStore(storeName, { keyPath: "lno"});
      console.log('IndexedDB version up:' + storeName);
    }
     
    openRequest.onsuccess = function(event) {
      db = event.target.result;
      console.log('IndexedDB initialized OK Version:' + db.version);
      if(type==1){
        readAll();
      } else if (type==2) {
        setSyncAll();
      } else if (type==3) {
        delUploadedAll();
      }
    }
  } else {
    window.alert("このブラウザではIndexed DataBase API は使えません。");
  }
}

function addRecord(){
  var transaction = db.transaction(storeName, "readwrite");
  var store = transaction.objectStore(storeName);
  var request = store.put({
    lno: $('#lno').val(), 
    jname: $('#jname').val(),
    kname: $('#kname').val(),
    tel: $('#tel').val(),
    postal: $('#postal').val(),
    address1: $('#address1').val(),
    address2: $('#address2').val(),
    address3: $('#address3').val(),
  });
  request.onsuccess = function (event) {
    console.log("IndexedDB add record:" + $('#lno').val());
    // 更新後の処理
    $('.linfo').val("");
    $('#lno').val(getUniqueStr());
    readAll();
  }
}

function readAll(){
  $("#list").empty();

  var transaction = db.transaction(storeName, "readonly");
  var store = transaction.objectStore(storeName);
  var request = store.openCursor();
   
  request.onsuccess = function (event) {
   
    if(event.target.result == null) {
      return;
    }
     
    var cursor = event.target.result;
    var data = cursor.value;
    $('#list').append('<li class="list-group-item">'
      + 'lNo:' + cursor.key 
      + ' / 氏名:' + data.jname
      + ' / カナ:' + data.kname
      + ' / 電話番号:' + data.tel
      + ' / 郵便番号:' + data.postal
      + ' / 住所:' + data.address1 + data.address2 + data.address3
      + '</li>'
    );
    cursor.continue();
  }
  console.log("IndexedDB read all:" + storeName);
}

function delAll(){
    var transaction = db.transaction(storeName, "readwrite");
    var store = transaction.objectStore(storeName);
    var request = store.clear();
    request.onsuccess = function (event) {
      // 全件削除後の処理
      $("#list").empty();
      console.log('IndexedDB delete store:' + storeName);
    }
}

function delRecord(lno){
    var transaction = db.transaction(storeName, "readwrite");
    var store = transaction.objectStore(storeName);
    var request = store.delete(lno);

    request.onsuccess = function (event) {
      console.log('IndexedDB delete record:' + lno);
    }
}


function setSyncAll(){
  var transaction = db.transaction(storeName, "readonly");
  var store = transaction.objectStore(storeName);
  var request = store.openCursor();
  var rowcount = 0;
  var formkey = 'id_form-*-'
  request.onsuccess = function (event) {
   
    if(event.target.result == null) {
      return;
    }
     
    var cursor = event.target.result;
    var data = cursor.value;
    
    $('#' + formkey.replace('*', rowcount) + 'lno').val(cursor.key);
    $('#' + formkey.replace('*', rowcount) + 'jname').val(data.jname);
    $('#' + formkey.replace('*', rowcount) + 'kname').val(data.kname);
    $('#' + formkey.replace('*', rowcount) + 'tel').val(data.tel);
    $('#' + formkey.replace('*', rowcount) + 'postal').val(data.postal);
    $('#' + formkey.replace('*', rowcount) + 'address1').val(data.address1);
    $('#' + formkey.replace('*', rowcount) + 'address2').val(data.address2);
    $('#' + formkey.replace('*', rowcount) + 'address3').val(data.address3);
    
    console.log('IndexedDB read for sync:' + cursor.key);

    rowcount++;
    cursor.continue();
  }
}

function delUploadedAll(){
  $(".lno").each(function() {
    delRecord($(this).text());
  });  
}

function getUniqueStr(myStrong){
 var strong = 1000;
 if (myStrong) strong = myStrong;
 return new Date().getTime().toString(10) //+ Math.floor(strong*Math.random()).toString(10)
}