class WatchHeader implements VideoEntry {

    private watchHeaderElement : Element;

    constructor(element: Element) {
        this.watchHeaderElement = element;
    }

    getTitle(): string {
        return this.watchHeaderElement.querySelector("#eow-title").innerHTML;
    }

    getViewCount(): string {
        return this.watchHeaderElement.querySelector(".watch-view-count").innerHTML;
    }

    getUploader(): string {
        return this.watchHeaderElement.querySelector(".yt-user-info > a").innerHTML;
    }

    getLikes() : string {
        return this.watchHeaderElement.querySelector(".like-button-renderer-like-button > span").innerHTML;
    }

    getDislikes() : string {
        return this.watchHeaderElement.querySelector(".like-button-renderer-dislike-button > span").innerHTML;
    }

    setTitle(title: string): void {
        let titleElement = this.watchHeaderElement.querySelector("#eow-title");
        if (titleElement != null) titleElement.innerHTML = title;
    }

    setViewCount(count: string): void {
        let viewCountElement = this.watchHeaderElement.querySelector(".watch-view-count");
        if (viewCountElement != null) viewCountElement.innerHTML = count;
    }

    setUploader(uploader: string): void {
        let uploaderElement = this.watchHeaderElement.querySelector(".yt-user-info > a");
        if (uploaderElement != null) uploaderElement.innerHTML = uploader;
    }

    setLikes(number: string) : void {
        let likesElement = this.watchHeaderElement.querySelector(".like-button-renderer-like-button > span");
        if (likesElement != null) likesElement.innerHTML = number;
    }

    setDislikes(number: string) : void {
        let dislikesElement = this.watchHeaderElement.querySelector(".like-button-renderer-dislike-button > span");
        if (dislikesElement != null) dislikesElement.innerHTML = number;
    }


}