/// <reference path="logger.ts"/>
/// <reference path="gui.ts"/>

class Main {

    private spadom: DocumentManager;
    private ytdom: YouTubeDOM;

    public main(): void {

        Logger.info("Scramblr v1.0 loaded!");

        this.spadom = DocumentManager.getInstance();
        this.ytdom = new YouTubeDOM();

        try {
            this.ytdom.inject();
        } catch (e) {
            Logger.error("Error injecting interface to YouTube DOM: " + e.message);
            return;
        }


        this.spadom.observeContent(() => {

            switch (this.ytdom.getCurrentPage()) {

                case YouTubeDOM.PAGE_HOME:
                    Logger.verbose("On home page");
                    break;
                case YouTubeDOM.PAGE_VIDEO:
                    Logger.verbose("On video page");
                    break;
                case YouTubeDOM.PAGE_USER:
                case YouTubeDOM.PAGE_CHANNEL:
                    Logger.verbose("On user page");
                    break;
                case YouTubeDOM.PAGE_SEARCH:
                    Logger.verbose("On search page");
                    break;
                case YouTubeDOM.PAGE_SUBSCRIPTIONS:
                    Logger.verbose("On subscriptions page!");
                    break;
                default:
                    break;

            }

        });

    }
}


new Main().main();