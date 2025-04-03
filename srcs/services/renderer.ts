import { MarkdownPostProcessorContext } from "obsidian";
import { Injector } from ".";
import { ItemsData } from "../data";

export class Renderer {

	public static async OnRender(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext): Promise<any> {		
		const table = document.createElement("table");

		const thead = table.createTHead();
		const headerRow = thead.insertRow();

		const th = document.createElement("th");
		th.textContent = "Title";
		headerRow.appendChild(th);

		const items = Injector
			?.getInstance(ItemsData)
			?.GetByInterval(new Date(Date.parse("2021-01-01")), new Date(Date.parse("2024-12-31")));
		console.log("items", items);

		const tbody = table.createTBody();
		for (const item of items) {
			const row = tbody.insertRow();

			const td = row.insertCell();
			td.textContent = item.Title;
		}

		el.appendChild(table);
	}

}
