///<reference path="DocumentManager.ts"/>
///<reference path="Browser.ts"/>
///<reference path="BrowserAPI.ts"/>
///<reference path="Logger.ts"/>

/**
 * This class is a template for a Scramblr module.
 *
 * A module is a piece of code that integrates
 * into Scramblr and modifies the DOM based on events
 * such as module injected/dom changed/module unloading.
 *
 * This class provides several methods that a module
 * will override and several methods for reading and
 * writing settings into the module's settings namespace.
 */
abstract class Module {

    /**
     * Count of modules whose settings have been loaded, see loadAllKeys().
     *
     * Not to be used by module developers.
     *
     * @type {number}
     */
    private settingsCount : number = 0;

    /**
     * This method is called after the whole DOM has been loaded
     * defined in the static markup received from the server.
     *
     * Use this method for initial setup of the module and the
     * DOM elements that the module needs.
     *
     * @param docmanager is for DOM modification
     * @param currentPage is to determine on what page the user was
     * when the module got loaded
     */
    abstract init(docmanager: DocumentManager, currentPage: number);

    /**
     * This method is called every time the DOM gets structurally modified,
     * such as elements being added/removed.
     *
     * Use this method to modify the DOM when a dynamic event has occurred,
     * such as when a page gets switched or more suggestions are loaded.
     *
     * @param docmanager us for DOM modification
     * @param currentPage is to determine on what page the modification
     * occurred
     */
    abstract service(docmanager: DocumentManager, currentPage: number);

    /**
     * This method is called when the module is about to be unloaded, this
     * happens then the site is undergoing the destruction phase.
     *
     * Use this method to save settings or statistics about usage.
     */
    abstract destruct();

    /**
     * Return an array of objects representing the optional settings of your module.
     *
     * The array MUST look like this and it MUST be a class field.
     *
     * private settings = [
     *     { "type":"bool", "key":"boolean_setting_1", "value":"true" },
     *     { "type":"bool", "key":"boolean_setting_1", "value":"false" },
     * ];
     *
     * Here, return the settings reference inside the object, so it would be
     * return this.settings.
     *
     */
    abstract getSettings();

    /**
     * Return the human-readable name of the module. For example: "Generic Module #1".
     *
     * This is used in the Settings interface for the name of the module.
     */
    abstract getName() : string;

    /**
     * Return a UUID of the module in a Java-style namespace/package name. For example:
     * "com.scramblr.genericmodule1".
     *
     * This is used for the settings namespace to make key/value pairs unique and to
     * identify your module uniquely inside Scramblr.
     */
    abstract getUUID() : string;

    /**
     * Read a key asynchronously from the local storage or from the settings definition
     * inside the object.
     *
     * This does the following, in order:
     *
     * 1) Try to read the key from the browser storage
     * 2) If the key is not present, call the callback with the key's default value
     * from the getSettings() object and write the key's default value to the browser
     * permanent storage.
     * 2) If the key is present inside the browser permanent storage,
     * call the callback with the key value.
     *
     * This is NOT to be used by module developers as it is async, see readSettingsKey() for
     * a synchronous solution.
     *
     * @param key the settings key to be looked up
     * @param callback the function that gets called when something is available
     */
    private atomicReadKey(key: string, callback: (data:string) => void) : void {

        let self = this;
        let UUIDKey = this.getUUID() + "." + key;

        let api : BrowserAPI = Browser.getCurrentBrowserAPI();

        Logger.verbose("Reading key: " + UUIDKey);

        let setting = api.readSetting(UUIDKey, undefined, (value:string) => {

            if (value == undefined) {

                let testValue = undefined;
                let settings = self.getSettings();

                for (let i = 0; i < settings.length; i++) {
                    if (settings[i].key == key) {
                        testValue = settings[i].value;
                    }
                }

                if (testValue == undefined) throw new Error("Value is undefined! Check key inside module!");

                Logger.verbose("Key " + UUIDKey + " occured first time, setting default to " + testValue);

                api.writeSetting(UUIDKey, testValue);

                callback(testValue);

            } else {
                Logger.verbose("Old key present, returning " + value + " for " + UUIDKey);
                callback(value);
            }

        });

    }

    /**
     * This method loads all the keys returned with atomicReadKey()
     * and overrides the class field with the value from the Browsers
     * permanent storage and calls loaded() after all keys have been
     * loaded.
     *
     * @param loaded gets called when all keys get loaded from the browsers
     * storage as defined in atomicReadKey()
     */
    public loadAllKeys(loaded: () => void) {

        let settings = this.getSettings();
        let self = this;

        Logger.verbose("Loading keys for " + self.getName());

        for (let i = 0; i < settings.length; i++) {

            this.atomicReadKey(settings[i].key, (data:string) => {

                Logger.verbose("Atomically reading " + this.getUUID() + "." + settings[i].key);

                settings[i].value = data;
                self.settingsCount++;

                if (self.settingsCount == settings.length) {
                    Logger.verbose("All keys loaded.");
                    loaded();
                }

            });

        }

    }

    /**
     * Returns the class field key value AFTER it has been overwritten with the
     * key from the permanent storage.
     *
     * So if a key has been defined inside a module and the value is "true", this
     * returns "false" if "false" is inside the module permanent storage inside the Browser.
     *
     * Use this within modules to read settings from the module.
     *
     * @param key
     * @returns {string}
     */
    protected readSettingsKey(key: string) : string {

        let temp = undefined;
        let settings = this.getSettings();

        for (let i = 0; i < settings.length; i++) {

            if (settings[i].key == key) temp = settings[i].value;

        }

        if (temp == undefined) throw new Error("Key not found in namespace " + this.getUUID() + ": " + key);

        return temp;

    }

    /**
     * Write a key into the permanent storage of the browser using the UUID of the
     * module as the namespace declaration for uniqueness.
     *
     * Use this to store permanent settings inside your module.
     *
     * NOTE: The key may be overridden by the Settings IO
     *
     * @param key the key without the namespace name, such as "enabled"
     * @param value the value for the key, such as "false"
     */
    public writeSettingsKey(key: string, value: string) : void {
        let UUIDKey = this.getUUID + "." + key;
        Browser.getCurrentBrowserAPI().writeSetting(UUIDKey, value);
    }

}