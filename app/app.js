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

    ko.applyBindings(new appViewModel());
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
