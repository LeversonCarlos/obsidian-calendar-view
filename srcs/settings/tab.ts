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
			.setName('Title Property')
			.setDesc('The name of a property in the notes that will be used as the TITLE of the note in the calendar view')
			.addText(text => text
				.setPlaceholder('ex: Title, Name, Description')
				.setValue(this.Settings.TitlePropertyName)
				.onChange(async (value) => {
					this.Settings.TitlePropertyName = value;
					await this.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Image Property')
			.setDesc('The name of a property in the notes that will be used as the IMAGE of the note in the calendar view')
			.addText(text => text
				.setPlaceholder('ex: CoverImage, Image, Poster')
				.setValue(this.Settings.ImagePropertyName)
				.onChange(async (value) => {
					this.Settings.ImagePropertyName = value;
					await this.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Dates Property')
			.setDesc('A coma separated list of property names in the notes that will be used as the DATES of the note in the calendar view')
			.addText(text => text
				.setPlaceholder('ex: ReleaseDate, StartDate, ReadDate, WatchDate')
				.setValue(this.Settings.DatesPropertyName?.join(', ') ?? '')
				.onChange(async (value) => {
					this.Settings.DatesPropertyName = value?.split(',')?.map(s => s.trim());
					await this.saveSettings();
				}));

	}

}
