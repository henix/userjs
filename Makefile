FILES := douban_feedmark.user.js weibo_marker.user.js NoBrighter.user.js

all: $(FILES)

JSLIB_PATH=~/jslibs
RAINY_PATH=~/rainy

.PHONY: all install clean

%.user.js: %.js
	$(RAINY_PATH)/rain --incpath $(JSLIB_PATH) --moddef $(JSLIB_PATH)/flower.js/flower.moddef $< > $@
#	cpp -I../jslibs -P -undef -Wundef -std=c99 -nostdinc -Wtrigraphs -fdollars-in-identifiers -C -o $@ $<

install:
	ln -sv $(FILES) release

clean:
	rm -f $(FILES)
