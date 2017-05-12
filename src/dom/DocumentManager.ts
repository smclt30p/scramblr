///<reference path="../common/Utilities.ts"/>
///<reference path="../compat/Browser.ts"/>
///<reference path="../common/Interval.ts"/>
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

class LookupException extends Error {}
