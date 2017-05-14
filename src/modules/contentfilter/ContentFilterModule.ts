///<reference path="../../interface/video/VideoEntry.ts"/>
///<reference path="../../dom/YoutubeDOM.ts"/>
///<reference path="CommaParser.ts"/>
class ContentFilterModule extends Module {

    private NAME = "Content Filter";
    private DESC = "This module allows you to hide channels and videos based on the uploader or the title.";
    private UUID = "com.scramblr.contentfilter";

    private settings = [
        {
            "type": "bool",
            "key": "enabled",
            "value": "false",
            "title": "Enable the Content Filter",
            "desc": "This module allows you to hide videos by channel and video title."
        },{
            "type": "bool",
            "key": "ignorecase",
            "value": "false",
            "title": "Ignore case for items",
            "desc": "Makes the filter tokens case-insensitive."
        },{
            "type": "bool",
            "key": "child",
            "value": "false",
            "title": "Child filter mode",
            "desc": "Inverts the polarity of the filter to work the opposite, only allowing what is specified to show up."
        },{
            "type": "str",
            "key": "channels",
            "value": "",
            "title": "List of blocked channels",
            "desc": "A comma-separated list of blocked channels."
        },{
            "type": "str",
            "key": "black",
            "value": "",
            "title": "List of blocked words for titles",
            "desc": "A comma-separated list of words to look for inside titles and hide the videos."
        }
    ];

    private channelTokens = [];
    private titleTokens = [];
    private ignorecase : boolean;
    private childmode : boolean;

    init(docmanager: DocumentManager, currentPage: number) {

        this.channelTokens = CommaParser.parse(this.readSettingsKey("channels"));
        this.titleTokens = CommaParser.parse(this.readSettingsKey("black"));

        Logger.info("Loaded filter tokens:");

        console.log(this.channelTokens);
        console.log(this.titleTokens);

        this.ignorecase = this.readSettingsKey("ignorecase") == "true";
        this.childmode = this.readSettingsKey("child") == "true";

    }

    service(docmanager: DocumentManager, currentPage: number) {

        let videos : VideoEntry[] = YouTubeDOM.getVisibleVideos();

        for (let i = 0; i < videos.length; i++) {
            if (this.isVideoBlocked(videos[i])) {
                videos[i].hideVideo();
            }
        }

    }

    destruct() {
    }

    getSettings() : object {
        return this.settings;
    }

    getName(): string {
        return this.NAME;
    }

    getDescription(): string {
        return this.DESC;
    }

    getUUID(): string {
        return this.UUID;
    }

    private isVideoBlocked(video: VideoEntry) : boolean {

        let uploader = video.getUploader();
        let title = video.getTitle();

        if (this.ignorecase) {
            uploader = uploader.toUpperCase();
            title = title.toUpperCase();
        }

        for (let i = 0; i < this.titleTokens.length; i++) {

            let test = this.titleTokens[i];

            if (this.ignorecase) {
                test = test.toUpperCase();
            }

            if (title.indexOf(test) != -1) return !this.childmode;
        }

        for (let i = 0; i < this.channelTokens.length; i++) {

            let test2 = this.channelTokens[i];

            if (this.ignorecase) {
                test2 = test2.toUpperCase();
            }

            if (uploader.indexOf(test2) != -1) return !this.childmode;
        }

        return this.childmode;
    }
}