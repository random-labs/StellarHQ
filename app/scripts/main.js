require(['account'], function (Account) {

  if (!navigator.onLine) {
    [...document.getElementsByClassName("online")].forEach(
      (element, index, array) => {
        element.style.display = "none";
      }
    );

    document.getElementById('createTransaction')
      .onclick = function () {
        var publicKey = document.getElementById('publicKey').value;

        var account = new Account(publicKey);

        document.getElementById('submitTransaction')
          .onclick = account.sendTransaction;
        document.getElementById('getAccountData')
          .onclick = account.getTransactionData;

        account.buildTransaction();
      };
  }

  document.getElementById('connectAccount')
    .onclick = function () {
      var publicKey = document.getElementById('publicKey').value;

      var account = new Account(publicKey);

      document.getElementById('createTransaction')
        .onclick = account.buildTransaction;
      document.getElementById('signTransaction')
        .onclick = account.signTransaction;
      document.getElementById('submitTransaction')
        .onclick = account.sendTransaction;
      document.getElementById('getAccountData')
        .onclick = account.getTransactionData;
    };
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
