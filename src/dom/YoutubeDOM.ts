///<reference path="../interface/video/VideoEntry.ts"/>
///<reference path="../interface/video/SuggestionEntry.ts"/>
///<reference path="../interface/WatchHeader.ts"/>
///<reference path="../interface/video/SearchResultEntry.ts"/>
///<reference path="../interface/video/HomePageEntry.ts"/>
///<reference path="../interface/video/FeedEntry.ts"/>
///<reference path="../interface/video/FeedEntryGrid.ts"/>
///<reference path="../interface/CommentEntry.ts"/>
///<reference path="../interface/FirstTimePopup.ts"/>
abstract class YouTubeDOM {

    private static PAGE_VIDEO_PLAYING_TOKEN: string = "/watch";
    private static PAGE_SEARCH_RESULTS_TOKEN: string = "/results";
    private static PAGE_HOME_PAGE_TOKEN: string = "/";
    private static PAGE_CHANNEL_VIEW_TOKEN: string = "/channel";
    private static PAGE_USER_VIEW_TOKEN: string = "/user";
    private static PAGE_SUBSCRIBERS_TOKEN: string = "/feed";

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
            FirstTimePopup.getInstance().show();

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
                    FirstTimePopup.getInstance().hide();
                });

                elements.insertBefore(html, elements.firstChild);

            });

        });
    };

    // TODO: Abstract all document.getElement* operations via this class

   public static getVisibleVideos() : VideoEntry[] {

       let ret : VideoEntry[] = [];

       switch (YouTubeDOM.getCurrentPage()) {


           case YouTubeDOM.PAGE_VIDEO:

               let suggestions = document.getElementsByClassName("related-list-item");

               for (let i = 0; i < suggestions.length; i++) {
                   ret.push(new SuggestionEntry(suggestions[i]));
               }

               break;

           case YouTubeDOM.PAGE_SEARCH:

               let results = document.getElementsByClassName("yt-lockup-video");

               for (let i = 0; i < results.length; i++) {
                   ret.push(new SearchResultEntry(results[i]));
               }

               break;

           case YouTubeDOM.PAGE_HOME:

               let homepage = document.getElementsByClassName("yt-shelf-grid-item");

               for (let i = 0; i < homepage.length; i++) {
                   ret.push(new HomePageEntry( <HTMLElement> homepage[i]));
               }

               break;

           case YouTubeDOM.PAGE_SUBSCRIPTIONS:

               let items = document.getElementsByClassName("feed-item-container");
               let items2 = document.getElementsByClassName("expanded-shelf-content-item-wrapper");
               let items3 = document.getElementsByClassName("yt-shelf-grid-item");

               for (let i = 0; i < items.length; i++) {
                   ret.push(new FeedEntry( <HTMLElement> items[i]));
               }

               for (let i = 0; i < items2.length; i++) {
                   ret.push(new FeedEntry( <HTMLElement> items2[i]));
               }

               for (let i = 0; i < items3.length; i++) {
                   ret.push(new FeedEntryGrid( <HTMLElement> items3[i]));
               }

       }

       return ret;

   }

   public static getWatchHeader() : WatchHeader {
       let watch = document.getElementById("watch-header");
       if (watch == undefined) return null;
       return new WatchHeader(watch);
   }


   public static getVisisbleComments() : CommentEntry[] {

        let ret : CommentEntry[] = [];
        let comments = document.getElementsByClassName("comment-renderer-content");
        for (let i = 0; i < comments.length; i++) {
            ret.push(new CommentEntry(<HTMLElement> comments[i]));
        }
        return ret;
   }

}