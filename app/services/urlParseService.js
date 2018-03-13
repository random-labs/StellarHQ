define([], function () {
  function buildData() {
    if (!window.location.search)
      return;

    var str = window.location.search;
    var objURL = {};

    str.replace(
      new RegExp("([^?=&]+)(=([^&]*))?", "g"),
      function ($0, $1, $2, $3) {
        objURL[$1] = $3;
      }
    );

    return objURL;
  }

  function reset() {
    window.history.replaceState({}, document.title, "/");
  }

  return {
    buildData: buildData,
    reset: reset
  }
});
