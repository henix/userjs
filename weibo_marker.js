// ==UserScript==
// @name			Weibo Bookmark
// @description		You can place a marker on the last newsfeed you have read, so it can be found easily next time. Ctrl-Click on an item to mark it, again to remove the mark.
// @author			henix
// @version			1.0
// @include			http://weibo.com/*
// @include			http://www.weibo.com/*
// @updateURL		http://userscripts.org/scripts/source/126882.user.js
// @license			MIT License
// ==/UserScript==

/**
 * ChangeLog:
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

#include "flower.js/csser.js"

var curMark;

function markItem(e) {
	if (curMark) {
		demarkItem(curMark);
	}
	csser.addClass(e, 'feedmarker');
	curMark = e;
}

function demarkItem(e) {
	csser.removeClass(e, 'feedmarker');
	curMark = null;
}

function clickHandler(e) {
	if (!e) e = window.event;
	if (!e.ctrlKey) {
		return;
	}
	var tg = window.event ? e.srcElement : e.target;
	if (tg.nodeName === 'A') {
		return;
	}
	var p = tg.parentNode;
	while (p != this) {
		tg = p;
		p = tg.parentNode;
	}
	if (curMark !== tg) {
		markItem(tg);
		localStorage.setItem('feedmarkid', tg.getAttribute('mid'));
	} else {
		demarkItem(tg);
		localStorage.removeItem('feedmarkid');
	}
}

var oldId;

var feedlist = null;

function markOld() {
	var feeds = feedlist.querySelectorAll('div.WB_feed_type');
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

csser.insertSheet('div.feedmarker, div.feedmarker-old {border: 1px dashed black} div.feedmarker {border-top: 20px solid #ccc} div.feedmarker-old {border-top: 20px solid #ff6}');
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
