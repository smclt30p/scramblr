///<reference path="ModuleManager.ts"/>
///<reference path="Utilities.ts"/>
///<reference path="SettingsUI.ts"/>
///<reference path="Browser.ts"/>
class Setting {

    private modulemanager : ModuleManager;
    private modules : Module[];
    private settingsui : SettingsUI;

    constructor() {
        this.modulemanager = new ModuleManager();
        this.modules = this.modulemanager.getLoadedModules();
        this.settingsui = new SettingsUI();
    }

    public main() : void {

        const self = this;
        const api = Browser.getCurrentBrowserAPI();


        /* First initialize the Settings UI core HTML elements */
        this.settingsui.init(() => {

            /* Next, add all the items to the left
             * side bar and attach a click listener
            */
            this.settingsui.injectSidebarMenuItemsAndListen(this.modules, (module: Module) => {

                /* Read all settings from all modules */
                this.modulemanager.readAllModuleSettings(() => {

                    /* Attach a click listener to a module's setting and handle it here */
                    self.settingsui.pupulateSettingsAndListen(module, (uuid: string, value: any, type: object) => {

                        /* hande a module's setting being changed */
                        switch (type) {

                            case Boolean:
                                Logger.verbose("Setting " + uuid + " to " + value);
                                api.writeSetting(uuid, value.toString());
                                break;
                            default:
                                Logger.error("Unknown setting type: " + type);
                                return;

                        }

                    });
                });


            });

            this.settingsui.clickFirstItemFake();

        });

    }

}

new Setting().main();