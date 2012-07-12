// ==UserScript==
// @name			NoBrighter
// @description		Change element's background color that is too bright to a light green.
// @author			henix
// @version			0.1
// @include			*
// @updateURL		http://userscripts.org/scripts/source/138275.user.js
// @license			MIT License
// ==/UserScript==

/**
 * ChangeLog:
 *
 * 2012-7-12	henix
 * 		Version 0.1
 */

function changeBgcolor(elem, allowTrans) {
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
			elem.style.backgroundColor = '#C7EDCC';
		}
	} else if (!allowTrans) {
		elem.style.backgroundColor = '#C7EDCC';
	}
}

var alltags = document.getElementsByTagName("*");

function changeAll() {
	var len = alltags.length;
	for (var i = 0; i < len; i++) {
		changeBgcolor(alltags[i], true);
	}
}
changeBgcolor(document.body, false);
changeAll();

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
