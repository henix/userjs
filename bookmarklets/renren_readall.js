(function () {
	function fireEvent(element, eventType) {
		var evt;
		if (document.createEvent) {
			evt = document.createEvent("HTMLEvents");
			evt.initEvent(eventType, true, true); // type, bubbling, cancelable
			return !element.dispatchEvent(evt);
		} else {
			evt = document.createEventObject();
			return element.fireEvent('on' + eventType, evt);
		}
	}
	var goon = confirm('确定？');
	if (goon) {
		var feedlist = document.querySelector('div.feed-list');
		var deletes = feedlist.querySelectorAll('a.delete');
		var len = deletes.length;
		for (var i = 0; i < len; i++) {
			fireEvent(deletes[i], 'click');
		}
		alert('已清除 ' + len + ' 条新鲜事');
	}
})();
