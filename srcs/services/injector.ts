export class Injector {
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
