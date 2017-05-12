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

        this.settingsui.init(this, this.loadModulesToInterface);
        this.settingsui.attachSidebarClickListeners(this, this.sideItemChanged);

    }

    private loadModulesToInterface(self: Preferences) : void {

        for (let i = 0; i < self.modules.length; i++) {

            self.modules[i].loadAllKeys(() => {

                self.settingsui.injectSettings(self, self.modules[i], self.settingChanged);
                self.settingsui.switchToSettings();

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

    private sideItemChanged(self : Preferences, action: string) : void {

        switch (action) {

            case "action-options":
                self.switchToSettings();
                break;
            case "action-donate":
                self.switchToDonate();
                break;
            case "action-about":
                self.switchToAbout();
                break;
            default:
                Logger.error("Unknown action: " + action);
        }

    }

    private switchToSettings() : void {
        this.settingsui.switchToSettings();
    }

    private switchToDonate()  : void {
        this.settingsui.switchToDonate();
    }

    private switchToAbout()  : void {
        this.settingsui.switchToAbout();
    }

}

const setting: Preferences = new Preferences();
setting.main();
