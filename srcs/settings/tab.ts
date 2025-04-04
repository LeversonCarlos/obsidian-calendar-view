import { App, PluginSettingTab, Setting } from "obsidian";
import { IPlugin } from "srcs";
import { Injector } from "srcs/services";
import { SettingsModel } from "./model";
import { SettingsService } from "./service";

export class SettingTab extends PluginSettingTab {

	constructor(app: App, plugin: IPlugin) {
		super(app, plugin);
		this.Settings = Injector.getInstance(SettingsModel);
	}

	private Settings: SettingsModel;
	private async saveSettings() {
		await SettingsService.saveSettings(this.Settings);
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('Title Property')
			.addText(text => text
				.setPlaceholder('Enter the TITLE property name of the notes')
				.setValue(this.Settings.TitlePropertyName)
				.onChange(async (value) => {
					this.Settings.TitlePropertyName = value;
					await this.saveSettings();
				}));
	}

}
