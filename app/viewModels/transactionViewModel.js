define([
  'stellar-sdk',
  'util',
  'knockout',
  'viewModels/operationViewModel'
], function (
  StellarSdk,
  util,
  ko,
  OperationViewModel) {

  function TransactionViewModel(publicKey, sequenceNumber, server) {
    var self = this;

    var transactionBuilder;
    var server = server;

    this.isOnline = util.isOnline();
    this.publicKey = publicKey;
    this.secretKey = ko.observable();
    this.sequenceNumber = ko.observable(sequenceNumber);
    this.currentOperation = ko.observable();
    this.currentOperations = ko.observableArray([]);
    this.numStellarOps = ko.observable(0);
    this.transaction = ko.observable();
    this.isSigned = ko.observable(false);
    this.status = ko.observable();
    this.xdr = ko.observable();
    this.qrCode = ko.observable();
    this.isImported = ko.observable(false);
    this.tranUrl = ko.observable();

    this.numStellarOps = ko.pureComputed(function () {
      var count = 0;
      this.currentOperations().forEach(e => {
        count += e.stellarOps.length;
      });
      return count;
    }, this);

    this.newOperation = function () {
      var newOp = new OperationViewModel();
      this.currentOperation(newOp);

      newOp.promise
        .then(function () {
          var newOperation = self.currentOperation().build();

          self.currentOperations.push(newOperation);
          self.currentOperation(null);
        })
        .catch(function (error) {
          if (error) {
            console.error(error);
            self.status("Error creating Operation: " + error.message)
          }

          self.currentOperation(null);
        });
    }

    this.buildTransaction = function () {
      var account = new StellarSdk.Account(this.publicKey, this.sequenceNumber());
      transactionBuilder = new StellarSdk.TransactionBuilder(account);

      console.log('Building Transaction...');
      this.currentOperations().forEach(op => {
        op.stellarOps.forEach(sop => {
          transactionBuilder.addOperation(sop);
        });
      });

      this.transaction(transactionBuilder.build());

      this.xdr(this.transaction().toEnvelope().toXDR('base64'));
      this.isSigned(false);

      console.log('Done!');
      console.log('Transaction XDR: ');
      console.log(this.xdr());
      console.log();
    }

    this.loadTransaction = function (existingTransaction) {
      this.isSigned(existingTransaction.iS);
      this.xdr(existingTransaction.xdr);
      this.transaction(new StellarSdk.Transaction(existingTransaction.xdr));
      this.isImported(true);
    }

    this.signTransaction = function () {
      console.log('Signing Transaction...');
      var sourceKeypair = StellarSdk.Keypair.fromSecret(this.secretKey());

      this.transaction().sign(sourceKeypair);

      this.isSigned(true);
      this.xdr(this.transaction().toEnvelope().toXDR('base64'));

      if (self.qrCode()) {
        self.createQr();
      }

      console.log('Done!');
      console.log('Signed Transaction XDR: ');
      console.log(this.xdr());
      console.log();
    }

    this.sendTransaction = function () {

      console.log('Submitting transaction...');
      self.status('Submitting transaction...');

      server.submitTransaction(this.transaction())
        .then(function (transactionResult) {
          console.log('\nSuccess! View the transaction at: ');
          console.log(transactionResult._links.transaction.href);
          self.status("Transaction Submitted!");
          self.tranUrl(transactionResult._links.transaction.href);
        })
        .catch(function (err) {
          console.log('An error has occured:');
          console.log(err);
        });
    }

    this.exportTransaction = function () {
      var publicKeyShort = this.publicKey.substring(0, 5) + '-' + this.publicKey.slice(-5);
      var date = new Date();
      var dateTag = date.getFullYear() + ("0" + (date.getMonth() + 1)).slice(-2) +
        ("0" + date.getDate()).slice(-2) + ("0" + date.getHours() + 1).slice(-2) +
        ("0" + date.getMinutes()).slice(-2) + ("0" + date.getSeconds()).slice(-2);

      var transaction = {
        pK: this.publicKey,
        iS: this.isSigned(),
        xdr: this.xdr()
      };

      var signedSuffix = this.isSigned() ? '_SIGNED' : '_UNSIGNED';

      util.downloadFile(JSON.stringify(transaction), publicKeyShort +
        '_' + dateTag + signedSuffix + '.stellarhq', 'text/plain');
    }

    this.createQr = function () {
      var transaction = {
        pK: this.publicKey,
        iS: this.isSigned(),
        xdr: this.xdr()
      };

      self.qrCode(util.generateQRCode(JSON.stringify(transaction)));
    }
  }

  return TransactionViewModel;
});
