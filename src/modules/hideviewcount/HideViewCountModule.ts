///<reference path="../Module.ts"/>
///<reference path="../../dom/YoutubeDOM.ts"/>
///<reference path="../../common/Logger.ts"/>

class HideViewCountModule extends Module {

    private NAME = "Hide View Count (HVC)";
    private UUID = "com.scramblr.hideviewcount";
    private DESCRIPTION = "This module hides all view counters from YouTube making every video equal.";

    private settings = [
        {
            "type": "bool",
            "key": "enabled",
            "value": "true",
            "title": "Enable HVC",
            "desc": "Hide all view counts globally across YouTube."
        },
        {
            "type": "bool",
            "key": "hideLikes",
            "value": "false",
            "title": "Hide like/dislike counter",
            "desc": "Hide the like and dislike counter to restrict perspective of view count."
        }
    ];

    init(docmanager: DocumentManager, currentPage: number) {

        Logger.info("HideViewCount loaded!");

    }

    service(docmanager: DocumentManager, currentPage: number) {

        /* Determine the current page that the user is looking at */
        switch (currentPage) {

            /* The user is viewing a video */
            case YouTubeDOM.PAGE_VIDEO:

                docmanager.requestDocumentModify(() => {

                    let videos = YouTubeDOM.getVisibleVideos();

                    for (let i = 0; i < videos.length; i++) {
                        videos[i].setViewCount("");
                    }

                    let header = YouTubeDOM.getWatchHeader();

                    if (header != null) {
                        header.setViewCount("");

                        if (this.readSettingsKey("hideLikes") != "false") {

                            header.setDislikes("Dislike");
                            header.setLikes("Like");
                        }
                    }

                });

                break;

            case YouTubeDOM.PAGE_HOME:
            case YouTubeDOM.PAGE_SEARCH:

                let videos = YouTubeDOM.getVisibleVideos();

                for (let i = 0; i < videos.length; i++) {
                    videos[i].setViewCount("");
                }


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

    getDescription(): string {
        return this.DESCRIPTION;
    }

}