///<reference path="YoutubeDOM.ts"/>
class TrumpFilterModule extends Module {

    private NAME = "Trump Filter";
    private UUID = "com.scramblr.trumpfilter";

    private settings = [
        {
            "type": "bool",
            "key": "enabled",
            "value": "true",
            "title": "Enable Trump/SJW Filter",
            "desc": "Hide all videos whose title contain the word 'Trump'."
        },
    ];


    init(docmanager: DocumentManager, currentPage: number) {

        let setting = this.readSettingsKey("enabled");

        /* Don't init the module if it's disabled */
        if (setting == "false") {
            return;
        }

        /* Create a style element and append it to the DOM
         * so that we can use this class to override
         * element class names to just be "trump-hidden".
         */
        let style = document.createElement("style");
        style.setAttribute("id", "trump-hidden-style");
        style.innerHTML = ".trump-hidden { display: none; }";

        /* Just append once */
        if (document.getElementById("trump-hidden-style") == null) {
            document.getElementsByTagName("body")[0].appendChild(style);
        }

        Logger.info("Trump Filter loaded!");

    }

    service(docmanager: DocumentManager, currentPage: number) {

        let setting = this.readSettingsKey("enabled");

        /* Don't init the module if it's disabled */
        if (setting == "false") {
            return;
        }

        /* Determine the current page that the user is looking at */
        switch (currentPage) {

            /* The user is viewing a video */
            case YouTubeDOM.PAGE_VIDEO:

                this.filterTrumpByClassName(docmanager, "video-list-item");

                break;

            case YouTubeDOM.PAGE_SEARCH:

                this.filterTrumpByClassName(docmanager, "yt-lockup");

                break;


            default:
                return;
        }

    }

    private filterTrumpByClassName(docmanager: DocumentManager, classname: string) : void {

        let mainViewCount = document.getElementsByClassName(classname);

        for (let i = 0; i < mainViewCount.length; i++) {

            /* Yeah, right */

            if (mainViewCount[i] != undefined && mainViewCount[i] != null) {
                if (mainViewCount[i].innerHTML.indexOf("trump") != -1 || mainViewCount[i].innerHTML.indexOf("Trump") != -1 ||
                    mainViewCount[i].innerHTML.indexOf("TRUMP") != -1) {

                    docmanager.requestDocumentModify(() => {
                        mainViewCount[i].setAttribute("class", "trump-hidden");
                        Logger.verbose("Filtering TRUMP...");
                    });

                }
            }

        }

    }

    private static hideElements(elements: HTMLCollectionOf<Element>): void {
        for (let i = 0; i < elements.length; i++) {
            elements[i].setAttribute("class", "hvc-hidden");
        }
    }

    destruct() {
    }

    getSettings() {
        return this.settings;
    }

    getName(): string {
        return this.NAME;
    }

    getUUID(): string {
        return this.UUID;
    }

}