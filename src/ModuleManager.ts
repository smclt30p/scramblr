///<reference path="Module.ts"/>
///<reference path="HideViewCountModule.ts"/>

class ModuleManager {

    private modules : Module[] = [];

    constructor() {

        this.modules.push(new HideViewCountModule());

    }

    public getLoadedModules() : Module[] {
        return this.modules;
    }

}