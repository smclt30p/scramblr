///<reference path="VideoEntry.ts"/>

class Suggestion implements VideoEntry {

    private innerElement : HTMLElement;

    constructor(element: Element) {
        this.innerElement = <HTMLElement> element;
    }

    getTitle(): string {
        return this.innerElement.querySelector(".title").innerHTML;
    }

    getViewCount(): string {
        return this.innerElement.querySelector(".view-count").innerHTML;
    }

    getUploader(): string {
        return this.innerElement.querySelector(".attribution").innerHTML;
    }

    setTitle(title: string): void {
        let titleElement = this.innerElement.querySelector(".title");
        if (titleElement != null) titleElement.innerHTML = title;
    }

    setViewCount(count: string): void {
        let viewCountElement = this.innerElement.querySelector(".view-count");
        if (viewCountElement != null) viewCountElement.innerHTML = count;
    }

    setUploader(uploader: string): void {
        let uploaderText = this.innerElement.querySelector(".attribution");
        if (uploaderText != null) uploaderText.innerHTML = uploader;
    }

    hideVideo(): void {
        this.innerElement.style.display = "none";
    }

}