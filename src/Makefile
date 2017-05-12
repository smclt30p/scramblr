all:
	make extension
	make settings

extension: Extension.ts
	tsc Extension.ts --outFile js/extension.js

settings: Preferences.ts
	tsc Preferences.ts --outFile js/settings.js

clean:
	rm -f js/*.js