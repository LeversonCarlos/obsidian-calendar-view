import { App } from "obsidian";
import { IPlugin } from "..";

export class Injector {

	public static Init(plugin: IPlugin) {
		Injector.instances.set(App.name, plugin.app);
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
