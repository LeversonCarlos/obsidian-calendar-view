import { App } from "obsidian";
import { IPlugin } from "srcs";

export class Injector {

	public static Init(app: App, plugin: IPlugin) {
		Injector.instances.set(App.name, app);
		Injector.instances.set('IPlugin', plugin);
	}

	private static instances: Map<string, any> = new Map();
	public static getPlugin(): IPlugin {
		return this.instances.get('IPlugin');
	}

	public static getInstance<T>(type: { new(): T }): T {
		const typeName = type.name;

		if (!this.instances.has(typeName)) {
			const instance = new type();
			this.instances.set(typeName, instance);
		}

		return this.instances.get(typeName);
	}

	public static setInstance<T>(type: { new(): T }, value: T): void {
		const typeName = type.name;
		this.instances.set(typeName, value);
	}

}
