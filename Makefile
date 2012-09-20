FILES := douban_feedmark.user.js weibo_marker.user.js NoBrighter.user.js

all: $(FILES)

.PHONY: all install clean

%.user.js: %.js
	cpp -I../jslibs -P -C -o $@ $<

install:
	ln -sv $(FILES) release

clean:
	rm -f $(FILES)
