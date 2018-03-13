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

  function TransactionViewModel(publicKey, sequenceNumber, server, buildOptions) {
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

    this.canBuildTransaction = ko.pureComputed(function () {
      return (self.currentOperations().length > 0 &&
          self.publicKey() && self.sequenceNumber()) ||
        self.isImported();
    }, this);

    this.xdrUrl = ko.pureComputed(function () {
      var isTestNet = true;
      var url = "https://www.stellar.org/laboratory/#xdr-viewer?input=" +
        encodeURIComponent(this.xdr()) + "&type=TransactionEnvelope"

      url += isTestNet ? "&network=test" : "&network=public";

      return url;
    }, this);

    this.newOperation = function () {
      var newOp = new OperationViewModel(buildOptions);
      this.currentOperation(newOp);

      newOp.promise
        .then(function () {
          var newOperation = self.currentOperation().build();

          self.currentOperations.push(newOperation);

          console.log(self.currentOperation()
            .selectedOperation().description +
            ' Operation Added!');

          self.currentOperation(null);
        })
        .catch(function (error) {
          if (error !== undefined) {
            console.error('Error Creating ' + self.currentOperation()
              .selectedOperation().description +
              ' Operation: ' + error.toString(), true);
          }

          self.currentOperation(null);
        });
    }

    this.refreshSequenceNumber = function (newSeqNumber) {
      this.sequenceNumber(newSeqNumber);
    }

    this.buildTransaction = function () {
      var account = new StellarSdk.Account(this.publicKey(), this.sequenceNumber());
      transactionBuilder = new StellarSdk.TransactionBuilder(account);

      console.log('Building Transaction...');

      this.currentOperations().forEach(op => {
        op.stellarOps.forEach(sop => {
          transactionBuilder.addOperation(sop);
        });
      });

      try {
        this.transaction(transactionBuilder.build());

        this.xdr(this.transaction().toEnvelope().toXDR('base64'));
        this.isSigned(false);

        console.log('Transaction Built!');
      } catch (error) {
        console.error('Error building Transaction: ' + error.toString());
      }
    }

    this.loadTransaction = function (existingTransaction) {
      this.isSigned(existingTransaction.iS);
      this.xdr(existingTransaction.xdr);
      this.transaction(new StellarSdk.Transaction(existingTransaction.xdr));
      this.isImported(true);
    }

    this.signTransaction = function () {
      console.log('Signing Transaction...');

      try {
        var sourceKeypair = StellarSdk.Keypair.fromSecret(this.secretKey());

        this.transaction().sign(sourceKeypair);

        this.isSigned(true);
        this.xdr(this.transaction().toEnvelope().toXDR('base64'));

        if (self.qrCode()) {
          self.createQr();
        }

        console.log('Transaction Signed!');
      } catch (error) {
        console.error('Error Signing Transaction: ' + error.toString());
      }
    }

    this.sendTransaction = function () {

      console.log('Submitting transaction...');

      server.submitTransaction(this.transaction())
        .then(function (transactionResult) {
          console.log("Transaction Submitted!");
          self.tranUrl('https://testnet.steexp.com/tx/' + transactionResult.hash);
        })
        .catch(function (err) {
          var error = err.data.extras.result_codes.transaction;
          console.error('Error Submitting Transaction: ' + error);
        });
    }

    this.exportTransaction = function () {
      var publicKeyShort = this.publicKey().substring(0, 5) + '-' + this.publicKey().slice(-5);
      var date = new Date();
      var dateTag = date.getFullYear() + ("0" + (date.getMonth() + 1)).slice(-2) +
        ("0" + date.getDate()).slice(-2) + ("0" + date.getHours() + 1).slice(-2) +
        ("0" + date.getMinutes()).slice(-2) + ("0" + date.getSeconds()).slice(-2);

      var transaction = {
        pK: this.publicKey(),
        iS: this.isSigned(),
        xdr: this.xdr()
      };

      var signedSuffix = this.isSigned() ? '_SIGNED' : '_UNSIGNED';

      util.downloadFile(JSON.stringify(transaction), publicKeyShort +
        '_' + dateTag + signedSuffix + '.stellarhq', 'text/plain');
    }

    this.createQr = function () {
      var transaction = {
        pK: this.publicKey(),
        iS: this.isSigned(),
        xdr: this.xdr()
      };

      self.qrCode(util.generateQRCode(JSON.stringify(transaction)));
    }

    if (buildOptions)
      self.newOperation();
  }

  return TransactionViewModel;
});
