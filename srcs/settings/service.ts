import { SettingsModel } from ".";
import { Injector } from "../Injector";

export class SettingsService {

	public static async loadSettings() {
		const plugin = Injector
			.getPlugin();

		const data = await plugin.loadData();
		const value: SettingsModel = Object.assign(new SettingsModel, data);

		Injector
			.setInstance(SettingsModel, value);
	}

	public static async saveSettings(value: SettingsModel) {
		const plugin = Injector
			.getPlugin();

		Injector
			.setInstance(SettingsModel, value);

		await plugin.saveData(value);
	}

}
