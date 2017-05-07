///<reference path="DocumentManager.ts"/>
///<reference path="Browser.ts"/>
///<reference path="BrowserAPI.ts"/>
///<reference path="Logger.ts"/>

abstract class Module {

    private settingsCount : number = 0;

    abstract init(docmanager: DocumentManager, currentPage: number);
    abstract service(docmanager: DocumentManager, currentPage: number);
    abstract destruct();

    abstract getSettings();
    abstract getName() : string;
    abstract getUUID() : string;

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

    protected readSettingsKey(key: string) : string {

        let temp = undefined;
        let settings = this.getSettings();

        for (let i = 0; i < settings.length; i++) {

            if (settings[i].key == key) temp = settings[i].value;

        }

        if (temp == undefined) throw new Error("Key not found in namespace " + this.getUUID() + ": " + key);

        return temp;

    }

    public writeSettingsKey(key: string, value: string) : void {
        let UUIDKey = this.getUUID + "." + key;
        Browser.getCurrentBrowserAPI().writeSetting(UUIDKey, value);
    }

}