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
      this.sequenceNumber = ko.observable("");
      this.accountData = ko.observable(null);
      this.transaction = ko.observable(null);
      this.payload = ko.observable("");
      this.accountTab = ko.observable("details");

      if (!util.isOnline)
        this.accountTab = ko.observable("transactions");

      this.connect = function () {
        server.loadAccount(this.publicKey())
          .then(function (account) {
            self.sequenceNumber(account.sequenceNumber());
            self.getAccountData();
          })
          .catch(function (e) {
            console.error(e);
          });
      }

      this.createTransaction = function () {
        var account = new StellarSdk.Account(this.publicKey(), this.sequenceNumber());

        this.transaction(new TransactionViewModel(account)
          .buildTransaction(this.payload()));
      }

      this.signTransaction = function () {
        console.log('Signing transaction using secret key...');
        var sourceKeypair = StellarSdk.Keypair.fromSecret(this.secretKey());

        this.transaction().sign(sourceKeypair);

        console.log('Signed Transaction XDR: ');
        console.log(this.transaction().toEnvelope().toXDR('base64'));
        console.log();

      }

      this.sendTransaction = function () {

        console.log('Sending transaction...')
        server.submitTransaction(this.transaction())
          .then(function (transactionResult) {
            console.log('\nSuccess! View the transaction at: ');
            console.log(transactionResult._links.transaction.href);
            console.log('See account details at: ')
            console.log('https://testnet.steexp.com/account/' + self.publicKey)
          })
          .catch(function (err) {
            console.log('An error has occured:');
            console.log(err);
          });
      }

      this.getAccountData = function () {
        server.loadAccount(this.publicKey())
          .then(function (account) {
            console.log('Account Loaded');

            var data = account.data_attr;

            Object.keys(data).forEach(function (key) {
              var encodedValue = data[key];
              var decodedValue = util.b64DecodeUnicode(encodedValue)

              data[key] = decodedValue;
            });

            var data = util.unflatten(data);

            self.accountData(JSON.stringify(data, null, '  '));
          });
      }
    }

    return AccountViewModel;
  });
