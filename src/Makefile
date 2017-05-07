all:
	make extension
	make settings

extension: Extension.ts
	tsc Extension.ts --outFile js/extension.js

settings: Settings.ts
	tsc Settings.ts --outFile js/settings.js

clean:
	rm -f js/*.js