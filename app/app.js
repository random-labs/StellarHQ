require(['knockout', 'viewModels/appViewModel', 'domReady!'], function (ko, appViewModel) {
  ko.applyBindings(new appViewModel());
});

require.config({
  paths: {
    'stellar-sdk': '../bower_components/stellar-sdk/stellar-sdk.min',
    knockout: '../bower_components/knockout/dist/knockout',
    requirejs: '../bower_components/requirejs/require',
    domReady: '../bower_components/domReady/domReady',
    qrcode: '../bower_components/qrcode-generator/js/qrcode'
  },
  shim: {
    'stellar-sdk': {
      exports: 'StellarSdk'
    }
  },
  packages: [

  ]
});
