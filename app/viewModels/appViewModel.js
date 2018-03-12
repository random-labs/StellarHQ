define([
    'knockout',
    'viewModels/accountViewModel',
    'util',
    'services/urlParseService'
  ],
  function (
    ko,
    AccountViewModel,
    util,
    urlParseService
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

      this.account = new AccountViewModel(server, urlParseService.buildData());

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
