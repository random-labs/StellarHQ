define([
  'knockout',
  'viewModels/ops/paymentViewModel',
  'viewModels/ops/manageDataViewModel',
  'viewModels/ops/donationViewModel'
], function (
  ko,
  PaymentViewModel,
  ManageDataViewModel,
  ManageDonationViewModel
) {
  function OperationViewModel(buildOptions) {
    var self = this;

    this.currentOperation = ko.observable();
    this.operationTypes = ko.observableArray([{
        type: 'payment',
        description: "Payment",
        build: function (opType) {
          return new PaymentViewModel(buildOptions, opType)
        }
      },
      {
        type: 'data',
        description: "Manage Data",
        build: function (opType) {
          return new ManageDataViewModel(buildOptions)
        }
      },
      {
        type: 'donation',
        description: "Lumenaut Inflation Donation",
        build: function (opType) {
          return new ManageDonationViewModel(buildOptions, opType)
        }
      }
    ]);

    this.selectedOperation = ko.observable();
    this.selectedOperation.subscribe(selectedType => {
      var op = this.operationTypes().find(op => {
        return op.type == selectedType;
      });

      if (op)
        self.currentOperation(op.build(selectedType));
    });

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
      return this.currentOperation().build();
    }
  }

  return OperationViewModel
});
