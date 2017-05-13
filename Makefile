all:
	make -C src -f Makefile

clean:
	make -C src -f Makefile clean
	rm -rf build

extension:
	make -C src -f Makefile extension

settings:
	make -C src -f Makefile settings

deploy:
	mkdir build
	cp -r src/img src/js src/css src/*.html src/*.xml src/*.json build/.
