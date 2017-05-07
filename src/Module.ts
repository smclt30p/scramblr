///<reference path="DocumentManager.ts"/>
interface Module {

    init(docmanager: DocumentManager, currentPage: number);
    service(docmanager: DocumentManager, currentPage: number);
    destruct();

    getSettings();
    getName() : string;

}