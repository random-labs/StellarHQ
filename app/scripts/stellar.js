define(['stellar-sdk'], function (StellarSdk) {

  function connect(useLive) {
    var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

    if (useLive)
      StellarSdk.Network.usePublicNetwork();
    else
      StellarSdk.Network.useTestNetwork();

    return server;
  }

  return {
    connect: connect
  };
});
