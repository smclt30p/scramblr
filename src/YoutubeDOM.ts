abstract class YouTubeDOM {

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

    public static getCurrentPage(): number {

        if (window.location.pathname.indexOf(YouTubeDOM.PAGE_VIDEO_PLAYING_TOKEN) != -1) return YouTubeDOM.PAGE_VIDEO;
        if (window.location.pathname.indexOf(YouTubeDOM.PAGE_SEARCH_RESULTS_TOKEN) != -1) return YouTubeDOM.PAGE_SEARCH;
        if (window.location.pathname.indexOf(YouTubeDOM.PAGE_CHANNEL_VIEW_TOKEN) != -1) return YouTubeDOM.PAGE_CHANNEL;
        if (window.location.pathname.indexOf(YouTubeDOM.PAGE_USER_VIEW_TOKEN) != -1) return YouTubeDOM.PAGE_USER;
        if (window.location.pathname.indexOf(YouTubeDOM.PAGE_SUBSCRIBERS_TOKEN) != -1) return YouTubeDOM.PAGE_SUBSCRIPTIONS;
        if (window.location.pathname == YouTubeDOM.PAGE_HOME_PAGE_TOKEN) return YouTubeDOM.PAGE_HOME;
        return YouTubeDOM.PAGE_UNKNOWN;
    }

    public static injectUserInterface(): void {

        try {

            YouTubeDOM.injectMenuButton();

        } catch (e) {
            throw e;
        }

    };

    private static injectMenuButton(): void {

        Utilities.fetchLocalFile("settings-item.html", function (data) {

            const html = document.createRange().createContextualFragment(data).firstChild;

            let spadom = DocumentManager.getInstance();

            spadom.lookupElement("i:yt-masthead-user", function (elements) {

                html.addEventListener("click", () => {
                    window.open(Browser.getCurrentBrowserAPI().getURIFromLocalFile("settings.html"));
                });

                elements.insertBefore(html, elements.firstChild);

            });

        });
    };

    // TODO: Abstract document.getElement* operations via this class

    // private getVisibleVideoThumbnails() : HTMLCollectionOf<Element> {
    //
    //     return undefined;
    //
    // }

}