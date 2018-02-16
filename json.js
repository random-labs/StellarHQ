var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
StellarSdk.Network.useTestNetwork();

var transaction;
var publicKey;

function buildTransaction() {
  publicKey = document.getElementById('publicKey').value;
  var jsonPayload = document.getElementById('jsonPayload').value;

  server.loadAccount(publicKey)
    .then(function (account) {
      var transactionBuilder = new StellarSdk.TransactionBuilder(account);

      var flatJson = JSON.flatten(JSON.parse(jsonPayload));

      Object.keys(flatJson).forEach(function (key) {
        transactionBuilder.addOperation(StellarSdk.Operation.manageData({
          name: key,
          value: flatJson[key]
        }));
      })

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

      var unflattenedJson = JSON.unflatten(data);

      document.getElementById('jsonResult').value = JSON.stringify(unflattenedJson, null, '  ');
    });
}

JSON.flatten = function (data) {
  var result = {};

  function recurse(cur, prop) {
    if (Object(cur) !== cur) {
      result[prop] = cur;
    } else if (Array.isArray(cur)) {
      for (var i = 0, l = cur.length; i < l; i++)
        recurse(cur[i], prop + "[" + i + "]");
      if (l == 0) result[prop] = [];
    } else {
      var isEmpty = true;
      for (var p in cur) {
        isEmpty = false;
        recurse(cur[p], prop ? prop + "." + p : p);
      }
      if (isEmpty && prop) result[prop] = {};
    }
  }
  recurse(data, "");
  return result;
};

JSON.unflatten = function (data) {
  "use strict";
  if (Object(data) !== data || Array.isArray(data)) return data;
  var regex = /\.?([^.\[\]]+)|\[(\d+)\]/g,
    resultholder = {};
  for (var p in data) {
    var cur = resultholder,
      prop = "",
      m;
    while (m = regex.exec(p)) {
      cur = cur[prop] || (cur[prop] = (m[2] ? [] : {}));
      prop = m[2] || m[1];
    }
    cur[prop] = data[p];
  }
  return resultholder[""] || resultholder;
};

function b64DecodeUnicode(str) {
  // Going backwards: from bytestream, to percent-encoding, to original string.
  return decodeURIComponent(atob(str).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}

document.addEventListener('DOMContentLoaded', function () {
  var testJson = JSON.stringify({
    "test": "test1",
    "test2": [{
      "test3": "test3",
      "test4": "test4",
      "test4": "test4"
    }]
  }, null, '  ');

  document.getElementById('jsonPayload').value = testJson;
}, false);