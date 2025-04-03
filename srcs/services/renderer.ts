import { MarkdownPostProcessorContext } from "obsidian";
import { Injector } from ".";
import { ItemsData, MonthData } from "../data";

export class Renderer {

	public static async OnRender(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext): Promise<any> {
		const table = document.createElement("table");

		const thead = table.createTHead();
		const headerRow = thead.insertRow();

		const th = document.createElement("th");
		const month = Injector
			?.getInstance(MonthData)
			?.Month;		

		const prev = th.createEl("button");
		prev.textContent = "<";
		prev.addEventListener("click", () => {
			MonthData.PreviousMonthCallack(ctx.sourcePath);
		});

		const title = th.createEl("span");
		title.textContent = `${month?.MonthText}/${month?.YearText}`;

		const next = th.createEl("button");
		next.textContent = ">";
		next.addEventListener("click", () => {
			MonthData.NextMonthCallack(ctx.sourcePath);
		});

		headerRow.appendChild(th);

		const items = Injector
			?.getInstance(ItemsData)
			?.GetByInterval(month!.Start, month!.Finish);
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
