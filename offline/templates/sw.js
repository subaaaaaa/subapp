/*
https://qiita.com/kaihar4/items/c09a6d73e190ab0b9b01
https://qiita.com/otolab/items/72ac10a0880ea411d77e#_reference-7ae8c3acee7f674ed64a
あらかじめ定義しておいたキャッシュしたいファイルの一覧 STATIC_FILES をFetch APIで取得し、 
STATIC_CACHE_KEY をキーとしてCache Storageに保存しています。
STATIC_CACHE_KEY はキャッシュしたいファイルが更新された場合に書き換えることでキャッシュのバージョンを管理します。
*/
const ORIGIN = location.protocol + '//' + location.hostname;
const STATIC_CACHE_KEY = '9';  // テストのため、オンラインなら常に読みこませる
console.log(STATIC_CACHE_KEY);
const STATIC_FILES = [
  ORIGIN + '/',
  ORIGIN + '/static/css/bootstrap.min.css',
  ORIGIN + '/static/css/bootstrap-theme.min.css',
  ORIGIN + '/static/js/bootstrap.min.js',
  ORIGIN + '/static/js/jquery-2.2.4.min.js',
  ORIGIN + '/static/js/indexeddb.js',
  ORIGIN + '/static/css/offline.css',
  'https://ajaxzip3.github.io/ajaxzip3.js',
  /*
  ORIGIN + '/',
  ORIGIN + '/stylesheets/index.css',
  ORIGIN + '/javascripts/index.js',
  'https://file.kaihar4.com/images/icon.png'
  */
];

if (navigator.serviceWorker){
  navigator.serviceWorker.register('/sw.js', {scope:'/'})
    .then(function(registraion) {
        /*
        ここで早速テクニックのひとつ目です。
        register時に registration.update() を実行しています。
        通常Service Workerは有効化されたページを開いた際に、 Cache-Controlに従ってService Workerを取得し更新を試みます。
        (Cache-Controlに極端に長いmax-ageを指定された際の対策として最低24時間に1度更新します)
        そこで、ここではregister時に強制的にupdateすることで、ページを開き直さなくてもService Workerが更新されるようにしています。
        また、 registration.update() はService Worker内のプログラム上で実行することもできるので、任意のタイミングで更新することも可能です。
        */
        registraion.update();
        if (navigator.serviceWorker.controller) {
          console.log('このページは ServiceWorker にコントロールされています');
        } else {
          console.log('ServiceWorker が登録されました');
        }
      })
    .catch(function(err) {
      console.log('ServiceWorker の登録に失敗しました: ' + err);
    });
} else {
  console.log('ServiceWorker非対応のブラウザです');
}

function getUniqueStr(myStrong){
 var strong = 1000;
 if (myStrong) strong = myStrong;
 return new Date().getTime().toString(16)  + Math.floor(strong*Math.random()).toString(16)
}


/*
言い忘れていましたが、Service Workerではファイルを取得する際にXHRではなくFetch APIを利用します。
これはFetch APIが返す Response オブジェクトをCache APIが利用するためです。

余談ですが、Fetch APIはXHRと異なりPromiseを返す設計で扱いやすく、今後はService Workerだけに限らずブラウザでも利用することが可能となっていきます。

ここでもテクニックが登場します。
fetch に与える Request オブジェクトの第2引数にオプションとして { cache: 'no-cache', mode: 'no-cors' } を指定しています。

今回の実装ではキャッシュはService Workerがインストールされた時にしか取得されません。
そのため、タイミングによってはmax-ageが切れる直前のファイルがキャッシュされて古いキャッシュを握ったままになってしまうことがあるため、 no-cache によって Cache-Control: no-cache でリクエストさせています。

また、Fetch APIはcors未対応のWebサーバからデータを取得する no-cors に対応しています。
ここでは、これを利用することによりWebページにありがちな外部リソースへのリクエストもキャッシュ可能にしています。

ちなみに、 no-cors によるレスポンスをそのままプログラムが扱えるのは好ましくないため、 Response オブジェクトでラップすることでプログラムからは読み込めないがキャッシュとしては利用できるということを実現しています。
これもXHRではなくFetch APIが採用されている理由のひとつです。
*/
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE_KEY).then(cache => {
      return Promise.all(
        STATIC_FILES.map(url => {
          return fetch(new Request(url, { cache: 'no-cache', mode: 'no-cors' })).then(response => {
            return cache.put(url, response);
          });
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request, {cacheName: STATIC_CACHE_KEY}).then(response => {
      return response || fetch(event.request);
    })
  );
});

const CACHE_KEYS = [
  STATIC_CACHE_KEY
];

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => {
          return !CACHE_KEYS.includes(key);
        }).map(key => {
          return caches.delete(key);
        })
      );
    })
  );
});

self.addEventListener('push', event => {
  const options = event.data.json();
  event.waitUntil(
    caches.open(STATIC_CACHE_KEY).then(cache => {
      fetch(new Request(options.data.url, { mode: 'no-cors' })).then(response => {
        cache.put(options.data.url, response);
      }).then(() => {
        self.registration.showNotification(options.title, options);
      });
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});

/*
var service_worker_version = '015';

importScripts('./cache-polyfill.js');

// インストール時 (register時) に静的ファイルをキャッシュしておく
self.oninstall = function(event) {
  // .waitUntil() に渡された Promises が resolve されたら
  // インストール完了
  event.waitUntil(
    caches.open('statics-v1').then(function(cache) {
      return cache.addAll([
       '/',
       //'/cache-polyfill.js',
       '/page.js',
       //'/sw.js',
       '/static/css/bootstrap.min.css',
       '/static/css/bootstrap-theme.min.css',
       '/static/js/bootstrap.min.js',
       '/static/js/jquery-2.2.4.min.js',
       '/static/js/indexeddb.js',
       '/static/css/offline.css',
        ]);
    })
  );
};

// ページヘのネットワークリクエストが来たらキャッシュにある
// データを返す
self.onfetch = function(event) {
    //event.respondWith(caches.match(event.request));
    event.respondWith(
        caches.match(event.request, {ignoreSearch:true}).then(response => {
            return response || fetch(event.request);
        })
    );
};
*/