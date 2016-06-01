var load = (function () {
  var _modules;

  var processModule = function (module, callback) {
    var source = localStorage.getItem(module); // load module from local storage

    if (source) {
      console.log('[loader]', 'module loaded using local storage: ' + module);
      eval(source); // compile module
      callback();
    }
    else {
      var xhttp = new XMLHttpRequest();

      xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
          source = xhttp.responseText;
          console.log('[loader]', 'module loaded using http: ' + module);
          localStorage.setItem(module, source); // save module into local storage
          eval(source); // compile module
          callback();
        }
      };

      xhttp.open('GET', module + '.js', true);
      xhttp.send();
    }
  };

  var processModules = function (callback, index) {
    return function () {
      index = index || 0;

      if (_modules && _modules[index]) {
        processModule(_modules[index], processModules(callback, index + 1));
      }
      else {
        callback();
      }
    }
  }

  return function (modules) {
    _modules = modules;

    var startTime = new Date().getTime();
    processModules(function () {
      var endTime = new Date().getTime();
      console.log('[loader]', 'all done in: ' + (endTime - startTime) + ' ms');
    })();
  }

})();