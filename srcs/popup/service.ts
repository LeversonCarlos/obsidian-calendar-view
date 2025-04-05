import { App, Modal } from "obsidian";
import { ItemModel } from "../Item";

export class PopupService extends Modal {

	constructor(app: App, date: Date, items: ItemModel[]) {
		super(app);
		this._Date = date;
		this._Items = items;
	}
	private _Date: Date;
	private _Items: ItemModel[];

	onOpen() {
		const { contentEl } = this;

		contentEl.empty();
		contentEl.className = "obsidian-calendar-view-popup";
		contentEl.createEl("h2", { text: "Itens Relacionados" });

		const list = contentEl.createEl("div", { cls: "item-list-container" });

		this._Items.forEach(item => {
			const row = list.createEl("div", { cls: "item-list-row" });

			// Imagem
			if (item.Image) {
				const img = row.createEl("img", {
					attr: { src: item.Image, alt: item.Title },
					cls: "item-list-image"
				});
			}

			// Título e Data
			const textContainer = row.createEl("div", { cls: "item-list-text" });
			textContainer.createEl("div", { text: item.Title, cls: "item-list-title" });

			if (item.Dates?.length > 0) {
				const dateStr = new Date(item.Dates[0].Date).toLocaleDateString(); // ajuste conforme estrutura
				textContainer.createEl("div", { text: dateStr, cls: "item-list-date" });
			}

		});
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}

}
