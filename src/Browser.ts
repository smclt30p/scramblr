/// <reference path="GoogleChrome.ts"/>
///<reference path="BrowserAPI.ts"/>

abstract class Browser {

    public static getCurrentBrowserAPI() : BrowserAPI {
        // TODO: Support more browsers
        return new GoogleChrome();
    }

}

