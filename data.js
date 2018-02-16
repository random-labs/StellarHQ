var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
StellarSdk.Network.useTestNetwork();

var transaction;
var publicKey;

function buildTransaction() {
  publicKey = document.getElementById('publicKey').value;
  var payload = document.getElementById('jsonPayload').value;

  server.loadAccount(publicKey)
    .then(function (account) {
      var transactionBuilder = new StellarSdk.TransactionBuilder(account);

      var splitPayload = payload.split('\n');

      for (let i = 0; i < splitPayload.length; i += 2) {
        var key = splitPayload[i];
        var value = splitPayload[i + 1];

        transactionBuilder.addOperation(StellarSdk.Operation.manageData({
          name: key,
          value: value
        }));
      }

      transaction = transactionBuilder.build();

      console.log('Transaction XDR: ');
      console.log(transaction.toEnvelope().toXDR('base64'));
      console.log();
    })
    .catch(function (e) {
      console.error(e);
    });
}

function sendTransaction() {
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

function getTransactionData() {
  var publicKey = document.getElementById('publicKey').value;

  server.loadAccount(publicKey)
    .then(function (account) {
      console.log('Account Loaded');

      var data = account.data_attr;

      Object.keys(data).forEach(function (key) {
        var encodedValue = data[key];
        var decodedValue = b64DecodeUnicode(encodedValue)

        data[key] = decodedValue;
      });

      document.getElementById('jsonResult').value = JSON.stringify(data, null, '  ');
    });
}

function b64DecodeUnicode(str) {
  // Going backwards: from bytestream, to percent-encoding, to original string.
  return decodeURIComponent(atob(str).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('jsonPayload').value = 'testKey1\ntestValue1\ntestKey2\ntestValue2\ntestKey3\ntestValue3';
}, false);