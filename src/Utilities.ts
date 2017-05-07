class Utilities {

    public static fetchLocalFile(path: string, callback: (data: string) => void) {

        const url = Browser.getCurrentBrowserAPI().getURIFromLocalFile(path);
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function (data) {
            if (xhr.readyState == XMLHttpRequest.DONE && xhr.status === 200) {
                callback(xhr.responseText);
            }
        };
        xhr.send();
    };

}