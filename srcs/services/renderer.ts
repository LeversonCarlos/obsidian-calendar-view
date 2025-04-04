import { App, MarkdownPostProcessorContext } from "obsidian";
import { Injector } from ".";
import { ItemsData, MonthData } from "../data";

export class Renderer {

	public static async OnRender(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext): Promise<any> {
		Renderer.injectCalendarCSS();
		const id = ctx.sourcePath;

		const month = Injector?.getInstance(MonthData)?.Get(id);
		const itemsList = Injector?.getInstance(ItemsData)?.GetByInterval(month!.Start, month!.Finish) ?? {};

		// Wrapper principal com estilo
		const wrapper = document.createElement("div");
		wrapper.className = "obsidian-calendar-wrapper";

		// Navegacao
		const nav = document.createElement("div");
		nav.className = "calendar-nav";

		const prev = document.createElement("button");
		prev.textContent = "←";
		prev.className = "calendar-nav-btn";
		prev.addEventListener("click", () => {
			MonthData.PreviousMonthCallack(ctx.sourcePath);
		});

		const next = document.createElement("button");
		next.textContent = "→";
		next.className = "calendar-nav-btn";
		next.addEventListener("click", () => {
			MonthData.NextMonthCallack(ctx.sourcePath);
		});

		const title = document.createElement("div");
		title.className = "calendar-title";
		title.textContent = `${month?.MonthText}/${month?.YearText}`;

		nav.appendChild(prev);
		nav.appendChild(title);
		nav.appendChild(next);
		wrapper.appendChild(nav);

		// Calendário
		const calendarArea = document.createElement("div");
		calendarArea.className = "calendar-body";

		const table = document.createElement("table");
		table.className = "calendar-table";

		const weekdays = ["D", "S", "T", "Q", "Q", "S", "S"];
		const thead = document.createElement("thead");
		const headerRow = document.createElement("tr");
		for (const wd of weekdays) {
			const th = document.createElement("th");
			th.textContent = wd;
			headerRow.appendChild(th);
		}
		thead.appendChild(headerRow);
		table.appendChild(thead);

		const tbody = document.createElement("tbody");
		const cursor = new Date(month!.Start);
		const startDay = cursor.getDay();
		const totalDays = Math.ceil((month!.Finish.getTime() - month!.Start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

		let currentRow = document.createElement("tr");
		for (let i = 0; i < startDay; i++) {
			currentRow.appendChild(document.createElement("td"));
		}

		const today = new Date();
		for (let i = 0; i < totalDays; i++) {
			if (cursor.getDay() === 0 && i !== 0) {
				tbody.appendChild(currentRow);
				currentRow = document.createElement("tr");
			}

			const td = document.createElement("td");
			td.className = "calendar-cell";

			const dayDiv = document.createElement("div");
			dayDiv.className = "calendar-day";
			dayDiv.textContent = cursor.getDate().toString();

			if (
				cursor.getDate() === today.getDate() &&
				cursor.getMonth() === today.getMonth() &&
				cursor.getFullYear() === today.getFullYear()
			) {
				dayDiv.classList.add("calendar-today");
			}

			td.appendChild(dayDiv);

			const dayIso = ItemsData.GetIsoString(cursor);
			const items = itemsList[dayIso] ?? [];
			/*

			if (items.length > 0) {
				const ul = document.createElement("ul");
				ul.className = "calendar-items";
				for (const item of items) {
					const li = document.createElement("li");
					li.textContent = item;
					ul.appendChild(li);
				}
				td.appendChild(ul);
			}
			*/

			if (items) {				
				const itemsTd = document.createElement("div");
				const itemsValues = Object.values(items);
				for (const item of itemsValues) {
					const itemEl = itemsTd.createEl("div");
					itemEl.textContent = item.Title;
					for (const dates of item.Dates) {
						if (ItemsData.GetIsoString(dates.Date) == dayIso)
							itemEl.textContent += ` [${dates.Type}]`;
					}
				}
				td.appendChild(itemsTd);
			}

			currentRow.appendChild(td);
			cursor.setDate(cursor.getDate() + 1);
		}
		tbody.appendChild(currentRow);
		table.appendChild(tbody);
		calendarArea.appendChild(table);
		wrapper.appendChild(calendarArea);

		el.appendChild(wrapper);
	}

	private static injectCalendarCSS(): void {
		const style = document.createElement("style");
		style.textContent = "./styles/calendar.css";
		document.head.appendChild(style);
	}

}
