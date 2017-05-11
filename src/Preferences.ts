///<reference path="ModuleManager.ts"/>
///<reference path="Utilities.ts"/>
///<reference path="PreferencesUserInterface.ts"/>
///<reference path="Browser.ts"/>
///<reference path="Logger.ts"/>

class Preferences {

    private  modulemanager : ModuleManager;
    private modules : Module[];
    private settingsui : PreferencesUserInterface = new PreferencesUserInterface();

    constructor() {
        this.modulemanager = new ModuleManager();
        this.modules = this.modulemanager.getLoadedModules();
    }

    public main() : void {

        this.settingsui.init(this, this.loadModules);

    }

    private loadModules(self: Preferences) : void {

        self.settingsui.populateSidebar(self, self.modules, self.moduleSidebarClicked);

    }

    private moduleSidebarClicked(self: Preferences, module: Module) : void {

        module.loadAllKeys(() => {
            self.settingsui.injectSettings(self, module, self.settingChanged);

        });

    }

    private settingChanged(self: Preferences, module: Module, uuid: string, value: any, type: object) : void {

        const api = Browser.getCurrentBrowserAPI();

        switch (type) {

            case Boolean:
                api.writeSetting(uuid, value.toString());
                break;
            default:
                Logger.error("Unknown setting type: " + type);
                return;

        }

        module.loadAllKeys(() => {});

    }

}

const setting: Preferences = new Preferences();
setting.main();
