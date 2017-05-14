class CommentEntry {

    private root : HTMLElement;
    private selectors = {
        "author": ".comment-author-text",
        "text": ".comment-renderer-text-content"
    };

    constructor(root: HTMLElement) {
        this.root = root;
    }

    public setCommentText(text: string) : void {
        let element = this.getBySelector(this.selectors["text"]);
        if (element != null) element.innerHTML = text;
    }

    public setCommentAuthor(text: string) {
        let element = this.getBySelector(this.selectors["author"]);
        if (element != null) element.innerHTML = text;
    }

    public getCommentText() : string {
        let element = this.getBySelector(this.selectors["text"]);
        return element == null ? null : element.innerHTML;
    }

    public getCommentAuthor() : string {
        let element = this.getBySelector(this.selectors["author"]);
        return element == null ? null : element.innerHTML;
    }

    private getBySelector(selector: string) : HTMLElement {
        return <HTMLElement> this.root.querySelector(selector);
    }

}