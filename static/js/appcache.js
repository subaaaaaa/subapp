var appCache = window.applicationCache;

appCache.update();

if(appCache.status == window.applicationCache.UPDATEREADY) {
  appCache.swapCache();
}