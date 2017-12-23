importScripts('serviceworker-cache-polyfill.js');

// インストール時 (register時) に静的ファイルをキャッシュしておく
self.oninstall = function(event) {
  // .waitUntil() に渡された Promises が resolve されたら
  // インストール完了
  event.waitUntil(
    caches.open('statics-v1').then(function(cache) {
      return cache.addAll([
        '/',
        '/page.js',
        '/offline_icon.png',
        '/main.css',
        '/static/css/',
        '/static/js/',
        ]);
    })
  );
};

// ページヘのネットワークリクエストが来たらキャッシュにある
// データを返す
self.onfetch = function(event) {
  event.respondWith(
    caches.open('statics-v1').then(function(cache) {
      return cache.match(event.request).then(function(response) {
        console.log(event.request.url, response);
        if (response)
          return response;
        fetch(event.request.clone()).then(function(response) {
          if (response.status < 400) {
            // HTTP response code がエラーじゃないときだけ fetch が返した
            // レスポンス(のコピー)をキャッシュする。
            // (ただし、non-CORS リクエストについてはレスポンスは filtered
            // opaque response となり、.status は常に 0 にセットされるため、
            // エラーレスポンスをキャッシュしてしまう可能性はある
            // https://fetch.spec.whatwg.org/#concept-filtered-response-opaque)
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
};