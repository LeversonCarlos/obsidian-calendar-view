import { App } from "obsidian";

export class Injector {

	public static Init(app: App) {
		Injector.instances.set(App.name, app);
	}

	private static instances: Map<string, any> = new Map();

	public static getInstance<T>(type: { new(): T }): T {
		const typeName = type.name;

		if (!this.instances.has(typeName)) {
			const instance = new type();
			this.instances.set(typeName, instance);
		}

		return this.instances.get(typeName);
	}
}
