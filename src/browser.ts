/**
 * Created by gala on 5/5/2017.
 */

/**
 * For Google Chrome/Chromium API's
 */
declare const chrome;

interface BrowserAPI {
    getURIFromLocalFile(filepath: string) : string;
}

abstract class Browser {

    public static getCurrentBrowserAPI() : BrowserAPI {
        // TODO: Support more browsers
        return new GoogleChrome();
    }

}

class GoogleChrome implements BrowserAPI {

    getURIFromLocalFile(filepath: string): string {
        return chrome.extension.getURL(filepath);
    }

}