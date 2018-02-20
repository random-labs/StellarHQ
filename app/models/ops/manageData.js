define([
  'stellar-sdk',
  'util',
  'knockout'
], function (
  StellarSdk,
  util,
  ko
) {
  function ManageDataOperation() {
    this.payload = ko.observable();
    this.type = "manageData";
    this.description = "Manage Data";

    this.stellarOps = [];

    this.build = function () {
      if (util.isJson(this.payload())) {
        this.stellarOps = buildDataFromJson(this.payload());
      } else {
        this.stellarOps = buildData(this.payload());
      }
    }

    function buildData(payload) {
      var operations = [];
      var splitPayload = payload.split('\n');

      for (let i = 0; i < splitPayload.length; i += 2) {
        var key = splitPayload[i];
        var value = splitPayload[i + 1];

        operations.push(StellarSdk.Operation.manageData({
          name: key,
          value: value
        }));
      }

      return operations;
    }

    function buildDataFromJson(payload) {
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

  return ManageDataOperation
});
