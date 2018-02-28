require([
  'knockout',
  'viewModels/appViewModel',
  'domReady',
  'util'
], function (
  ko,
  appViewModel,
  domReady,
  util
) {
  domReady(function () {

    if (!util.isOnline()) {
      ko.applyBindings(new appViewModel());
      return;
    }

    document.getElementById('refreshButton').onclick = function () {
      location.reload(true);
    }

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        var repoData = JSON.parse(xmlHttp.responseText);

        var lastCommitHash = localStorage['commitHash'];

        //to make sure it exists and that things are up to date
        //if someone has version before hash check
        if (!lastCommitHash) {
          localStorage['commitHash'] = repoData.object.sha;
          location.reload(true);
        }

        if (lastCommitHash !== repoData.object.sha) {
          document.getElementById('refresh').style.display = 'block';
        }

        localStorage['commitHash'] = repoData.object.sha;
        ko.applyBindings(new appViewModel());
      }
    }

    xmlHttp.open("GET", 'https://api.github.com/repos/lumenaut-network/stellarhq/git/refs/heads/master', true);
    xmlHttp.send(null);
  });
});

require.config({
  paths: {
    'stellar-sdk': '../bower_components/stellar-sdk/stellar-sdk.min',
    knockout: '../bower_components/knockout/dist/knockout',
    requirejs: '../bower_components/requirejs/require',
    domReady: '../bower_components/domReady/domReady',
    qrcode: '../bower_components/qrcode-generator/js/qrcode',
    jsqr: '../bower_components/jsQR/dist/jsQR'
  },
  shim: {
    'stellar-sdk': {
      exports: 'StellarSdk'
    },
    'jsqr': {
      exports: 'jsQR'
    }
  },
  packages: [

  ]
});
