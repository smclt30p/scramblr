abstract class QuerySelectorEntry implements VideoEntry {


    getTitle(): string {
        let element = this.getRootElement().querySelector(this.getSelectors()["title"]);
        return element == null ? null : element.innerHTML;
    }

    getViewCount(): string {
        let element = this.getRootElement().querySelector(this.getSelectors()["viewcount"]);
        return element == null ? null : element.innerHTML;
    }

    getUploader(): string {
        let element = this.getRootElement().querySelector(this.getSelectors()["uploader"]);
        return element == null ? null : element.innerHTML;
    }

    setTitle(title: string): void {
        let titleElement = <HTMLElement> this.getRootElement().querySelector(this.getSelectors()["title"]);
        if (titleElement != null) titleElement.innerHTML = title;
    }

    setViewCount(count: string): void {
        let viewCountElement = <HTMLElement> this.getRootElement().querySelector(this.getSelectors()["viewcount"]);
        if (viewCountElement != null) viewCountElement.innerHTML = count;
    }

    setUploader(uploader: string): void {
        let uploaderText = <HTMLElement> this.getRootElement().querySelector(this.getSelectors()["uploader"]);
        if (uploaderText != null) uploaderText.innerHTML = uploader;
    }

    hideVideo(): void {
        this.getRootElement().remove();
    }

    abstract getRootElement() : HTMLElement;
    abstract getSelectors() : object;

}
