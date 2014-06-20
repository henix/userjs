TS := $(wildcard *.ts)
USERJS := $(patsubst %.ts,build/%.user.js,$(TS))

.PHONY: all clean

all: $(USERJS)

build/%.user.js: %.ts
	tsc --out $@ $<

clean:
	rm $(USERJS)
