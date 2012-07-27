// ==UserScript==
// @name			NoBrighter
// @description		Change element's background color that is too bright to a light green.
// @author			henix
// @version			0.4
// @include			*
// @exclude			http://boards.4chan.org/*
// @exclude			https://boards.4chan.org/*
// @updateURL		http://userscripts.org/scripts/source/138275.user.js
// @license			MIT License
// ==/UserScript==

/**
 * ChangeLog:
 *
 * 2012-7-19	henix
 * 		Remove prependSheet because it may clash with <body bgcolor="XX">
 *
 * 2012-7-15	henix
 *		Exclude boards.4chan.org
 *
 *		Because users could choose their own style from 4chan which loads after NoBrighter
 *
 * 2012-7-14	henix
 * 		Add changeTransparent()
 *
 * 2012-7-14	henix
 * 		Use css stylesheet to set body's default background-color
 *
 * 2012-7-12	henix
 * 		Version 0.1
 */

var targetColor = '#C7EDCC';

function changeBgcolor(elem) {
	if (elem.nodeType !== Node.ELEMENT_NODE) {
		return;
	}
	var bgcolor = window.getComputedStyle(elem, null).backgroundColor;
	if (bgcolor && bgcolor !== 'transparent') {
		var arRGB = bgcolor.match(/\d+/g);
		var r = parseInt(arRGB[0], 10);
		var g = parseInt(arRGB[1], 10);
		var b = parseInt(arRGB[2], 10);

		// we adopt HSL's lightness definition, see http://en.wikipedia.org/wiki/HSL_and_HSV
		var brightness = (Math.max(r, g, b) + Math.min(r, g, b)) / 255 / 2;

		if (brightness > 0.94) {
			elem.style.backgroundColor = targetColor;
		}
	}
}

function changeTransparent(elem) {
	var bgcolor = window.getComputedStyle(elem, null).backgroundColor;
	if (!bgcolor || bgcolor === 'transparent' || bgcolor.replace(/ /g, '') === 'rgba(0,0,0,0)') {
		elem.style.backgroundColor = targetColor;
	}
}

var alltags = document.getElementsByTagName("*");

function changeAll() {
	var len = alltags.length;
	for (var i = 0; i < len; i++) {
		changeBgcolor(alltags[i]);
	}
}
changeAll();
changeTransparent(document.body);

var longRunSites = [/^http:\/\/(www.)?weibo.com\//];

for (var i = 0; i < longRunSites.length; i++) {
	if (location.href.search(longRunSites[i]) !== -1) {
		console.log('make NoBrighter runs forever...');
		setInterval(changeAll, 2000);
		break;
	}
}

/*document.body.addEventListener('DOMNodeInserted', function(e) {
	changeBgcolor(e.target);
}, false);*/
