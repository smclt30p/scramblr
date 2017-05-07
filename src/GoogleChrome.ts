///<reference path="BrowserAPI.ts"/>


/**
 * For Google Chrome/Chromium API's
 */
declare const chrome;


class GoogleChrome implements BrowserAPI {

    writeSetting(key: string, value: string): void {
        let sett = {};
        sett[key] = value;
        chrome.storage.local.set(sett, function() {});
    }

    readSetting(key: string, def: any, callback: (value: any) => void) {

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