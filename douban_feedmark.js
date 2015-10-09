// ==UserScript==
// @name        Douban Timeline Marker
// @namespace   https://github.com/henix/userjs/douban_feedmark
// @description You can place a marker on the last newsfeed you have read, so it can be found easily next time. Ctrl-Click on an item to mark it, again to remove the mark.
// @author      henix
// @version     20151009.1
// @include     http://www.douban.com/*
// @license     MIT License
// @@require    https://cdnjs.cloudflare.com/ajax/libs/dom4/1.5.1/dom4.js
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

var curMark;

function markItem(e) {
  if (curMark) {
    demarkItem(curMark);
  }
  e.classList.add('feedmarker');
  curMark = e;
}

function demarkItem(e) {
  e.classList.remove('feedmarker');
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
    localStorage.setItem('feedmarkid', this.getAttribute('data-sid'));
  } else {
    demarkItem(this);
    localStorage.removeItem('feedmarkid');
  }
}

var markId = localStorage.getItem('feedmarkid');
var stitems = document.querySelectorAll('div.status-item'); // IE8+

GM_addStyle('.feedmarker, .feedmarker-old { border: 1px dashed black } .feedmarker-old { border-top: 20px solid #ff6 } .feedmarker { border-top: 20px solid #ccc }');

for (var i = stitems.length - 1; i >= 0; i--) {
  var stitem = stitems[i];
  if (markId && stitem.getAttribute('data-sid') === markId) {
    stitem.classList.add('feedmarker-old');
  }
  stitem.addEventListener('click', clickHandler, true); // register for capturing
}
