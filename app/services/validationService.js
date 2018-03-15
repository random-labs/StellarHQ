define([
  'stellar-sdk',
  'knockout'
], function (
  StellarSdk,
  ko
) {
  ko.extenders.validPubKey = function (target) {
    target.isValid = ko.observable(true);
    target.showError = ko.observable(false);
    target.errorMessage = ko.observable();

    function validate(newValue) {
      target.errorMessage('');

      if (target.isDirty == undefined)
        target.isDirty = ko.observable(false);
      else if (target.isDirty() == false)
        target.isDirty = ko.observable(true);

      if (!newValue) {
        target.isValid(false);
        target.errorMessage('Value is required');
      } else {
        target.isValid(StellarSdk.StrKey.isValidEd25519PublicKey(newValue));

        if (!target.isValid()) {
          target.errorMessage('Not a valid Public Key');
        }
      }

      target.showError(target.isDirty() && !target.isValid());
    }

    validate(target());

    target.subscribe(validate);

    return target;
  };
});
