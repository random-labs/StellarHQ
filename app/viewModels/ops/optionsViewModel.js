define([
  'stellar-sdk',
  'util',
  'knockout'
], function (
  StellarSdk,
  util,
  ko
) {
  function OptionsViewModel(buildOptions, opType) {
    var self = this;

    this.inflationDest = ko.observable().extend({
      validPubKey: ''
    });

    if (buildOptions.op == opType) {
      self.inflationDest(buildOptions.inflationDest);
    }

    this.build = function () {
      return [StellarSdk.Operation.setOptions({
        inflationDest: self.inflationDest()
      })];
    }

    self.isValid = ko.pureComputed(function () {
      return self.inflationDest.isValid();
    }, this);
  }

  return OptionsViewModel
});
