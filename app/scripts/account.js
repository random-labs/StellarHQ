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

    function Account(publicKey) {
      var transaction;

      if (navigator.onLine) {
        var server = stellar.connect();

        server.loadAccount(publicKey)
          .then(function (account) {
            document.getElementById('sequenceNumber')
              .value = account.sequenceNumber();
          })
          .catch(function (e) {
            console.error(e);
          });
      }

      this.buildTransaction = function () {
        var nextSequenceNumber = document.getElementById('sequenceNumber').value;

        var account = new StellarSdk.Account(publicKey, nextSequenceNumber);

        transaction = new Transaction(account)
          .buildTransaction();
      }

      this.signTransaction = function () {
        console.log('Signing transaction using secret key...');

        var sourceSecretKey = document.getElementById('secretKey').value
        var sourceKeypair = StellarSdk.Keypair.fromSecret(sourceSecretKey);

        transaction.sign(sourceKeypair);

        console.log('Signed Transaction XDR: ');
        console.log(transaction.toEnvelope().toXDR('base64'));
        console.log();

      }

      this.sendTransaction = function () {

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

            var data = util.unflatten(data);

            document.getElementById('result').value = JSON.stringify(data, null, '  ');
          });
      }
    }

    return Account
  });
