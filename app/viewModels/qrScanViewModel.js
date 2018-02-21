define([
  'knockout',
  'jsqr'
], function (
  ko,
  jsQR) {

  function QrScanViewModel() {
    var self = this;

    self.isLoaded = false;
    self.isQrCanceled = false;
    self.currStream;

    self.devices = ko.observableArray();
    self.selectedDevice = ko.observable();

    self.scan = function () {
      self.isQrCanceled = false;

      var wrappedPromise = navigator.mediaDevices.enumerateDevices()
        .then(gotDevices)
        .then(startScan);

      return {
        promise: wrappedPromise,
        cancel() {
          self.isQrCanceled = true;
        }
      }
    }

    function gotDevices(deviceInfos) {
      if (self.isLoaded)
        return;

      var devices = [];

      for (var i = 0; i !== deviceInfos.length; ++i) {
        var deviceInfo = deviceInfos[i];

        var device = {};
        var defaultDevice;

        device.value = deviceInfo.deviceId;
        if (deviceInfo.kind === 'videoinput') {
          device.description = deviceInfo.label || 'camera ' +
            (devices.length + 1);

          if (device.description.includes("facing back")) {
            device.isBackFacing = true;
            defaultDevice = device;
          }

          devices.push(device);
        }
      }

      self.devices(devices);
      self.selectedDevice(defaultDevice);

      self.selectedDeviceSubscription = self.selectedDevice.subscribe(function () {
        startScan();
      });
    }

    function startScan() {
      var video = document.getElementById("qrPreview");
      var canvasElement = document.getElementById("videoCanvas");
      var canvas = canvasElement.getContext("2d");

      canvasElement.height = 256;
      canvasElement.width = 256;

      if (!self.selectedDevice().isBackFacing) {
        canvas.translate(256, 0);
        canvas.scale(-1, 1);
      }

      return new Promise(function (resolve, reject) {

        var constraints = {
          video: {
            deviceId: {
              exact: self.selectedDevice().value
            }
          }
        };

        navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
          self.currStream = stream;
          video.srcObject = stream;
          video.play();
          requestAnimationFrame(tick);
        });

        function tick() {
          if (self.isQrCanceled) {
            dispose();
            return;
          }

          if (video.readyState === video.HAVE_ENOUGH_DATA) {
            var sx = (video.videoWidth - 256) / 2;
            var sy = (video.videoHeight - 256) / 2;

            canvas.drawImage(video, sx, sy, 256, 256, 0, 0, 256, 256);
            var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
            var code = jsQR(imageData.data, imageData.width, imageData.height);
            if (code) {
              drawLine(code.location.topLeftCorner, code.location.topRightCorner, "#FF3B58");
              drawLine(code.location.topRightCorner, code.location.bottomRightCorner, "#FF3B58");
              drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, "#FF3B58");
              drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, "#FF3B58");

              dispose();
              resolve(code.data);
            } else {}
          }
          requestAnimationFrame(tick);
        }

        function drawLine(begin, end, color) {
          canvas.beginPath();
          canvas.moveTo(begin.x, begin.y);
          canvas.lineTo(end.x, end.y);
          canvas.lineWidth = 4;
          canvas.strokeStyle = color;
          canvas.stroke();
        }
      });
    }

    function dispose() {
      self.currStream.getTracks().forEach(function (track) {
        track.stop();
      });

      if (self.selectedDeviceSubscription)
        self.selectedDeviceSubscription.dispose();
    }
  }

  return QrScanViewModel
});
