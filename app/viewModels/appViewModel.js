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
      this.isOnline = util.isOnline();
      var server;

      StellarSdk.Network.useTestNetwork();

      if (this.isOnline)
        server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

      this.account = new AccountViewModel(server);
    };
  });
