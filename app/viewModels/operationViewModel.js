define([
  'knockout',
  'models/ops/manageData'
], function (ko,
  ManageDataOperation) {
  function OperationViewModel() {
    this.operationTypes = ko.observableArray([
      new ManageDataOperation()
    ]);

    this.selectedOperation = ko.observable();

    this.getOp = function () {
      return this.selectedOperation();
    }
  }

  return OperationViewModel
});
