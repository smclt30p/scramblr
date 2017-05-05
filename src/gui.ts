/// <reference path="logger.ts"/>
/// <reference path="browser.ts"/>

class DocumentManager {

    private static instance: DocumentManager = undefined;

    private intervals: Interval[] = [];
    private observer: MutationObserver;
    private observerConf: object = {subtree: true, attributes: true, childList: true, characterData: true};

    public lookupElement(id: string, callback: (data: any) => void): void {

        const interval = new Interval();
        const self = this;

        const worker = () => {

            let element: any = undefined;

            switch (id[0]) {

                case "c":
                    element = document.getElementsByClassName(id.substring(2));
                    break;
                case "t":
                    element = document.getElementsByTagName(id.substring(2));
                    break;
                case "i":
                    element = document.getElementById(id.substring(2));
                    break;
                default:
                    throw new LookupException("Invalid lookup tag: " + id[0])

            }

            if (element != undefined) {
                self.cancelInterval(interval);
                callback(element);
            } else {
                interval.ping();
                if (interval.getCount() > 20) {
                    self.cancelInterval(interval);
                    throw new LookupException(id + ": lookup failed after 2 seconds")
                }
            }

        };

        interval.setCallback(worker);
        interval.setTime(100);
        this.intervals.push(interval);
        interval.start();

    };

    private cancelInterval(interval: Interval): void {
        interval.cancel();
        this.intervals.splice(this.intervals.indexOf(interval), 1);
    };

    public observeContent(callback: (element: any) => void): void {
        const self = this;
        this.lookupElement("i:content", (element: any) => {
            self.observer = new MutationObserver(callback);
            self.observer.observe(element, self.observerConf);
        })

    };

    public requestDocumentModify(callback: () => void): void {
        const self = this;
        this.observer.disconnect();
        callback();
        this.lookupElement("i:content", (element: any) => {
            self.observer.observe(element, self.observerConf);
        })
    }

    public static getInstance(): DocumentManager {
        if (DocumentManager.instance == undefined) {
            DocumentManager.instance = new DocumentManager();
        }
        return DocumentManager.instance;
    }

}

class Interval {

    private interval: number = 0;
    private counter: number = 0;
    private callback = undefined;
    private time: number = undefined;

    public start(): void {
        this.interval = setInterval(this.callback, this.time);
    };

    public cancel(): void {
        clearInterval(this.interval);
    };

    public ping(): void {
        this.counter = this.counter + 1;
    };

    public getCount(): number {
        return this.counter;
    };

    public setCallback(callback: () => void): void {
        this.callback = callback;
    };

    public setTime(time: number): void {
        this.time = time;
    }

}

class YouTubeDOM {

    private static PAGE_VIDEO_PLAYING_TOKEN: string = "/watch";
    private static PAGE_SEARCH_RESULTS_TOKEN: string = "/results";
    private static PAGE_HOME_PAGE_TOKEN: string = "/";
    private static PAGE_CHANNEL_VIEW_TOKEN: string = "/channel";
    private static PAGE_USER_VIEW_TOKEN: string = "/user";
    private static PAGE_SUBSCRIBERS_TOKEN: string = "/subscriptions";

    public static PAGE_VIDEO: number = 1;
    public static PAGE_SEARCH: number = 2;
    public static PAGE_HOME: number = 3;
    public static PAGE_CHANNEL: number = 4;
    public static PAGE_USER: number = 5;
    public static PAGE_UNKNOWN: number = 6;
    public static PAGE_SUBSCRIPTIONS: number = 7;

    public getCurrentPage(): number {

        if (window.location.pathname.indexOf(YouTubeDOM.PAGE_VIDEO_PLAYING_TOKEN) != -1) return YouTubeDOM.PAGE_VIDEO;
        if (window.location.pathname.indexOf(YouTubeDOM.PAGE_SEARCH_RESULTS_TOKEN) != -1) return YouTubeDOM.PAGE_SEARCH;
        if (window.location.pathname.indexOf(YouTubeDOM.PAGE_CHANNEL_VIEW_TOKEN) != -1) return YouTubeDOM.PAGE_CHANNEL;
        if (window.location.pathname.indexOf(YouTubeDOM.PAGE_USER_VIEW_TOKEN) != -1) return YouTubeDOM.PAGE_USER;
        if (window.location.pathname.indexOf(YouTubeDOM.PAGE_SUBSCRIBERS_TOKEN) != -1) return YouTubeDOM.PAGE_SUBSCRIPTIONS;
        if (window.location.pathname == YouTubeDOM.PAGE_HOME_PAGE_TOKEN) return YouTubeDOM.PAGE_HOME;
        return YouTubeDOM.PAGE_UNKNOWN;
    }

    public injectUserInterface(): void {

        try {

            this.injectMenuButton();

        } catch (e) {
            throw e;
        }

    };

    private injectMenuButton(): void {

        Utilities.fetchLocalFile("html/settings-item.html", function (data) {

            const html = document.createRange().createContextualFragment(data).firstChild;

            let spadom = DocumentManager.getInstance();

            spadom.lookupElement("c:guide-user-links", function (elements) {

                if (elements.length == 0) {
                    Logger.error("No menu found to injectUserInterface option!");
                    throw new YoutubeDOMException("No menu found to injectUserInterface option!");
                }

                html.addEventListener("click", () => {
                    window.open(Browser.getCurrentBrowserAPI().getURIFromLocalFile("/html/settings/settings.html"));
                });

                elements[0].appendChild(html);

            });

        });
    };



}

class Utilities {

    public static fetchLocalFile(path: string, callback: (data: string) => void) {

        const url = Browser.getCurrentBrowserAPI().getURIFromLocalFile(path);
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function (data) {
            if (xhr.readyState == XMLHttpRequest.DONE && xhr.status === 200) {
                callback(xhr.responseText);
            }
        };
        xhr.send();
    };

}

class YoutubeDOMException extends Error {}
class LookupException extends Error {}
