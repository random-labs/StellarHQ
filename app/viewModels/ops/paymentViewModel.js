define([
  'stellar-sdk',
  'util',
  'knockout'
], function (
  StellarSdk,
  util,
  ko
) {
  function PaymentViewModel(buildOptions) {
    this.payload = ko.observable({
      destination: null,
      asset: StellarSdk.Asset.native(),
      amount: null
    });

    this.type = "payment";
    this.description = "Payment";
    this.stellarOps = [];

    if (buildOptions.op == this.type) {
      var payload = this.payload();
      payload.destination = buildOptions.destination;
      payload.amount = buildOptions.amount;
    }

    this.build = function () {
      var paymentOp = StellarSdk.Operation.payment(this.payload());
      this.stellarOps.push(paymentOp);
    }
  }

  return PaymentViewModel
});
