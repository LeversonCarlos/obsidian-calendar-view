import { App, MarkdownPostProcessorContext } from "obsidian";
import { CalendarCache } from ".";
import { Injector } from "../Injector";
import { ItemCache } from "../Item";
import { PopupService } from "../popup";
import fallbackImage from "../styles/poster.png";

export class CalendarService {

	public static async OnRender(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext): Promise<any> {
		const id = ctx.sourcePath;
		console.log("Renderizando o calendário", id);

		const app = Injector?.getInstance(App);
		const month = Injector?.getInstance(CalendarCache)?.Get(id);
		const itemsList = Injector?.getInstance(ItemCache)?.GetByInterval(month!.Start, month!.Finish) ?? {};

		// Wrapper principal com estilo
		const wrapper = document.createElement("div");
		wrapper.className = "obsidian-calendar-view-wrapper";

		// Navegacao
		const nav = document.createElement("div");
		nav.className = "calendar-nav";

		const prev = document.createElement("button");
		prev.textContent = "←";
		prev.className = "calendar-nav-btn";
		prev.addEventListener("click", () => {
			CalendarCache.PreviousMonthCallack(ctx.sourcePath);
		});

		const next = document.createElement("button");
		next.textContent = "→";
		next.className = "calendar-nav-btn";
		next.addEventListener("click", () => {
			CalendarCache.NextMonthCallack(ctx.sourcePath);
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
		const totalDays = Math.ceil((month!.Finish.getTime() - month!.Start.getTime()) / (1000 * 60 * 60 * 24));

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

			const day = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate(), 0, 0, 0, 0);
			const dayIso = ItemCache.GetIsoString(day);
			const dayData = itemsList[dayIso] ?? [];
			const dayItems = Object.values(dayData);

			const ul = document.createElement("ul");
			ul.className = "calendar-items";

			if (dayItems && dayItems.length > 0) {

				for (const item of dayItems) {
					const li = document.createElement("li");
					const img = document.createElement("img");
					img.src = item.Image || fallbackImage;
					img.alt = item.Title;
					img.title = item.Title;
					for (const dates of item.Dates) {
						if (ItemCache.GetIsoString(dates.Date) == dayIso)
							img.addClass(`calendar-item-image-${dates.Type}`);
					}
					li.appendChild(img);
					ul.appendChild(li);
				}

				ul.addEventListener("click", () => {
					const modal = new PopupService(app, day, dayItems);
					modal.open();
				});

			}

			td.appendChild(ul);

			currentRow.appendChild(td);
			cursor.setDate(cursor.getDate() + 1);
		}
		tbody.appendChild(currentRow);
		table.appendChild(tbody);
		calendarArea.appendChild(table);
		wrapper.appendChild(calendarArea);

		el.appendChild(wrapper);
	}

}
