///<reference path="VideoEntry.ts"/>

class SearchResult implements VideoEntry {

    private innerElement : HTMLElement;

    constructor(element: Element) {
        this.innerElement = <HTMLElement> element;
    }

    getTitle(): string {
        return this.innerElement.querySelector(".yt-lockup-title > a").innerHTML;
    }

    getViewCount(): string {
        return this.innerElement.querySelector(".yt-lockup-meta-info > li:nth-child(2)").innerHTML;
    }

    getUploader(): string {
        return this.innerElement.querySelector(".yt-lockup-byline > a").innerHTML;
    }

    setTitle(title: string): void {
        let titleElement = this.innerElement.querySelector(".yt-lockup-title > a");
        if (titleElement != null) titleElement.innerHTML = title;
    }

    setViewCount(count: string): void {
        let viewCountElement = this.innerElement.querySelector(".yt-lockup-meta-info > li:nth-child(2)");
        if (viewCountElement != null) viewCountElement.innerHTML = count;
    }

    setUploader(uploader: string): void {
        let uploaderText = this.innerElement.querySelector(".yt-lockup-byline > a");
        if (uploaderText != null) uploaderText.innerHTML = uploader;
    }

    hideVideo(): void {
        this.innerElement.style.display = "none";
    }

}