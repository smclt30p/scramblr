///<reference path="VideoEntry.ts"/>
///<reference path="QuerySelectorEntry.ts"/>

class SuggestionEntry extends QuerySelectorEntry {

    private selectors = {
        "title": ".title",
        "viewcount": ".view-count",
        "uploader":".attribution",
    };

    private innerElement : HTMLElement;

    constructor(element: Element) {
        super();
        this.innerElement = <HTMLElement> element;
    }

    getRootElement(): HTMLElement {
        return this.innerElement;
    }

    getSelectors(): object {
        return this.selectors;
    }


}