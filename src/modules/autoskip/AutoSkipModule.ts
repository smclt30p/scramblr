///<reference path="../../dom/DocumentManager.ts"/>
class AutoSkipModule extends  Module {

    private NAME = "AutoSkip";
    private DESC = "Skip known music video beginning boilerplate.";
    private UUID = "com.scramblr.autoskip";

    private settings = [
        {
            "type": "bool",
            "key": "enabled",
            "value": "false",
            "title": "Enable AutoSkip",
            "desc": "The player will skip a long intro to a known music video automatically. " +
            "If a music video is not known, please open an issue on GitHub."
        }
    ];

    private rules: object[] = null;

    private windowLocationOld : string = null;

    init(docmanager: DocumentManager, currentPage: number) {

       if (this.rules == null) {

           Utilities.fetchLocalFile("autoskip.xml", (data: string) => {

               let parser = new DOMParser();
               let xml = parser.parseFromString(data, "text/xml");
               let items = xml.getElementsByTagName("item");

               this.rules = [];

               for (let i = 0; i < items.length; i++)  {

                   this.rules.push({  "id": items[i].getAttribute("id"), "time": items[i].getAttribute("time")  });

               }

           });

       }
    }

    service(docmanager: DocumentManager, currentPage: number) {

        if (this.rules == null || YouTubeDOM.getCurrentPage() != YouTubeDOM.PAGE_VIDEO) return;

        if (window.location.search == this.windowLocationOld) {
            return;
        } else {

            this.windowLocationOld = window.location.search;


            for (let i = 0; i < this.rules.length; i++) {

                if (window.location.search.indexOf(this.rules[i]["id"]) == -1) continue;

                docmanager.lookupElement("t:video", (data: any) => {

                    if (data.length == 0) {
                        Logger.error("No video found.");
                    } else {

                        let player = <HTMLVideoElement> data[0];

                        player.currentTime = this.rules[i]["time"];

                    }

                });

            }

            Logger.verbose("Video changed!");


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

}