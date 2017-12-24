importScripts('/cache-polyfill.js');

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
  event.respondWith(caches.match(event.request));
};
