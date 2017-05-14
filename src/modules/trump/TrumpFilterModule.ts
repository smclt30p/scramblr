///<reference path="../../dom/YoutubeDOM.ts"/>
class TrumpFilterModule extends Module {

    private NAME = "Trump Filter";
    private UUID = "com.scramblr.trumpfilter";
    private DESCRIPTION = "Hides all videos from Donald Trump in the suggestions box and search results.";

    private settings = [
        {
            "type": "bool",
            "key": "enabled",
            "value": "false",
            "title": "Enable Trump Filter",
            "desc": "Hide all videos whose title contain the word 'Trump'."
        },{
            "type": "bool",
            "key": "hidewhitehouse",
            "value": "false",
            "title": "Hide all videos from the White House",
            "desc": "Hide all the White House press briefing videos from suggestions and search results."
        }
    ];

    private nono : string[] = [
        "TRUMP",
        "trump",
        "Trump"
    ];

    init(docmanager: DocumentManager, currentPage: number) {

        Logger.info("Trump Filter loaded!");

    }

    service(docmanager: DocumentManager, currentPage: number) {

        const self = this;

        docmanager.requestDocumentModify(() => {


            let videos = YouTubeDOM.getVisibleVideos();

            for (let i = 0; i < videos.length; i++) {

                if (self.containsTrump(videos[i].getTitle())) {
                    videos[i].hideVideo();
                }

                if (this.readSettingsKey("hidewhitehouse") != "false") {

                    if (videos[i].getUploader().indexOf("The White House") != -1) {
                        videos[i].hideVideo();
                    }

                }

            }

        })

    }

    private containsTrump(word: string) : boolean {

        for (let i = 0; i < this.nono.length; i++) {
            if (word.indexOf(this.nono[i]) != -1) return true;
        }

        return false;

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