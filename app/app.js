require([
  'knockout',
  'viewModels/appViewModel',
  'domReady',
  'util'
], function (
  ko,
  appViewModel,
  domReady,
  util
) {
  domReady(function () {

    ko.applyBindings(new appViewModel());
  });
});
