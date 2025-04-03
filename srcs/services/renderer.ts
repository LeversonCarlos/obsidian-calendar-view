import { MarkdownPostProcessorContext } from "obsidian";
import { Injector } from ".";
import { ItemsData, MonthData } from "../data";

export class Renderer {

	public static async OnRender(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext): Promise<any> {
		const id = ctx.sourcePath;

		const table = document.createElement("table");

		const thead = table.createTHead();
		const headerRow = thead.insertRow();

		const th = document.createElement("th");
		th.colSpan = 2;
		const month = Injector
			?.getInstance(MonthData)
			?.Get(id);

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

		const itemsList = Injector
			?.getInstance(ItemsData)
			?.GetByInterval(month!.Start, month!.Finish)
			?? {};
		console.log(itemsList);

		const tbody = table.createTBody();

		let day = new Date(month!.Start);
		while (day <= month!.Finish) {
			const row = tbody.insertRow();

			const dayTd = row.insertCell();
			dayTd.textContent = day.getDate().toString().padStart(2, "0");

			const itemsTd = row.insertCell();
			const items = itemsList[ItemsData.GetIsoString(day)];
			if (items) {
				const itemsValues = Object.values(items);
				for (const item of itemsValues) {
					const itemEl = itemsTd.createEl("div");
					itemEl.textContent = item.Title;
				}
			}

			day.setDate(day.getDate() + 1);
		}

		el.appendChild(table);
	}

}
