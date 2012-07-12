FILES := douban_feedmark.user.js weibo_marker.user.js NoBrighter.user.js

all: $(FILES)

.PHONY: all install clean

%.user.js: %.js
	cpp -I../Flower.js -P -C -o $@ $<

install:
	cp -uv $(FILES) release

clean:
	rm -f $(FILES)
