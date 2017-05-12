///<reference path="VideoEntry.ts"/>

class SearchResultEntry extends QuerySelectorEntry {

    private selectors = {
        "title": ".yt-lockup-title > a",
        "viewcount": ".yt-lockup-meta-info > li:nth-child(2)",
        "uploader": ".yt-lockup-byline > a",
    };

    private innerElement : HTMLElement;

    constructor(element: Element) {
        super();
        this.innerElement = <HTMLElement> element;
    }

    getRootElement(): HTMLElement {
        return this.innerElement;
    }

    getSelectors(): Object {
        return this.selectors;
    }

    setViewCount(count: string): void {
        let viewCountElement = this.innerElement.querySelector(".yt-lockup-meta-info > li:nth-child(2)");
        if (viewCountElement != null) {
            if (count == "") {
                viewCountElement.remove();
            } else {
                viewCountElement.innerHTML = count;
            }
        }
    }

}