class HomePageEntry extends QuerySelectorEntry {

    private selectors = {
        "title": ".yt-lockup-title > a",
        "viewcount": ".yt-lockup-meta-info > li:nth-child(1)",
        "uploader": ".yt-lockup-byline > a",
    };

    private root : HTMLElement;

    constructor(root : HTMLElement) {
        super();
        this.root = root;
    }

    getRootElement(): HTMLElement {
        return this.root;
    }

    getSelectors(): object {
        return this.selectors;
    }


    setViewCount(count: string): void {

        if (count == "") {

            let dot = this.root.querySelector(".yt-lockup-meta-info > li:nth-child(2)");
            let viewsold = <HTMLElement> this.root.querySelector(this.selectors["viewcount"]);

            if (dot != null && viewsold != null) {

                let oldhtml = dot.innerHTML;
                dot.remove();
                viewsold.innerHTML = oldhtml;

            }

        }

    }
}