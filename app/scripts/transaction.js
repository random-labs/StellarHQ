define(['stellar-sdk', 'util'], function (StellarSdk, util) {

  function Transaction(account) {
    var transactionBuilder = new StellarSdk.TransactionBuilder(account);

    this.buildTransaction = function () {
      var payload = document.getElementById('payload').value;

      if (util.isJson(payload)) {
        buildDataFromJson(payload);
      } else {
        buildData(payload);
      }

      var transaction = transactionBuilder.build();

      console.log('Transaction XDR: ');
      console.log(transaction.toEnvelope().toXDR('base64'));
      console.log();

      return transaction;
    }

    function buildData(payload) {
      var splitPayload = payload.split('\n');

      for (let i = 0; i < splitPayload.length; i += 2) {
        var key = splitPayload[i];
        var value = splitPayload[i + 1];

        transactionBuilder.addOperation(StellarSdk.Operation.manageData({
          name: key,
          value: value
        }));
      }
    }

    function buildDataFromJson(payload) {
      var flatJson = util.flatten(JSON.parse(payload));

      Object.keys(flatJson).forEach(function (key) {
        transactionBuilder.addOperation(StellarSdk.Operation.manageData({
          name: key,
          value: flatJson[key]
        }));
      })
    }
  }

  return Transaction;
});
