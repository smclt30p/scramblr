///<reference path="QuerySelectorEntry.ts"/>
class FeedEntry extends QuerySelectorEntry {

    private selectors = {
        "title": ".yt-lockup-title > a",
        "viewcount": ".yt-lockup-meta-info > li:nth-child(2)",
        "uploader": ".yt-lockup-byline > a",
    };

    private root : HTMLElement;

    constructor(root: HTMLElement) {
        super();
        this.root = root;
    }


    setViewCount(count: string): void {
        super.setViewCount(count);

        if (count == "") {
            let element = this.root.querySelector(".yt-lockup-meta-info > li:nth-child(2)");

            if (element != null) {
                element.remove();
            }
        }

    }

    getRootElement(): HTMLElement {
        return this.root;
    }

    getSelectors(): object {
        return this.selectors;
    }

}