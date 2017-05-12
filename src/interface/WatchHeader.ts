///<reference path="../exception/NotImplementedException.ts"/>

class WatchHeader extends QuerySelectorEntry {

    private selectors = {
        "title": "#eow-title",
        "viewcount": ".watch-view-count",
        "uploader": ".yt-user-info > a",
    };

    private watchHeaderElement : HTMLElement;

    constructor(element: HTMLElement) {
        super();
        this.watchHeaderElement = element;
    }

    getRootElement(): HTMLElement {
        return this.watchHeaderElement;
    }

    getSelectors(): Object {
        return this.selectors;
    }

    getLikes() : string {
        return this.watchHeaderElement.querySelector(".like-button-renderer-like-button > span").innerHTML;
    }

    getDislikes() : string {
        return this.watchHeaderElement.querySelector(".like-button-renderer-dislike-button > span").innerHTML;
    }

    setLikes(number: string) : void {

        let container = this.watchHeaderElement.querySelector(".like-button-renderer");

        if (container == null) return;

        for (let i = 0; i < container.childElementCount / 2; i++) {

            let numcont = container.children[i].querySelector("span > button > span");

            if (numcont != null) {
                numcont.innerHTML = number;
            }

        }

    }

    setDislikes(number: string) : void {

        let container = this.watchHeaderElement.querySelector(".like-button-renderer");

        if (container == null) return;

        for (let i = 0; i < container.childElementCount / 2; i++) {

            let numcont = container.children[i + 2].querySelector("span > button > span");

            if (numcont != null) {
                numcont.innerHTML = number;
            }

        }

    }

    hideVideo(): void {
        throw new NotImplementedException("Not supported.");
    }


}