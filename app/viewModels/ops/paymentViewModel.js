define([
  'stellar-sdk',
  'util',
  'knockout'
], function (
  StellarSdk,
  util,
  ko
) {
  function PaymentViewModel(buildOptions, opType) {
    this.payload = ko.observable({
      destination: null,
      asset: StellarSdk.Asset.native(),
      amount: null
    });

    if (buildOptions.op == opType) {
      var payload = this.payload();
      payload.destination = buildOptions.destination;
      payload.amount = buildOptions.amount;
    }

    this.build = function () {
      return [StellarSdk.Operation.payment(this.payload())];
    }
  }

  return PaymentViewModel
});
