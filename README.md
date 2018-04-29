# StellarHQ

>StellarHQ is not affiliated with, endorsed by, or sponsored by https://www.stellar.org/ or any of their affiliates or subsidiaries.
  
>Currently under active development. Unexpected features are to be expected.
  
Use [Stellar Lab](https://www.stellar.org/laboratory/#account-creator?network=test) to create test accounts
  
Account Manager and Transaction Builder for Stellar. 
Built for community, by community. Free like beer.

Available on: https://stellarhq.space  
  
The app can also be used in offline mode without access to the Internet. THere are two ways to setup offline mode:
  
1. If you have a device with a [browser that supports servce workers](https://caniuse.com/#feat=serviceworkers) the app will be cached and work when your device is offline. Once you reconnect any app updated will be downloaded. You can use this to setup your offline device by visiting https://stellarhq.space to cache the app. 
  
2. Clone or download the [repo zip](https://github.com/Lumenaut-Network/StellarHQ/archive/master.zip) and move the files to your offline device. Start the app by double clicking on `index.html`. This will open the app in devices default browser.

>This software provided under Apache 2.0 License without any warranty. By using this software you agree to these licensing terms.
  
## Features ##

* Securely and easily build transactions offline without exposing your key.  
* Scan the Transaction QR with your mobile device and easily submit the transaction.  
* Export the transaction file to submit the transaction later or send to other devices.  
* Supports multisig. Pass along the transaction via the QR code or exported file for others to sign.  
  
# Development
After clone run:  
```
npm install --global gulp
npm install -g bower 
npm install
bower install  
gulp init
gulp dev
```
  
`gulp init` will copy git hooks to `.git` dir. The pre-commit hook is used to automatically bundle the js files and update the service worker. The service worker is used for caching.
  
`gulp dev` will start the file watch and the local websever that will run the app on `http://localhost:5000/`. The file watch will automatically rerun the build while local webserver will automatically reload any file changes. 
  
# Getting Started

##  Offline Mode ##
**How to create and sign the transactions offline, send online**

1. Copy and paste your public key into the **Public Key** field. Alternatively you can scan a QR code that contains your Public Key by clicking on **Scan QR**
2. Click on **New Transaction**
3. Click on **New Operation**
4. Select desired Transaction Operation and fill in the necessary information
5. Click **Save Operation**
6. Add any additional Operations - up to 100 max per transaction
7. Before you can build the transaction you will have to provide the Transaction Sequence Number for your account. This can be obtained in two ways:
    1. Use the online app via your mobile or another device:
        1. Copy and paste your public key into the **Public Key** field. Alternatively you can scan a QR code that contains your Public Key by clicking on **Scan QR**. Clicking on **Create QR** will create a code of the entered Public Key. This can be useful for obtaining the Transaction Sequence Number when generating transactions on another device in Offline Mode.
        2. Click on **Create Transaction** tab
        3. Click on **New Transaction**  
    2. Use [Stellar Lab](https://www.stellar.org/laboratory/#txbuilder) to get the next sequence number. Note that Stellar Lab shows an incremented number therefore you have to subtract 1 before entering it into StellarHQ.
8. Enter the new Transaction Sequence Number,
9. Click on **Build Transaction**  
  This will build the Transaction XDR and prepare for signing. 
10. Copy and paste your Secret Key into the **Secret Key** field. This will eventually support Ledger Nano.
11. Click on **Sign Transaction**. The transaction will now be signed as indicated by the green "SIGNED" status. 
12. The transaction can be submitted in a few different ways:
    1. Use Mobile Device:
        1. On your offline device where the transaction was created click on **Create Transaction QR**. This will create a QR code that contains your transaction information.
        2. On your mobile device click on **Create Transaction** tab
        3. Click on **Scan Transaction QR**
        4. Scan the QR code on your offline device to load the transaction. 
        You can confirm the XDR and pending changes by clicking on **Check XDR on Stellar Lab**. This will open the StellarLabs XDR viewer.
        5. Click on **Submit Transaction** to submit. You can view the transaction on steexp.com by clicking on **View transaction on steexp.com**
    2. Use file export:
        1. On your offline device where the transaction was created click on **Export Transaction**. This will create a *.stellarhq file that contains the transaction XDR and some other metadata
        2. Copy the file to a USB flashdrive or use other method to move the file to an online device
        3. On the online device click on **Create Transaction** tab
        4. Click on **Import Transaction**
        5. Browse to and open the file created earlier to load the transaction.  
        You can confirm the XDR and pending changes by clicking on **Check XDR on Stellar Lab**. This will open the StellarLabs XDR viewer.
        6. Click on **Submit Transaction** to submit. You can view the transaction on steexp.com by clicking on **View transaction on steexp.com**
    3. Use Stellar Labs:
        1. Move the XDR information to an online device
        2. Visit [Post Transaction on Stellar Labs](https://www.stellar.org/laboratory/#explorer?resource=transactions&endpoint=create)
        3. Paste Transaction XDR
        4. Click **Submit**
        
##  Online Mode ##
**How to create, sign and send transactions online**
  
Full online mode can potentially expose your key if your device has any security issues, use at your own risk. Transactions can be built online then exported and loaded into offline device for signing before being reimported into online mode to be submitted.
  
1. Copy and paste your public key into the **Public Key** field. Alternatively you can scan a QR code that contains your Public Key by clicking on **Scan QR**. Clicking on **Create QR** will create a code of the entered Public Key. This can be useful for obtaining the Transaction Sequence Number when generating transactions on another device in Offline Mode.
2. Click on **Create Transaction** tab
3. Click on **New Transaction**  
  Your Transaction Sequence key will be automatically generated
4. Click on **New Operation**
5. Select desired Transaction Operation and fill in the necessary information
6. Click **Save Operation**
7. Add any additional Operations - up to 100 max per transaction
8. Click on **Build Transaction**  
  This will build the Transaction XDR and prepare for signing. You can confirm the XDR and pending changes by clicking on **Check XDR on Stellar Lab**. This will open the StellarLabs XDR viewer. You can also use Stellar Labs to sign and submitt your transaction.  
9. Copy and paste your Secret Key into the **Secret Key** field. This will eventually support Ledger Nano.
10. Click on **Sign Transaction**. The transaction will now be signed as indicated by the green "SIGNED" status.
11. Click on **Submit Transaction** to submit. You can view the transaction on steexp.com by clicking on **View transaction on steexp.com**

##  Mixed Mode ##
**How to create and send online, while signing offline**

1. Follow **Online Mode** steps 1-8 to build the transaction
2. Export unsiged transaction:
    1. If your offline device has a camera you can scan the QR Code:
        1. Click on "Create Transaction QR" on the online device
        2. On the offline device click on "Scan Transaction QR"
        3. Scan the QR code to transfer the XDR to offline device 
        4. Follow **Offline Mode** steps 6-12
    2. Export XDR file
        1. Click "Export Transaction" on the online device
        2. Move the file to the offline device using a USB drive or other methods
        3. On the offline device click on "Import Transaction" and load the exported file
        4. Follow **Offline Mode** steps 6-12

## Multisig ## 

Any additional signatures can be done using the same **Secret Key** field as the initial signature. Simply input additional key and click on sign. Transactions can also be exported to other devices or sent to other individuals for signatures. 
