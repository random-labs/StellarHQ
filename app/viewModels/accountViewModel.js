define([
    'stellar-sdk',
    'util',
    'knockout',
    'viewModels/transactionViewModel',
    'viewModels/qrScanViewModel',
    'services/urlParseService'
  ],
  function (
    StellarSdk,
    util,
    ko,
    TransactionViewModel,
    QrScanViewModel,
    urlParseService) {

    function AccountViewModel(server, buildOptions) {
      var self = this;
      var server = server;

      this.publicKey = ko.observable("");
      this.secretKey = ko.observable("")
      this.buildOptions = buildOptions ? buildOptions : {};

      this.account = ko.observable();
      this.accountData = ko.observable();
      this.transaction = ko.observable(null);
      this.accountTab = ko.observable("details");
      this.showScanQr = ko.observable(false);
      this.showNewAccount = ko.observable(false);
      this.qrScanner = ko.observable();
      this.qrCode = ko.observable();

      if (!util.isOnline())
        this.accountTab("transactions");

      this.connect = function () {
        if (!util.isOnline() || !this.publicKey())
          return Promise.resolve();

        return server.loadAccount(this.publicKey())
          .then(function (account) {
            console.log('Account Loaded');

            self.account(account);
            self.getAccountData(account);

            self.buildOptions.account = {
              data: JSON.parse(self.accountData())
            };

            if (self.transaction())
              self.transaction().refreshSequenceNumber(account.sequenceNumber());

            return account;
          })
          .catch(function (e) {
            console.error('Error Loading Account: ' + e.toString());
          });
      }

      this.newTransaction = function () {
        return this.connect()
          .then(function (account) {
            var newTransaction = new TransactionViewModel(self.publicKey,
              account ? account.sequenceNumber() : null, server, self.buildOptions);

            self.transaction(newTransaction);
            //clear url since transaction to handle it created
            urlParseService.reset();

            return newTransaction;
          });
      }

      this.importTransaction = function (data, e) {
        var file = e.target.files[0];

        if (!file)
          return;

        util.uploadFile(file)
          .then(function (result) {
            self.loadFromJson(result);
          });
      };

      this.createQr = function () {
        self.qrCode(util.generateQRCode(self.publicKey()));
      }

      this.scanTransactionQr = function () {
        self.scanQr().then(function (result) {
          self.showScanQr(false);
          self.loadFromJson(result);
        })
      }

      this.scanPublicKeyQr = function () {
        self.scanQr().then(function (result) {
          self.showScanQr(false);
          self.publicKey(result);
        })
      }

      this.scanQr = function () {
        if (!this.qrScanner())
          this.qrScanner(new QrScanViewModel());

        self.showScanQr(true);

        this.qrPromise = this.qrScanner().scan();

        return this.qrPromise.promise;
      }

      this.cancelQrScan = function () {
        this.qrPromise.cancel();
        self.showScanQr(false);
      }

      this.newAccount = function () {
        var pair = StellarSdk.Keypair.random();
        self.publicKey(pair.publicKey());
        self.secretKey(pair.secret());

        self.showNewAccount(true);
      }

      this.cancelNewAccount = function () {
        self.showNewAccount(false);
      }

      this.getAccountData = function (account) {
        var data = account.data_attr;

        Object.keys(data).forEach(function (key) {
          var encodedValue = data[key];
          var decodedValue = util.b64DecodeUnicode(encodedValue)

          data[key] = decodedValue;
        });

        self.accountData(JSON.stringify(data, null, '  '));
      }

      this.loadFromJson = function (data) {
        var parsedTran = JSON.parse(data);
        self.publicKey(parsedTran.pK);

        self.newTransaction()
          .then((newTransaction) => {
            newTransaction.loadTransaction(parsedTran);
          });
      }

      if (buildOptions) {
        this.accountTab("transactions");
        self.newTransaction();
      }
    }

    return AccountViewModel;
  });
