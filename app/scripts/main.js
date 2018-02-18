require(['account'], function (Account) {
  document.getElementById('jsonPayload').value = 'testKey1\ntestValue1\ntestKey2\ntestValue2\ntestKey3\ntestValue3';

  var account = new Account();

  document.getElementById('createTransaction')
    .onclick = account.buildTransaction;
  document.getElementById('submitTransaction')
    .onclick = account.sendTransaction;
  document.getElementById('getAccountData')
    .onclick = account.getTransactionData;
});

require.config({
  paths: {
    'StellarSdk': 'vendor/stellar-sdk.min'
  },
  shim: {
    'StellarSdk': {
      exports: 'StellarSdk'
    }
  }
});
