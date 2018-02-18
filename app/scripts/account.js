define([
    'StellarSdk',
    'stellar',
    'util',
    'transaction'
  ],
  function (
    StellarSdk,
    stellar,
    util,
    Transaction) {

    function Account() {

      var server = stellar.connect();
      var transaction;

      this.buildTransaction = function () {
        publicKey = document.getElementById('publicKey').value;

        server.loadAccount(publicKey)
          .then(function (account) {

            transaction = new Transaction(account)
              .buildTransaction();

            console.log('Transaction XDR: ');
            console.log(transaction.toEnvelope().toXDR('base64'));
            console.log();
          })
          .catch(function (e) {
            console.error(e);
          });
      }

      this.sendTransaction = function () {
        console.log('Signing transaction using secret key...');

        var sourceSecretKey = document.getElementById('secretKey').value
        var sourceKeypair = StellarSdk.Keypair.fromSecret(sourceSecretKey);

        transaction.sign(sourceKeypair);

        console.log('Sending transaction...')
        server.submitTransaction(transaction)
          .then(function (transactionResult) {
            console.log('\nSuccess! View the transaction at: ');
            console.log(transactionResult._links.transaction.href);
            console.log('See account details at: ')
            console.log('https://testnet.steexp.com/account/' + publicKey)
          })
          .catch(function (err) {
            console.log('An error has occured:');
            console.log(err);
          });
      }

      this.getTransactionData = function () {
        var publicKey = document.getElementById('publicKey').value;

        server.loadAccount(publicKey)
          .then(function (account) {
            console.log('Account Loaded');

            var data = account.data_attr;

            Object.keys(data).forEach(function (key) {
              var encodedValue = data[key];
              var decodedValue = util.b64DecodeUnicode(encodedValue)

              data[key] = decodedValue;
            });

            document.getElementById('jsonResult').value = JSON.stringify(data, null, '  ');
          });
      }
    }

    return Account
  });
