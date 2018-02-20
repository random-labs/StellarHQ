define([
    'stellar-sdk',
    'util',
    'knockout',
    'viewModels/transactionViewModel'
  ],
  function (
    StellarSdk,
    util,
    ko,
    TransactionViewModel) {

    function AccountViewModel(server) {
      var self = this;
      var server = server;

      this.publicKey = ko.observable("");
      this.secretKey = ko.observable("")

      this.account = ko.observable(null);
      this.accountData = ko.observable(null);
      this.transaction = ko.observable(null);
      this.accountTab = ko.observable("details");

      if (!util.isOnline())
        this.accountTab = ko.observable("transactions");

      this.connect = function () {
        return server.loadAccount(this.publicKey())
          .then(function (account) {
            console.log('Account Loaded');

            account.incrementSequenceNumber();
            self.account(account);
            self.getAccountData(account);

            return account;
          })
          .catch(function (e) {
            console.error(e);
          });
      }

      this.newTransaction = function () {
        var promise = util.isOnline() ? this.connect() : Promise.resolve();

        promise.then(function (account) {
          self.transaction(new TransactionViewModel(self.publicKey(),
            account ? account.sequenceNumber() : null, server))
        });
      }

      this.getAccountData = function (account) {
        var data = account.data_attr;

        Object.keys(data).forEach(function (key) {
          var encodedValue = data[key];
          var decodedValue = util.b64DecodeUnicode(encodedValue)

          data[key] = decodedValue;
        });

        var data = util.unflatten(data);

        self.accountData(JSON.stringify(data, null, '  '));
      }
    }

    return AccountViewModel;
  });
