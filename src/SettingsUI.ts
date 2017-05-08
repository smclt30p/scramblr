///<reference path="Utilities.ts"/>
class SettingsUI {

    private boolHtml : string;

    public init(start: () => void) : void {
        Utilities.fetchLocalFile("bool-sett.html", (data: string) => {
            this.boolHtml = data;
            start();
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


    public injectSidebarMenuItemsAndListen(modules: Module[], clickhandler: (module: Module) => void) : void {

        let list = document.getElementById("options-list");

        for (let i = 0; i < modules.length; i++) {
            let li = document.createElement("li");
            li.setAttribute("class", "options-item");
            li.setAttribute("uuid", modules[i].getUUID());
            li.innerHTML = modules[i].getName();
            li.addEventListener("click", () => {
               clickhandler(modules[i]);
            });
            list.appendChild(li);
        }

    }

    public pupulateSettingsAndListen(module: Module, callback: (uuid: string, value: any, type: Object)=> void)  {

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
                        callback(uuid, !state, state.constructor);
                    });

                    container.appendChild(element);
            }

        }

    }

    public clickFirstItemFake() {

        let elements = document.getElementsByClassName("click");

        if (elements.length == 0) {
            Logger.info("Nothing to click on...");
            return;
        }

        let evObj = document.createEvent('Events');
        evObj.initEvent("click", true, false);
        elements[0].dispatchEvent(evObj);


    }
}