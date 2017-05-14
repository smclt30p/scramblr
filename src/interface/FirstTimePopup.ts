///<reference path="../compat/Browser.ts"/>
class FirstTimePopup {

    private static instance : FirstTimePopup = null;
    private shown : boolean = false;

    public static getInstance() : FirstTimePopup {
        if (FirstTimePopup.instance == null) {
            FirstTimePopup.instance = new FirstTimePopup();
        }
        return FirstTimePopup.instance;
    }

    public show() : void {

        let api = Browser.getCurrentBrowserAPI();

        api.readSetting("com.scramblr.firsttime", "true", (data: string) => {

            if (data == "true") {
                this.showPopup();
                api.writeSetting("com.scramblr.firsttime", "false");
            }

        });

    }

    public hide() : void {

        if (!this.shown) return;

        this.shown = false;

        DocumentManager.getInstance().lookupElement("i:welcome-container-hider", (element: any) => {

            element.remove();

        });

    }

    private showPopup() {

        Utilities.fetchLocalFile("first-time.html", (data: string) => {

            let body = document.getElementsByTagName("body")[0];
            let element = document.createElement("div");
            element.innerHTML = data;
            let img = element.querySelector("#welcome-img");
            if (img != null) {
                img.setAttribute("src", Browser.getCurrentBrowserAPI().getURIFromLocalFile("img/first-time.png"));
            }
            body.appendChild(element);
            this.shown = true;
        });

    }

}