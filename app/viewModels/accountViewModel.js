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
        if (!util.isOnline())
          return Promise.resolve();

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
        this.connect()
          .then(function (account) {
            self.transaction(new TransactionViewModel(self.publicKey(),
              account ? account.sequenceNumber() : null, server));
          });
      }

      this.importTransaction = function (data, e) {
        var file = e.target.files[0];

        if (!file)
          return;

        util.uploadFile(file)
          .then(function (result) {
            var parsedTran = JSON.parse(result);
            self.publicKey(parsedTran.pK);

            var newTransaction = new TransactionViewModel(self.publicKey(), null, server);
            newTransaction.loadTransaction(parsedTran);

            self.transaction(newTransaction);
          });
      };

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
