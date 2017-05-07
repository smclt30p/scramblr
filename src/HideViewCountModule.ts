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

        if (this.readSettingsKey("enabled") == "false") {
            return;
        }

        let style = document.createElement("style");
        style.setAttribute("id", "hvc-hidden-style");
        style.innerHTML = ".hvc-hidden { display: none; }";

        if (document.getElementById("hvc-hidden-style") == null) {
            document.getElementsByTagName("body")[0].appendChild(style);
        }

        Logger.info("HideViewCount loaded!");

    }

    service(docmanager: DocumentManager, currentPage: number) {

        if (this.readSettingsKey("enabled") == "false") {
            return;
        }

        switch (currentPage) {

            case YouTubeDOM.PAGE_VIDEO:

                let mainViewCount = document.getElementsByClassName("watch-view-count");
                let suggestionViewCount = document.getElementsByClassName("view-count");

                docmanager.requestDocumentModify(() => {

                    for (let i = 0; i < mainViewCount.length; i++) {
                        mainViewCount[i].setAttribute("class", "hvc-hidden");
                    }

                    for (let i = 0; i < suggestionViewCount.length; i++) {
                        suggestionViewCount[i].setAttribute("class", "hvc-hidden");
                    }

                });

                break;

            case YouTubeDOM.PAGE_HOME:
            case YouTubeDOM.PAGE_SEARCH:

                let searchViewCount = document.getElementsByClassName("yt-lockup-meta-info");

                docmanager.requestDocumentModify(() => {

                    for (let i = 0; i < searchViewCount.length; i++) {
                        searchViewCount[i].setAttribute("class", "hvc-hidden");
                    }

                });

                break;

            default:
                return;
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