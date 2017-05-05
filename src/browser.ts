/**
 * Created by gala on 5/5/2017.
 */

/**
 * For Google Chrome/Chromium API's
 */
declare const chrome;

interface BrowserAPI {
    getURIFromLocalFile(filepath: string) : string;
    writeSetting(key: string, value: string) : void
    readSetting(key: string, def: string, callback: (value: string) => void) : void;
}

abstract class Browser {

    public static getCurrentBrowserAPI() : BrowserAPI {
        // TODO: Support more browsers
        return new GoogleChrome();
    }

}

class GoogleChrome implements BrowserAPI {

    writeSetting(key: string, value: string): void {
        let sett = {};
        sett[key] = value;
        chrome.storage.local.set(sett, function() {});
    }

    readSetting(key: string, def: string, callback: (value: string) => void) {

        chrome.storage.local.get(key, (items: any) => {
            let item = items[key];
            if (item == undefined) {
                callback(def);
            } else {
                callback(item);
            }
        });

    }

    getURIFromLocalFile(filepath: string): string {
        return chrome.extension.getURL(filepath);
    }

}