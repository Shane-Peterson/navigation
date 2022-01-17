// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"epB2":[function(require,module,exports) {
var isTouchDevice = 'ontouchstart' in document.documentElement;
if (isTouchDevice) {
  document.body.style.minWidth = document.documentElement.clientWidth + 'px';
  document.body.style.minHeight = document.documentElement.clientHeight + 'px';
}

var $siteList = $('.siteList');
var $lastLi = $siteList.find('li.last')[1];
var randomButton = $('.randomButton');
var addButton = $('.addButton');
var localData = localStorage.getItem('localData');
var localDataObject = JSON.parse(localData);
var hashMap = localDataObject || [{ logo: '#icon-github', url: '//github.com', title: 'Github', logoType: 'svg' }];
var alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
var sf = void 0;
var timer = void 0;
var simplifyUrl = function simplifyUrl(url) {
  return url.replace('https://', '').replace('http://', '').replace('//', '').replace('www.', '').replace(/\/.*/, '').replace(/\..*/, '');
};
var deleteIcon = function deleteIcon() {
  if (isTouchDevice) {
    return '\n      <div class="delete delete1">\n        <svg class="icon">\n          <use xlink:href=#icon-delete1></use>\n        </svg>\n      </div>\n      ';
  } else {
    return '\n      <div class="delete">\n        <svg class="icon">\n          <use xlink:href=#icon-delete></use>\n        </svg>\n      </div>\n      ';
  }
};
var iconWrapper = function iconWrapper(node) {
  if (node.logoType === 'text') {
    return '<div class="icon">' + node.logo + '</div>';
  } else if (node.logoType === 'svg') {
    return '<svg class="icon" aria-hidden="true">\n      <use xlink:href=' + node.logo + '></use>';
  } else if (node.logoType === 'image') {
    return '<img class="icon" height="24" width="24" src=\'//www.google.com/s2/favicons?domain=' + node.url + '\' alt="' + node.title + '"/>';
  }
};

var render = function render() {
  $siteList.find('li:not(.last)').remove();
  hashMap.forEach(function (node, index) {
    var $li = $('<li>\n      <div class="site label">\n        <div class="icon-wrapper">\n            ' + iconWrapper(node) + '\n        </div>\n        <div class="text"><span>' + node.title + '</span></div>\n          ' + deleteIcon() + '\n      </div>\n    </li>').insertBefore($lastLi);

    if (isTouchDevice) {
      $li.on('touchend', '.delete1', function (e) {
        e.stopPropagation();
        $li.css('animation', 'scaleBack 0.7s linear 1 forwards');
        setTimeout(function () {
          hashMap.splice(index, 1);
          storage();
          render();
        }, 700);
      });
      $li.on('touchstart', function (e) {
        e.preventDefault();
        timer = Date.now();
        sf = setTimeout(function () {
          $siteList.find('li:not(.last)').each(function (index, node) {
            node.classList.add('shake');
          });
          $('.delete1').css('display', 'block');
        }, 700);
      });
      $li.on('touchend', function () {
        timer = Date.now() - timer;
        if (timer < 700) {
          clearTimeout(sf);
          changeIcon(node);
        }
        timer = 0;
      });
    } else {
      $li.on('click', function (e) {
        changeIcon(node);
      });
      $li.on('click', '.delete', function (e) {
        e.stopPropagation();
        hashMap.splice(index, 1);
        storage();
        render();
      });
    }
  });
};

render();
$('body').on('click', function () {
  $('.delete1').css('display', 'none');
  $('.shake').removeClass('shake');
});

addButton.on('click', function () {
  var url = window.prompt('请问你要添加的网址是啥？');
  try {
    if (!url.startsWith('http') || !url.startsWith('https')) {
      url = '//' + url;
    }
    var title = simplifyUrl(url);
    hashMap.push({ logo: '' + title[0], url: url, title: title, logoType: 'text' });
    storage();
    render();
  } catch (error) {}
});

$(document).on('keypress', function (e) {
  var key = e.key;

  if (key === 'a') {
    addButton.trigger('click');
  } else if (key === 'r') {
    randomButton.trigger('click');
  }
  hashMap.forEach(function (node, index) {
    if (node.title[0].toLowerCase() === key) {
      $siteList.find('li:not(.last)').each(function (i, n) {
        if (i === index) {
          $(n).trigger('click');
          $(n).trigger('touchstart');
          $(n).trigger('touchend');
        }
      });
    }
  });
});

function storage() {
  var string = JSON.stringify(hashMap);
  localStorage.setItem('localData', string);
}

function changeIcon(node) {
  if (node.logoType === 'text') {
    node.logoType = 'image';
  }
  storage();
  window.open(node.url, '_self');
}

$('.searchForm > input').on('keypress', function (e) {
  e.stopPropagation();
});

randomButton.on('click', function () {
  var frequency = getRandomInt(2, 5);
  var url = '//';
  for (var i = 0; i < frequency; i++) {
    url += alphabet[getRandomInt(0, 25)];
  }
  window.open(url + '.com', '_self');
});

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}
},{}]},{},["epB2"], null)
//# sourceMappingURL=main.17bf8316.map