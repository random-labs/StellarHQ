require(['account'], function (Account) {
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
