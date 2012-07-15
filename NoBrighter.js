// ==UserScript==
// @name			NoBrighter
// @description		Change element's background color that is too bright to a light green.
// @author			henix
// @version			0.2
// @include			*
// @updateURL		http://userscripts.org/scripts/source/138275.user.js
// @license			MIT License
// ==/UserScript==

/**
 * ChangeLog:
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

#include "csser.js"

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
	if (!bgcolor || bgcolor === 'transparent' || bgcolor.replace(' ', '') === 'rgba(0,0,0,0)') {
		elem.style.backgroundColor = targetColor;
	}
}

csser.prependSheet('body { background-color: ' + targetColor + '; }');

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
