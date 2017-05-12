interface VideoEntry {
    getTitle() : string;
    getViewCount() : string;
    getUploader() : string;
    setTitle(title: string) : void;
    setViewCount(count: string) : void;
    setUploader(uploader: string) : void;
    hideVideo() : void;
}