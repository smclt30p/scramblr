///<reference path="Module.ts"/>
///<reference path="modules/HideViewCountModule.ts"/>
///<reference path="modules/TrumpFilterModule.ts"/>

class ModuleManager {

    private modules : Module[] = [];
    private moduleCount : number = 0;

    constructor() {

        this.modules.push(new HideViewCountModule());
        this.modules.push(new TrumpFilterModule());

    }

    public getLoadedModules() : Module[] {
        return this.modules;
    }

    readAllModuleSettings(runmain: () => void) {

        let self = this;

        for (let i = 0; i < this.modules.length; i++) {

            this.modules[i].loadAllKeys(() => {

                self.moduleCount++;

                if (self.modules.length == self.moduleCount) {
                    runmain();
                }

            });

        }

    }
}