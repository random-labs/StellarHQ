define([
  'knockout',
  'viewModels/ops/paymentViewModel',
  'viewModels/ops/manageDataViewModel'
], function (
  ko,
  PaymentViewModel,
  ManageDataViewModel
) {
  function OperationViewModel(buildOptions) {
    this.operationTypes = ko.observableArray([
      new PaymentViewModel(buildOptions),
      new ManageDataViewModel(buildOptions)
    ]);

    this.selectedOperation = ko.observable();

    if (buildOptions.op)
      this.selectedOperation(buildOptions.op);

    this.promise = new Promise(function (save, cancel) {
      self.save = save;
      self.cancel = cancel;
    });

    this.saveOperation = function () {
      self.save();
    }

    this.cancelOperation = function () {
      self.cancel();
    }


    this.build = function () {
      var selectedOp = this.selectedOperation();
      selectedOp.build();

      return selectedOp;
    }
  }

  return OperationViewModel
});
