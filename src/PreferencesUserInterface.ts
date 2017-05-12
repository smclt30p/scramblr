///<reference path="Utilities.ts"/>
class PreferencesUserInterface {

    private boolHtml : string;
    private strElem : string;
    private moduleHtml : string;

    private elements: number = 0;

    private settingsContainer : HTMLElement;
    private aboutContainer: HTMLElement;
    private donateContainer : HTMLElement;

    constructor() {
        this.settingsContainer = document.getElementById("settings-container");
        this.aboutContainer = document.getElementById("about-container");
        this.donateContainer = document.getElementById("donate-container");
    }

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

        Utilities.fetchLocalFile("module.html", (data: string) => {
            Logger.verbose("Fetching module");
            self.moduleHtml = data;
            self.conditionalStart(setting1, start);
        });

    }

    private conditionalStart(settings: Preferences, start: (preferences: Preferences) => void) : void {

        this.elements++;

        if (this.elements == 3) {
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
        elem = elem.replace("%BOOL_DESC%", description);
        element.innerHTML = elem;

        let label = element.children[0].children[0];
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

    public injectSettings(setting: Preferences, module: Module,
                          callback: (setting1: Preferences, module: Module, uuid: string, value: any, type: Object)=> void)  {


        let moduleElement = this.createModuleElement(module.getName(), module.getDescription());
        let moduleSettingsContainer = moduleElement.children[0].children[1].children[1];
        let settingsContainer = document.getElementById("settings-container-inject");


        let settings = module.getSettings();

        for (let i = 0; i < settings.length; i++) {

            let key = module.getUUID() + "." + settings[i].key;
            let value = settings[i].value;
            let desc = settings[i].desc;
            let title = settings[i].title;
            let type = settings[i].type;

            switch (type) {

                case "bool":

                    let elementBool = this.constructBooleanToggle(value == "true", key, title, desc, (uuid: string, value: boolean) => {
                        callback(setting, module, uuid, value, value.constructor);
                    });

                    moduleSettingsContainer.appendChild(elementBool);
                    break;

                case "str":

                    let elementString = this.constructStringSetting(value, key, title, desc, (uuid: string, value: string) => {
                        callback(setting, module, uuid, value, value.constructor);
                    });

                    moduleSettingsContainer.appendChild(elementString);
                    break;
            }

        }


        settingsContainer.appendChild(moduleElement);

    }

    private createModuleElement(name: string, desc: string) : HTMLElement  {
        let tempElement = document.createElement("div");
        tempElement.innerHTML =
            this.moduleHtml
            .replace("%MODULE_NAME%", name)
            .replace("%MODULE_DESC%", desc);
        return tempElement;
    }

    public attachSidebarClickListeners(back: Preferences, click: (back1: Preferences, action: string) => void) : void {
        let items = document.getElementsByClassName("options-item");
        for (let i = 0; i < items.length; i++) {
            items[i].addEventListener("click", () => {
                click(back, items[i].getAttribute("click"));
            });
        }
    }

    public switchToAbout() : void {
        this.aboutContainer.style.display = "block";
        this.donateContainer.style.display = "none";
        this.settingsContainer.style.display = "none";
    }

    public switchToSettings() : void {
        this.aboutContainer.style.display = "none";
        this.donateContainer.style.display = "none";
        this.settingsContainer.style.display = "block";
    }

    public switchToDonate() : void {
        this.aboutContainer.style.display = "none";
        this.donateContainer.style.display = "block";
        this.settingsContainer.style.display = "none";
    }
}