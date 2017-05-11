///<reference path="Utilities.ts"/>
class PreferencesUserInterface {

    private boolHtml : string;
    private strElem : string;

    private elements: number = 0;

    public init(setting1: Preferences, start: (setting: Preferences) => void) : void {

        const self = this;

        Utilities.fetchLocalFile("bool-sett.html", (data: string) => {
            Logger.verbose("Fetching bool-sett");
            self.boolHtml = data;
            self.conditionalStart(setting1, start);
        });

        Utilities.fetchLocalFile("str-sett.html", (data: string) => {
            Logger.verbose("Fetching str-sett");
            self.strElem = data;
            self.conditionalStart(setting1, start);
        });

    }

    private conditionalStart(settings: Preferences, start: (preferences: Preferences) => void) : void {

        this.elements++;

        if (this.elements == 2) {
            Logger.verbose("Resource loading complete");
            start(settings);
        } else {
            Logger.verbose("Resources not loaded yet, loaded: " + this.elements);
        }

    }

    private constructBooleanToggle(def: boolean ,uuid: string, title: string, description: string,
                                   stateChanged: (uuid: string, value: boolean) => void) : HTMLElement {

        let element = document.createElement("div");

        let elem = this.boolHtml.replace("%BOOL_ID%", uuid);
        elem = elem.replace("%BOOL_ID%", uuid);
        elem = elem.replace("%BOOL_TITLE%", title);
        elem = elem.replace("%BOOL_TITLE%", description);
        element.innerHTML = elem;

        let label = element.children[0].children[0].children[1];
        let checkbox = <HTMLInputElement> element.children[0].children[0].children[0];

        label.addEventListener("click", () => {
            stateChanged(uuid, checkbox.checked);
        });

        checkbox.checked = def;

        return element;
    }

    private constructStringSetting(def: string, uuid: string, title: string, description: string,
                                   stateChanged: (uuid: string, value: string) => void) : HTMLElement {

        let element = document.createElement("div");

        let elem = this.strElem.replace("%STR_TITLE%", title);
        elem = elem.replace("%STR_ID%", uuid);
        elem = elem.replace("%STR_DESC%", description);
        elem = elem.replace("%STR_DEF%", def);
        element.innerHTML = elem;

        let input = <HTMLInputElement> element.children[0].children[1];

        input.addEventListener("input", () => {
            stateChanged(uuid, input.value);
        });

        return element;

    }


    public populateSidebar(setting: Preferences, modules: Module[],
                           clickhandler: (setting1: Preferences, module: Module) => void) : void {

        let list = document.getElementById("options-list");

        for (let i = 0; i < modules.length; i++) {
            let li = document.createElement("li");
            li.setAttribute("class", "options-item");
            li.setAttribute("uuid", modules[i].getUUID());
            li.innerHTML = modules[i].getName();
            li.addEventListener("click", () => {
               clickhandler(setting,modules[i]);
            });
            list.appendChild(li);
        }

    }

    public injectSettings(setting: Preferences, module: Module, callback: (setting1: Preferences, module: Module, uuid: string, value: any, type: Object)=> void)  {

        let title = document.getElementById("settings-cont-title");
        let settings = module.getSettings();
        let container = document.getElementById("settings-container");

        title.innerHTML = module.getName();

        for (let i = 0; i < settings.length; i++) {

            let keyed = module.getUUID() + "." + settings[i].key;

            switch (settings[i].type) {

                case "bool":

                    let elementbool = this.constructBooleanToggle(settings[i].value == "true", keyed,
                        settings[i].title, settings[i].desc, (uuid: string, state: boolean) => {

                        callback(setting, module, uuid, !state, state.constructor);

                    });

                    container.appendChild(elementbool);

                    break;

                case "str":

                    let elementstr = this.constructStringSetting(settings[i].value, keyed, settings[i].title,
                        settings[i].desc, (uuid: string, value: string) => {

                        callback(setting, module, uuid, value, value.constructor);

                    });

                    container.appendChild(elementstr);
            }

        }

    }

}