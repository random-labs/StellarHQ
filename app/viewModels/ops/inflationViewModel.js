define([
  'stellar-sdk',
  'util',
  'knockout'
], function (
  StellarSdk,
  util,
  ko
) {
  function InflationViewModel(buildOptions, opType) {
    var self = this;

    this.source = ko.observable().extend({
      validPubKey: ''
    });

    if (buildOptions.op == opType) {
      self.source(buildOptions.source);
    }

    this.build = function () {
      return [StellarSdk.Operation.inflation(this.source())];
    }

    self.isValid = ko.pureComputed(function () {
      return this.source() && this.source.isValid();
    }, this);
  }

  return InflationViewModel
});
