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
            "value": "false",
            "title": "Enable HVC",
            "desc": "Hide all view counts globally across YouTube."
        },
        {
            "type": "bool",
            "key": "hideLikes",
            "value": "false",
            "title": "Hide like/dislike counter",
            "desc": "Hide the like and dislike counter to restrict perspective of view count."
        },{
            "type": "bool",
            "key": "hideSpark",
            "value": "false",
            "title": "Hide the SparkBar",
            "desc": "Hide the like and dislike ratio bar AKA SparkBar"
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

                    if (this.readSettingsKey("hideSpark") != "false") {

                        let sparkbar =  document.getElementsByClassName("video-extras-sparkbars");

                        for (let j = 0; j < sparkbar.length; j++) {
                            sparkbar[j].setAttribute("style", "display: none");
                        }

                    }

                });

                break;

            case YouTubeDOM.PAGE_SUBSCRIPTIONS:
            case YouTubeDOM.PAGE_HOME:
            case YouTubeDOM.PAGE_SEARCH:


                let videos = YouTubeDOM.getVisibleVideos();

                for (let i = 0; i < videos.length; i++) {
                    videos[i].setViewCount("");
                }


                break;

            case YouTubeDOM.PAGE_USER:
            case YouTubeDOM.PAGE_CHANNEL:

                let views = document.getElementsByClassName("yt-lockup-meta-info");
                let views2 = document.getElementsByClassName("count");

                docmanager.requestDocumentModify(() => {

                    for (let i = 0; i < views.length; i++) {
                        views[i].innerHTML = "";
                    }


                    for (let i = 0; i < views2.length; i++) {
                        views2[i].innerHTML = "";
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

    getDescription(): string {
        return this.DESCRIPTION;
    }

}