define([
  'stellar-sdk',
  'util',
  'knockout'
], function (
  StellarSdk,
  util,
  ko
) {
  function ManageDataViewModel() {
    var self = this;

    this.json = ko.observable();
    this.isJson = ko.observable(false);
    this.keyValuePairs = ko.observableArray([{
      key: null,
      value: null
    }]);

    this.type = "manageData";
    this.description = "Manage Data";

    this.stellarOps = [];

    this.build = function () {
      if (this.isJson()) {
        this.stellarOps = this.buildDataFromJson(this.json());
      } else {
        this.stellarOps = this.buildData(this.keyValuePairs());
      }
    }

    this.valueChanged = function () {
      var isValid = true;

      self.keyValuePairs().forEach(function (pair) {
        if (!pair.key) {
          isValid = false
          return;
        }
      });

      if (isValid)
        self.keyValuePairs.push({
          key: null,
          value: null
        });
    }

    this.toggleJson = function () {
      this.isJson(!this.isJson());
    }

    this.buildData = function (keyValuePairs) {
      var operations = [];

      keyValuePairs.forEach(function (pair) {
        if (pair.key) {
          operations.push(StellarSdk.Operation.manageData({
            name: pair.key,
            value: pair.value
          }));
        }
      });

      return operations;
    }

    this.buildDataFromJson = function (payload) {
      var operations = [];
      var flatJson = util.flatten(JSON.parse(payload));

      Object.keys(flatJson).forEach(function (key) {
        operations.push(StellarSdk.Operation.manageData({
          name: key,
          value: flatJson[key]
        }));
      });

      return operations;
    }
  }

  return ManageDataViewModel
});
