///<reference path="Module.ts"/>
///<reference path="hideviewcount/HideViewCountModule.ts"/>
///<reference path="trump/TrumpFilterModule.ts"/>
///<reference path="contentfilter/ContentFilterModule.ts"/>
///<reference path="autoskip/AutoSkipModule.ts"/>

class ModuleManager {

    private modules : Module[] = [];
    private moduleCount : number = 0;

    constructor() {

        this.modules.push(new HideViewCountModule());
        this.modules.push(new ContentFilterModule());
        this.modules.push(new AutoSkipModule());
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