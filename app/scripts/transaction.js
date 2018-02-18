define(['StellarSdk'], function (StellarSdk) {

  function Transaction(account) {
    var transactionBuilder = new StellarSdk.TransactionBuilder(account);

    this.buildTransaction = function () {
      var payload = document.getElementById('jsonPayload').value;

      var splitPayload = payload.split('\n');

      for (let i = 0; i < splitPayload.length; i += 2) {
        var key = splitPayload[i];
        var value = splitPayload[i + 1];

        transactionBuilder.addOperation(StellarSdk.Operation.manageData({
          name: key,
          value: value
        }));
      }

      return transactionBuilder.build();
    }
  }

  return Transaction;
});
