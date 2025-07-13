.PHONY: run clean build

build:
	npx tsc

run: build
	npm start

clean:
	rm -rf *.js