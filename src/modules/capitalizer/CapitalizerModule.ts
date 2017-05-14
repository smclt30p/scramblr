///<reference path="../../dom/YoutubeDOM.ts"/>
///<reference path="../../interface/video/VideoEntry.ts"/>
class CapitalizerModule extends Module {

    private NAME = "Capitalizer";
    private DESC = "Transform all-caps titles to first-letter-capitalized";
    private UUID = "com.scramblr.capitalizer";

    private settings = [
        {
            "type": "bool",
            "key": "enabled",
            "value": "false",
            "title": "Enable Capitalizer",
            "desc": "Enable the transform. All titles will be fixed around YouTube."
        }
    ];

    init(docmanager: DocumentManager, currentPage: number) {
    }

    service(docmanager: DocumentManager, currentPage: number) {

        let videos : VideoEntry[] = YouTubeDOM.getVisibleVideos();

        docmanager.requestDocumentModify(() => {


            for (let i = 0; i < videos.length; i++) {
                videos[i].setTitle(this.transform(videos[i].getTitle()));
            }


            if (YouTubeDOM.getCurrentPage() == YouTubeDOM.PAGE_VIDEO) {

                let header : WatchHeader = YouTubeDOM.getWatchHeader();

                if (header != null) {
                    header.setTitle(this.transform(header.getTitle()));
                }

            }


        });

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

    private transform(title: string) : string {

        let words : string[] = title.split(" ");
        let temp = "";
        let tempWord = "";

        for (let i = 0; i < words.length; i++) {
            tempWord = words[i].toLowerCase();
            tempWord = tempWord.charAt(0).toUpperCase() + tempWord.slice(1);
            temp += tempWord + " ";
        }

        return temp;
    }

}