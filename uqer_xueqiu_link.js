// ==UserScript==
// @name        Uqer / JoinQuant Xueqiu Link
// @namespace   https://github.com/henix/userjs/uqer_xueqiu_link
// @author      henix
// @version     20171223.1
// @description 为优矿 / 聚宽的结果中的 secID / code 添加到雪球的链接
// @match       https://uqer.io/labs/*
// @match       https://www.joinquant.net/user/*/notebooks/*.ipynb
// @license     MIT License
// @require     https://cdn.rawgit.com/jed/domo/13c45aba3e94dd2d1bc469ce3339bbc1e3a10314/lib/domo.js
// @grant       none
// ==/UserScript==

var secIDPatt = /^([0-9]{6})\.(XSHG|XSHE)$/;

var markets = {
	"XSHG": "SH",
	"XSHE": "SZ"
};

function replaceLink() {
	[].slice.call(document.querySelectorAll(".result td, table.dataframe td")).forEach(function(td) {
		if (td.childNodes && td.childNodes[0] && td.childNodes[0].nodeType == Node.TEXT_NODE) {
			var m = secIDPatt.exec(td.textContent);
			if (m) {
				var market = markets[m[2]] || "";
				var xqLink = "https://xueqiu.com/S/" + market + m[1];
				var a = A({ target: "_blank", href: xqLink }, td.textContent);
				td.innerHTML = "";
				td.appendChild(a);
			}
		}
	});
}

setInterval(replaceLink, 2000);
