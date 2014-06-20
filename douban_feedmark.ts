// ==UserScript==
// @name			Douban Timeline Marker
// @namespace		https://github.com/henix/userjs/douban_feedmark.ts
// @description		You can place a marker on the last newsfeed you have read, so it can be found easily next time. Ctrl-Click on an item to mark it, again to remove the mark.
// @author			henix
// @version			20140620-1
// @include			http://www.douban.com/*
// @license			MIT License
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

/// <reference path="flower/csser/addClass.ts" />
/// <reference path="flower/csser/removeClass.ts" />
/// <reference path="flower/csser/addSheet.ts" />

import csser = Flower.csser;

var curMark: HTMLElement;

function markItem(e: HTMLElement) {
	if (curMark) {
		demarkItem(curMark);
	}
	csser.addClass(e, 'feedmarker');
	curMark = e;
}

function demarkItem(e: HTMLElement) {
	csser.removeClass(e, 'feedmarker');
	curMark = null;
}

function getTarget(ev: Event, mse: MSEventObj): Node {
	if (ev) {
		return <Node>ev.target;
	} else {
		return mse.srcElement;
	}
}

function clickHandler(ev: MouseEvent) {
	var e = <{ctrlKey:boolean}>(ev || window.event);
	if (!e.ctrlKey) {
		return;
	}
	var tg = getTarget(ev, window.event);
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

csser.addSheet(
''
+ '.feedmarker, .feedmarker-old { border: 1px dashed black }\n'
+ '.feedmarker-old { border-left: 46px solid #ff6 }\n'
+ '.feedmarker { border-left: 46px solid #ccc }\n'
);

for (var i = stitems.length - 1; i >= 0; i--) {
	var stitem = <HTMLElement>stitems[i];
	if (markId && stitem.getAttribute('data-sid') === markId) {
		csser.addClass(stitem, 'feedmarker-old');
	}
	stitem.addEventListener('click', clickHandler, true); // register for capturing
}
