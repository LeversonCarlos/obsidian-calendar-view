import { Plugin } from 'obsidian';
import { CalendarService } from './calendar';
import { Injector } from './Injector';
import { IPlugin } from './IPlugin';
import { ItemService } from './Item';
import { SettingsService, SettingTab } from './settings';
import { StylesService } from './styles';

export default class MyPlugin extends Plugin implements IPlugin {

	async onload() {
		Injector.Init(this);

		StylesService.loadStyles();
		await SettingsService.loadSettings();
		await ItemService.LoadFiles();

		this.registerEvent(this.app.vault.on('create', ItemService.OnCreate));
		this.registerEvent(this.app.vault.on('modify', ItemService.OnModify));
		this.registerEvent(this.app.vault.on('delete', ItemService.OnDelete));

		this.registerMarkdownCodeBlockProcessor("calendar-view", CalendarService.OnRender);

		/*
		const ribbonIconEl = this.addRibbonIcon('dice', 'Calendar View', (evt: MouseEvent) => {
			Injector
				?.getInstance(ItemCache)
				?.Log();
		});
		ribbonIconEl.addClass('my-plugin-ribbon-class');
		*/

		/*
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status Bar Text');
		*/

		/*
		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				new SampleModal(this.app).open();
			}
		});
		*/

		/*
		this.addCommand({
			id: 'sample-editor-command',
			name: 'Sample editor command',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection('Sample Editor Command');
			}
		});
		*/

		this.addSettingTab(new SettingTab(this.app, this));

		/*
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});
		*/

		// this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {
	}

}
