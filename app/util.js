define([
  'qrcode'
], function (
  qrcode
) {

  function b64DecodeUnicode(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(str).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  }

  function flatten(data) {
    var result = {};

    function recurse(cur, prop) {
      if (Object(cur) !== cur) {
        result[prop] = cur;
      } else if (Array.isArray(cur)) {
        for (var i = 0, l = cur.length; i < l; i++)
          recurse(cur[i], prop + "[" + i + "]");
        if (l == 0) result[prop] = [];
      } else {
        var isEmpty = true;
        for (var p in cur) {
          isEmpty = false;
          recurse(cur[p], prop ? prop + "." + p : p);
        }
        if (isEmpty && prop) result[prop] = {};
      }
    }
    recurse(data, "");
    return result;
  };

  function unflatten(data) {
    "use strict";
    if (Object(data) !== data || Array.isArray(data)) return data;
    var regex = /\.?([^.\[\]]+)|\[(\d+)\]/g,
      resultholder = {};
    for (var p in data) {
      var cur = resultholder,
        prop = "",
        m;
      while (m = regex.exec(p)) {
        cur = cur[prop] || (cur[prop] = (m[2] ? [] : {}));
        prop = m[2] || m[1];
      }
      cur[prop] = data[p];
    }
    return resultholder[""] || resultholder;
  };

  function isJson(data) {
    try {
      JSON.parse(data);
    } catch (e) {
      return false;
    }
    return true;
  }

  function isOnline() {
    return navigator.onLine;
  }

  function downloadFile(text, name, type) {
    var a = document.createElement("a");
    var file = new Blob([text], {
      type: type
    });
    a.href = URL.createObjectURL(file);
    a.download = name;
    a.click();
  }

  function uploadFile(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onloadend = function (onloadend_e) {
        resolve(reader.result);
      }

      reader.readAsText(file);
    });
  }

  function generateQRCode(data) {
    var qr = qrcode(0, 'L');
    qr.addData(data);
    qr.make();
    document.getElementById('qrcode').innerHTML = qr.createImgTag();
  }

  return {
    b64DecodeUnicode: b64DecodeUnicode,
    flatten: flatten,
    unflatten: unflatten,
    isJson: isJson,
    isOnline: isOnline,
    downloadFile: downloadFile,
    uploadFile: uploadFile,
    generateQRCode: generateQRCode
  };
});
