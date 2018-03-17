define([
  'stellar-sdk',
  'util',
  'knockout'
], function (
  StellarSdk,
  util,
  ko
) {
  function ManageDonationViewModel(buildOptions) {
    var self = this;
    self.donations = ko.observableArray([{
      destination: ko.observable().extend({
        validPubKey: ''
      }),
      percentage: ko.observable(0),
      isRemoved: ko.observable(false)
    }]);

    self.stellarOps = [];
    var prefix = 'lumenaut.net donation ';

    if (buildOptions.account && buildOptions.account.data) {
      var data = buildOptions.account.data;

      var validDonations = [];

      Object.keys(data).forEach(function (key) {
        var values = data[key].split('%');

        if (key.indexOf(prefix) != -1 && values.length == 2)
          validDonations.push({
            destination: ko.observable(values[1]).extend({
              validPubKey: ''
            }),
            percentage: ko.observable(values[0]),
            isRemoved: ko.observable(false),
            tag: key
          });
      });

      if (validDonations.length > 0)
        self.donations(validDonations);
    }

    self.total = ko.pureComputed(function () {
      var total = 0;
      self.donations().forEach(donation => {
        if (!donation.isRemoved())
          total += parseFloat(donation.percentage());
      });

      return Math.round(total * 100) / 100;
    }, this);

    self.isValid = ko.pureComputed(function () {
      for (let i = 0; i < self.donations().length; i++) {
        var donation = self.donations()[i];

        if (!donation.destination.isValid()) {
          return false;
        }
      }

      return true;
    }, this);

    self.newDonation = function () {
      self.donations.push({
        destination: ko.observable().extend({
          validPubKey: ''
        }),
        percentage: ko.observable(0),
        isRemoved: ko.observable(false)
      })
    }

    self.remove = function () {
      this.isRemoved(true);
    }

    self.valueChanged = function () {
      var total = self.total();

      var excludedTotal = 0;
      self.donations().forEach(d => {
        if (d == this || d.isRemoved())
          return;
        excludedTotal += parseFloat(d.percentage());
      });

      if (total > 100) {
        var remaining = total - 100;

        self.donations().forEach(d => {
          if (d == this)
            return;

          var currValue = parseFloat(d.percentage());

          if (!currValue)
            return;

          var newValue = currValue - remaining *
            (parseFloat(currValue) / excludedTotal);

          d.percentage(Math.round(newValue * 100) / 100);
        });
      }

      if (self.total() > 100) {
        var nonZero = self.donations().find(el => {
          el.percentage > 0;
        });

        nonZero.percentage(nonZero.percentage() - total - 100);
      }
    }

    self.build = function () {
      var operations = [];

      self.donations().forEach(function (donation) {

        if (!donation.tag) {
          var maxCurrentNum = 0;

          self.donations().forEach(donation => {
            if (donation.tag) {
              var parsed = +(donation.tag.replace(prefix, ''));

              if (parsed && parsed > maxCurrentNum)
                maxCurrentNum = parsed;
            }
          });

          donation.tag = prefix + (maxCurrentNum + 1);
        }

        console.log(donation.tag);

        operations.push(StellarSdk.Operation.manageData({
          name: donation.tag,
          value: donation.isRemoved() ?
            null : `${donation.percentage()}%${donation.destination()}`
        }));
      });

      return operations;
    }
  }

  return ManageDonationViewModel
});
