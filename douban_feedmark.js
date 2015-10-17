// ==UserScript==
// @name        Douban Timeline Marker
// @namespace   https://github.com/henix/userjs/douban_feedmark
// @description You can place a marker on the last newsfeed you have read, so it can be found easily next time. Ctrl-Click on an item to mark it, again to remove the mark.
// @author      henix
// @version     20151017.1
// @include     http://www.douban.com/
// @include     https://www.douban.com/
// @license     MIT License
// @require     https://cdnjs.cloudflare.com/ajax/libs/dom4/1.5.1/dom4.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_addStyle
// ==/UserScript==

/**
 * ChangeLog:
 *
 * 2012-2-29	henix
 * 		don't listen on load event
 *
 * 2012-2-27	henix
 * 		change trigger action from "click" to "Ctrl-click"
 *
 * 2012-2-14	henix
 * 		add another yellow marker on the previous position, and it can't be removed
 *
 * 2012-2-14	henix
 * 		Version 0.1
 */

// Array.prototype.find - MIT License (c) 2013 Paul Miller <http://paulmillr.com>
// For all details and docs: https://github.com/paulmillr/array.prototype.find
(function(globals){
  if (Array.prototype.find) return;

  var find = function(predicate) {
    var list = Object(this);
    var length = list.length < 0 ? 0 : list.length >>> 0; // ES.ToUint32;
    if (length === 0) return undefined;
    if (typeof predicate !== 'function' || Object.prototype.toString.call(predicate) !== '[object Function]') {
      throw new TypeError('Array#find: predicate must be a function');
    }
    var thisArg = arguments[1];
    for (var i = 0, value; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) return value;
    }
    return undefined;
  };

  if (Object.defineProperty) {
    try {
      Object.defineProperty(Array.prototype, 'find', {
        value: find, configurable: true, enumerable: false, writable: true
      });
    } catch(e) {}
  }

  if (!Array.prototype.find) {
    Array.prototype.find = find;
  }
})(this);

var curMark;

function markItem(e) {
  if (curMark) {
    demarkItem();
  }
  e.classList.add('feedmarker');
  curMark = e;
}

function demarkItem() {
  curMark.classList.remove('feedmarker');
  curMark = null;
}

function clickHandler(e) {
  if (!e) e = window.event;
  if (!e.ctrlKey) {
    return;
  }
  var tg = window.event ? e.srcElement : e.target;
  if (tg.nodeName === 'A') {
    return; // ignore clicks on <a>
  }
  if (curMark !== this) {
    markItem(this);
    GM_setValue('feedmarkid', this.getAttribute('data-sid'));
  } else {
    demarkItem();
    GM_deleteValue('feedmarkid');
  }
}

GM_addStyle(
".feedmarker, .feedmarker-old { border: 1px dashed black }" +
".feedmarker-old { border-top: 20px solid #ff6 }" +
".feedmarker { border-top: 20px solid #ccc }"
);

var stitems = Array.prototype.slice.call(document.querySelectorAll("div.status-item"));

var oldId = GM_getValue('feedmarkid');
if (oldId) {
  var item = stitems.find(function(e) { return e.getAttribute("data-sid") == oldId; });
  if (item) {
    item.classList.add("feedmarker-old");
  }
}

stitems.forEach(function(item) {
  item.addEventListener("click", clickHandler, true); // register for capturing
});
