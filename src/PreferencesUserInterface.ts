///<reference path="Utilities.ts"/>
class PreferencesUserInterface {

    private boolHtml : string;

    public init(setting1: Preferences, start: (setting: Preferences) => void) : void {
        Utilities.fetchLocalFile("bool-sett.html", (data: string) => {
            this.boolHtml = data;
            start(setting1);
        });

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
        container.innerHTML = "";

        title.innerHTML = module.getName();

        for (let i = 0; i < settings.length; i++) {

            let keyed = module.getUUID() + "." + settings[i].key;

            switch (settings[i].type) {

                case "bool":

                    let element = this.constructBooleanToggle(settings[i].value == "true", keyed, settings[i].title, settings[i].desc, (uuid: string, state: boolean) => {
                        callback(setting, module, uuid, !state, state.constructor);
                    });

                    container.appendChild(element);
            }

        }

    }

}