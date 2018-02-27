define([
  'knockout',
  'viewModels/ops/paymentViewModel',
  'viewModels/ops/manageDataViewModel'
], function (
  ko,
  PaymentViewModel,
  ManageDataViewModel
) {
  function OperationViewModel() {
    this.operationTypes = ko.observableArray([
      new PaymentViewModel(),
      new ManageDataViewModel()
    ]);

    this.selectedOperation = ko.observable();

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
