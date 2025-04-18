import { App, Modal } from "obsidian";
import { ItemCache, ItemModel } from "../Item";

export class PopupService extends Modal {

	constructor(app: App, date: Date, items: ItemModel[]) {
		super(app);
		this._Date = date;
		this._Items = items;
	}
	private _Date: Date;
	private _Items: ItemModel[];

	onOpen() {
		const { contentEl, titleEl } = this;

		titleEl.setText(this._Date.toLocaleDateString()); 

		contentEl.empty();
		contentEl.className = "obsidian-calendar-view-popup";

		const list = contentEl.createEl("div", { cls: "item-list-container" });

		this._Items.forEach(item => {
			const row = list.createEl("div", { cls: "item-list-row" });

			// Imagem
			if (item.Image) {
				const img = row.createEl("img", {
					attr: {
						src: item.Image,
						alt: item.Title,
					},
					cls: "item-list-image"
				});
			}

			// Título e Data
			const textContainer = row.createEl("div", { cls: "item-list-text" });
			textContainer.createEl("div", { text: item.Title, cls: "item-list-title" });

			if (item.Dates?.length > 0) {
				const dateIso = ItemCache.GetIsoString(this._Date);

				let dateText = "";
				for (const dates of item.Dates) {
					if (ItemCache.GetIsoString(dates.Date) == dateIso)
						dateText += (dateText ? ', ' : '') + dates.Type;
				}

				textContainer.createEl("div", { text: dateText, cls: "item-list-date" });
			}

			row.addEventListener("click", () => {
				if (item.ID) {
					this.app.workspace.openLinkText(item.ID, "", true);
					this.close();
				}
			});

		});
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}

}
