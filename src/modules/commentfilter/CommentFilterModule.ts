///<reference path="../Module.ts"/>
///<reference path="../contentfilter/CommaParser.ts"/>

class CommentFilterModule extends Module {

    private NAME = "Comment Filter";
    private DESC = "This module is for advanced comment filtering.";
    private UUID = "com.scramblr.commentfilter";

    private settings = [
        {
            "type": "bool",
            "key": "enabled",
            "value": "false",
            "title": "Enable the Comment Filter",
            "desc": "This module allows you to hide comments by commenter or comment contents."
        },{
            "type": "bool",
            "key": "strict",
            "value": "false",
            "title": "Enable strict mode",
            "desc": "Strict mode does an index search, the default behaviour is equality matching. This " +
            "will filter comments more aggressively but may trigger false positives. (ex. \"ass\" in \"bass\")"
        },{
            "type": "str",
            "key": "bannedWords",
            "value": "",
            "title": "Banned phrases inside comments",
            "desc": "A comma-separated list of strings which may not appear inside comments."
        },{
            "type": "str",
            "key": "bannedUsers",
            "value": "",
            "title": "Banned users",
            "desc": "A comma-separated list of users whose comments shall be hidden."
        }
    ];

    private bannedWords : string[];
    private bannedUsers : string[];
    private strict : boolean;

    init(docmanager: DocumentManager, currentPage: number) {

        this.bannedWords = CommaParser.parse(this.readSettingsKey("bannedWords"));
        this.bannedUsers = CommaParser.parse(this.readSettingsKey("bannedUsers"));
        this.strict = this.readSettingsKey("strict") == "true";

        Logger.info("Loaded comment filter: ");

        console.log(this.bannedUsers);
        console.log(this.bannedWords);

    }

    service(docmanager: DocumentManager, currentPage: number) {

        if (currentPage != YouTubeDOM.PAGE_VIDEO) return;

        let comments = YouTubeDOM.getVisisbleComments();

        docmanager.requestDocumentModify(() => {

            for (let i = 0; i < comments.length; i++) {

                if (this.commentIsForbidden(comments[i])) {
                    comments[i].setCommentText(this.generateHidden());
                }

            }

        });

    }

    destruct() {
    }

    getSettings() : object {
        return this.settings;
    }

    getName(): string {
        return this.NAME;
    }

    getDescription(): string {
        return this.DESC;
    }

    getUUID(): string {
        return this.UUID;
    }

    private generateHidden() : string {

        let element = document.createElement("p");
        element.setAttribute("style", "font-style: italic;");
        element.innerHTML = "Comment Hidden";
        return element.outerHTML;

    }

    private commentIsForbidden(comment: CommentEntry) : boolean {

        for (let i = 0; i < this.bannedUsers.length; i++) {
            if (comment.getCommentAuthor().toLowerCase() == this.bannedUsers[i].toLowerCase()) return true;
        }

        if (this.strict) {

            for (let i = 0; i < this.bannedWords.length; i++) {
                if (comment.getCommentText().toLowerCase().indexOf(this.bannedWords[i].toLowerCase()) != -1) return true;
            }

        } else {

            let words : string[] = comment.getCommentText().split(" ");

            for (let i = 0; i < words.length; i++) {
                for (let j = 0; j < this.bannedWords.length; j++) {
                    if (words[i] == this.bannedWords[j]) return true;
                }
            }

        }

        return false;
    }
}