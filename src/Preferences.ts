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

        for (let i = 0; i < self.modules.length; i++) {

            self.modules[i].loadAllKeys(() => {

                self.settingsui.injectSettings(self, self.modules[i], self.settingChanged);

            });

        }

    }

    private settingChanged(self: Preferences, module: Module, uuid: string, value: any, type: object) : void {

        const api = Browser.getCurrentBrowserAPI();

        switch (type) {

            case Boolean:
                api.writeSetting(uuid, value.toString());
                break;

            case String:
                api.writeSetting(uuid, value);
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
