/* Copyright 2017 (c) Ognjen Galić and Contributors.
 * All rights reserved.
 *
 * This project is licensed under the BSD 2-Clause License, which accompanies this project
 * and is available under https://opensource.org/licenses/BSD-2-Clause.
 */

const logger = new Logger();

function Main() {

    this.version = "1.0";
    this.scraper = new YoutubeDOMScraper();
    this.spadom = new SPADOM();

    this.main = function () {

        var self = this;

        logger.info("Scramblr " + this.version + " loaded");

        this.spadom.observeContent(function () {

            switch (self.scraper.getCurrentPage()) {

                case PAGES.HOME:
                    nukeTitles();
                    break;
                case PAGES.USER:
                case PAGES.CHANNEL:
                    nukeTitles();
                    break;
                case PAGES.SEARCH:
                    nukeTitles();
                    break;
                case PAGES.VIDEO:

                    self.spadom.requestDocumentModify(function () {

                        self.spadom.lookupElement("i:eow-title", function (element) {
                            element.innerHTML = "Hello, world!";
                        });

                        self.spadom.lookupElement("c:title", function (element) {
                            for (var i = 0; i < element.length; i++) {
                                element[i].innerHTML = "Hello, world!";
                            }
                        });

                        self.spadom.lookupElement("i:watch7-views-info", function (element) {
                            element.children[0].innerHTML = "Classified";
                        });

                        self.spadom.lookupElement("c:view-count", function (elements) {
                            for (var i = 0; i < elements.length; i++) {
                                elements[i].innerHTML = "Classified";
                            }
                        });

                        self.spadom.lookupElement("i:watch8-sentiment-actions", function (element) {
                            element.style.display = "none";
                        })

                    });


                    break;
                default:
                    console.log("On unknown page")
            }

        });

        nukeTitles = function () {

            self.spadom.requestDocumentModify(function () {

                self.spadom.lookupElement("c:yt-lockup-title", function (elements) {
                    for (var i = 0; i < elements.length; i++) {
                        elements[i].children[0].innerHTML = "Hello, world!";
                    }
                });

            });
        }

    }

}

function Interval() {

    this.interval = 0;
    this.counter = 0;
    this.callback = undefined;
    this.time = undefined;

    this.start = function () {
        this.interval = setInterval(this.callback, this.time);
    };

    this.cancel = function () {
        clearInterval(this.interval);
    };

    this.ping = function () {
        this.counter = this.counter + 1;
    };

    this.getCount = function () {
        return this.counter;
    };

    this.setCallback = function (callback) {
        this.callback = callback;
    };

    this.setTime = function (time) {
        this.time = time;
    }

}

/**
 * A class used for browsing and modifying the DOM on
 * single page applications.
 */
function SPADOM() {

    this.intervals = [];
    this.observer = undefined;
    this.observerConf = {subtree: true, attributes: true, childList: true, characterData: true};

    this.lookupElement = function (id, callback) {

        var interval = new Interval();
        var self = this;

        var worker = function () {

            var element = undefined;

            switch (id[0]) {

                case "c":
                    element = document.getElementsByClassName(id.substring(2));
                    break;
                case "t":
                    element = document.getElementsByTagName(id.substring(2));
                    break;
                case "i":
                    element = document.getElementById(id.substring(2));
                    break;
                default:
                    logger.error("Invalid lookup tag: " + id[0]);
                    callback(undefined);

            }

            if (element != undefined) {
                self.clearInterval(interval);
                callback(element);
            } else {
                interval.ping();
                if (interval.getCount() > 20) {
                    logger.error(id + ": lookup failed after 2 seconds");
                    self.clearInterval(interval);
                    callback(undefined);
                }
            }

        };

        interval.setCallback(worker);
        interval.setTime(100);
        this.intervals.push(interval);
        interval.start();

    };

    this.clearInterval = function (interval) {
        interval.cancel();
        this.intervals.splice(this.intervals.indexOf(interval), 1);
    };

    this.observeContent = function (callback) {

        var self = this;
        this.lookupElement("i:content", function (element) {
            self.observer = new MutationObserver(callback);
            self.observer.observe(element, self.observerConf);
            logger.info("Attached observer to page contents");
        })

    };

    this.requestDocumentModify = function (callback) {
        var self = this;
        this.observer.disconnect();
        callback();
        this.lookupElement("i:content", function (element) {
            self.observer.observe(element, self.observerConf);
        })
    }

}

/**
 * Enum of pages that are available on
 * YouTube.
 */
const PAGES = {
    VIDEO: 1,
    SEARCH: 2,
    HOME: 3,
    CHANNEL: 4,
    USER: 5,
    UNKNOWN: 6
};

function YoutubeDOMScraper() {

    const PAGE_VIDEO_PLAYING = "/watch";
    const PAGE_SEARCH_RESULTS = "/results";
    const PAGE_HOME_PAGE = "/";
    const PAGE_CHANNEL_VIEW = "/channel";
    const PAGE_USER_VIEW = "/user";

    this.getCurrentPage = function () {

        if (window.location.pathname.indexOf(PAGE_VIDEO_PLAYING) != -1) return PAGES.VIDEO;
        if (window.location.pathname.indexOf(PAGE_SEARCH_RESULTS) != -1) return PAGES.SEARCH;
        if (window.location.pathname.indexOf(PAGE_CHANNEL_VIEW) != -1) return PAGES.CHANNEL;
        if (window.location.pathname.indexOf(PAGE_USER_VIEW) != -1) return PAGES.USER;
        if (window.location.pathname == PAGE_HOME_PAGE) return PAGES.HOME;
        return PAGES.UNKNOWN;
    }

}

function Logger() {

    this.verboseLogging = true;

    this.error = function (data) {
        console.log("[%cERR%c] " + data, "color: red", "color:black");
    };

    this.info = function (data) {
        console.log("[%cINF%c] " + data, "color: #ffd000", "color:black");

    };

    this.debug = function (data) {
        console.log(data);
    };

    this.verbose = function (data) {
        if (!this.verboseLogging) return;
        console.log("[%cVRB%c] " + data, "color: green", "color:black");
    }
}

new Main().main();