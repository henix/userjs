// ==UserScript==
// @name			Weibo Bookmark
// @namespace		https://github.com/henix/userjs/weibo_marker
// @description		You can place a marker on the last newsfeed you have read, so it can be found easily next time. Ctrl-Click on an item to mark it, again to remove the mark.
// @author			henix
// @version			20140620.1
// @include			http://weibo.com/*
// @include			http://www.weibo.com/*
// @license			MIT License
// @grant			none
// ==/UserScript==

/**
 * ChangeLog:
 *
 * 2013-3-30	henix
 * 		解决在分组可见微博上添加书签不可见的问题
 *
 * 		分组可见微博有 type_group 这个 class 从而使原始 css 的优先级更高
 *
 * 		Version 1.0.1
 *
 * 2012-10-26	henix
 * 		Updated to new version weibo.
 *
 * 		Version 1.0
 *
 * 2012-7-11	henix
 * 		Fix the bug that can't add marker just upon "XX分钟前，你看到这里".
 *
 * 		Weibo will add a style dl.W_no_border which has a higher priority than ".feedmarker",
 * 		so my style on border will be never applied.
 * 		Change ".feedmarker" to "dl.feedmarker" can fix this bug.
 *
 * 2012-6-14	henix
 * 		Add www.weibo.com
 *
 * 2012-5-30	henix
 * 		Fix the bug that you can not add marker on Chrome sometimes.
 *
 * 		If the script executed before DOM loaded completely, the click handler will not be registered.
 *
 * 2012-2-27	henix
 * 		don't listen on load event
 *
 * 2012-2-27	henix
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
	var tg = <HTMLElement>getTarget(ev, window.event);
	if (tg.nodeName === 'A') {
		return;
	}
	var p = <HTMLElement>tg.parentNode;
	while (p != this) {
		tg = p;
		p = <HTMLElement>tg.parentNode;
	}
	if (curMark !== tg) {
		markItem(tg);
		localStorage.setItem('feedmarkid', tg.getAttribute('mid'));
	} else {
		demarkItem(tg);
		localStorage.removeItem('feedmarkid');
	}
}

var oldId: string;

var feedlist: Element = null;

function markOld() {
	var feeds = <NodeListOf<HTMLElement>>feedlist.querySelectorAll('div.WB_feed_type');
	if (feeds) {
		var len = feeds.length;
		var done = false;
		for (var i = len - 1; i >= 0; i--) {
			var item = feeds[i];
			if (item.getAttribute('mid') === oldId) {
				csser.addClass(item, 'feedmarker-old');
				done = true;
				break;
			}
		}
		if (!done) {
			setTimeout(markOld, 1000 * 2); // try after 2s
		}
	}
}

csser.addSheet(
'div.WB_feed div.WB_feed_type.feedmarker, ' +
'div.WB_feed div.WB_feed_type.feedmarker-old, ' +
'div.WB_feed div.WB_feed_type.type_group.feedmarker, ' +
'div.WB_feed div.WB_feed_type.type_group.feedmarker-old {' +
'border-top-width: 20px;' +
'border-right-width: 1px;' +
'border-bottom-width: 1px;' +
'border-left-width: 1px;' +
'border-top-style: solid;' +
'border-right-style: dashed;' +
'border-bottom-style: dashed;' +
'border-left-style: dashed;' +
'border-right-color: black;' +
'border-bottom-color: black;' +
'border-left-color: black;' +
'}' +
'div.WB_feed div.WB_feed_type.feedmarker-old, ' +
'div.WB_feed div.WB_feed_type.type_group.feedmarker-old {' +
'border-top-color: #ff6;' +
'}' +
'div.WB_feed div.WB_feed_type.feedmarker, ' +
'div.WB_feed div.WB_feed_type.type_group.feedmarker {' +
'border-top-color: #ccc;' +
'}'
);
oldId = localStorage.getItem('feedmarkid');

function addClickHandler() {
	feedlist = document.querySelector('div#pl_content_homeFeed > div.WB_feed');
	if (feedlist) {
		feedlist.addEventListener('click', clickHandler);
		if (oldId) {
			markOld();
		}
	} else {
		// maybe the DOM is not loaded completely, we will try after 1s
		setTimeout(addClickHandler, 1000);
	}
}

addClickHandler();
