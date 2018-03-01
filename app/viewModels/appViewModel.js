define([
    'knockout',
    'viewModels/accountViewModel',
    'util'
  ],
  function (
    ko,
    AccountViewModel,
    util
  ) {
    return function appViewModel() {
      var self = this;
      this.status = ko.observable();

      this.isOnline = util.isOnline();
      var server;

      StellarSdk.Network.useTestNetwork();

      if (this.isOnline)
        server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

      this.setStatus = function (message, isError) {
        this.status({
          message: message,
          isError: isError
        });
      }

      this.getBuildOptions = function () {
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

        window.history.replaceState({}, document.title, "/StellarHQ/");

        return objURL;
      }

      this.account = new AccountViewModel(server, this.getBuildOptions());

      window.console = (function (wCon) {
        return {
          log: function (text) {
            wCon.log(text);
            self.setStatus(text);
          },
          info: function (text) {
            wCon.info(text);
          },
          warn: function (text) {
            wCon.warn(text);
          },
          error: function (error) {
            wCon.error(error);
            self.setStatus(error.toString(), true);
          }
        };
      }(window.console));
    };
  });
