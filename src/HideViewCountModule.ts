///<reference path="Module.ts"/>
///<reference path="YoutubeDOM.ts"/>
///<reference path="Logger.ts"/>

class HideViewCountModule extends Module {


    private NAME = "View Count Hider";
    private UUID = "com.scramblr.hideviewcount";

    private settings = [
        { "type":"bool", "key":"enabled", "value":"true" }
    ];

    init(docmanager: DocumentManager, currentPage: number) {

        /* Don't init the module if it's disabled */
        if (this.readSettingsKey("enabled") == "false") {
            return;
        }

        /* Create a style element and append it to the DOM
         * so that we can use this class to override
         * element class names to just be "hvc-hidden".
         */
        let style = document.createElement("style");
        style.setAttribute("id", "hvc-hidden-style");
        style.innerHTML = ".hvc-hidden { display: none; }";

        /* Just append once */
        if (document.getElementById("hvc-hidden-style") == null) {
            document.getElementsByTagName("body")[0].appendChild(style);
        }

        Logger.info("HideViewCount loaded!");

    }

    service(docmanager: DocumentManager, currentPage: number) {

        /* Don't service the module if it's disabled */
        if (this.readSettingsKey("enabled") == "false") {
            return;
        }

        /* Determine the current page that the user is looking at */
        switch (currentPage) {

            /* The user is viewing a video */
            case YouTubeDOM.PAGE_VIDEO:

                /* Get all the view count elements */

                let mainViewCount = document.getElementsByClassName("watch-view-count");
                let suggestionViewCount = document.getElementsByClassName("view-count");

                /* IMPORTANT! IMPORTANT! IMPORTANT! WHEN MODIFYING THE DOM YOU MUST USE
                 * DocumentManager.requestDocumentModify(), OR ELSE THE WHOLE PAGE
                 * WILL FREEZE AND CRASH !!!
                 */

                docmanager.requestDocumentModify(() => {

                    /* Set the class to hvc-hidden so that all view elements
                     * get display: none
                     */

                    HideViewCountModule.hideElements(mainViewCount);
                    HideViewCountModule.hideElements(suggestionViewCount);

                });

                break;

            /* The user is searching something/viewing the home page */
            case YouTubeDOM.PAGE_HOME:
            case YouTubeDOM.PAGE_SEARCH:

                /* Get all the view count elements */
                
                let searchViewCount = document.getElementsByClassName("yt-lockup-meta-info");

                /* IMPORTANT! IMPORTANT! IMPORTANT! WHEN MODIFYING THE DOM YOU MUST USE
                 * DocumentManager.requestDocumentModify(), OR ELSE THE WHOLE PAGE
                 * WILL FREEZE AND CRASH !!!
                 */

                docmanager.requestDocumentModify(() => {

                    /* Set the class to hvc-hidden so that all view elements
                     * get display: none
                     */

                    HideViewCountModule.hideElements(searchViewCount);

                });

                break;

            case YouTubeDOM.PAGE_CHANNEL:
            case YouTubeDOM.PAGE_USER:

                let viewCount = document.getElementsByClassName("yt-lockup-meta-info");
                let viewCount1 = document.getElementsByClassName("view-count");

                docmanager.requestDocumentModify(() => {
                    HideViewCountModule.hideElements(viewCount);
                    HideViewCountModule.hideElements(viewCount1);
                });

                break;

            default:
                return;
        }

    }

    private static hideElements(elements: HTMLCollectionOf<Element>) : void {
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