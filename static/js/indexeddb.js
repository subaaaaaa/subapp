//https://dev.classmethod.jp/ria/html5/html5-indexed-database-api/

$(function(){
    $('#add').on('click',function(){
        var key = $('#key').val();
        var val = $('#val').val();
        var transaction = db.transaction(["mystore"], "readwrite");
        var store = transaction.objectStore("mystore");
        var request = store.put({ mykey: key, myvalue: val});
        request.onsuccess = function (event) {
          // 更新後の処理
          $('#key').val("");
          $('#val').val("");
        }
    });  

    $('#read').on('click',function(){
        $("#list").empty();
      
        var transaction = db.transaction(["mystore"], "readwrite");
        var store = transaction.objectStore("mystore");
        var request = store.openCursor();
         
        request.onsuccess = function (event) {
         
          if(event.target.result == null) {
            return;
          }
           
          var cursor = event.target.result;
          var data = cursor.value;
          $('#list').append('<li>' + cursor.key + '/' + data.myvalue + '</li>')
          console.log("key："  + cursor.key +  "  value：" + data.myvalue);
          cursor.continue();
        }
    });  
    
    $('#delall').on('click',function(){
      var transaction = db.transaction(["mystore"], "readwrite");
      var store = transaction.objectStore("mystore");
      var request = store.clear();
      request.onsuccess = function (event) {
        // 全件削除後の処理
        $("#list").empty();
      }
    });

});

var db;
var indexedDB = window.indexedDB || window.mozIndexedDB || window.msIndexedDB;
if (indexedDB) {
  // データベースを削除したい場合はコメントを外します。
  //indexedDB.deleteDatabase("mydb");
  var openRequest = indexedDB.open("mydb", 1.0);
   
  openRequest.onupgradeneeded = function(event) {
    // データベースのバージョンに変更があった場合(初めての場合もここを通ります。)
    db = event.target.result;
    var store = db.createObjectStore("mystore", { keyPath: "mykey"});
     
    // インデックスを作成します。
    store.createIndex("myvalueIndex", "myvalue");
  }
   
  openRequest.onsuccess = function(event) {
        db = event.target.result;
    }
} else {
  window.alert("このブラウザではIndexed DataBase API は使えません。");
}

