import { test, expect } from "@playwright/test";

test.describe(() => {
  // Stato iniziale dei weekdayTimes mockati
  const weekdayTimes = [
    {
      weekdayId: 1,
      weekdayName: "Lunedì",
      hour: [
        { id: 1, hour: "09:00" },
        { id: 2, hour: "10:00" },
      ],
    },
  ];

  // Stato iniziale dei timetables mockati
  const timetables = [
    { id: 1, startHour: "01:00", endHour: "11:00" },
    { id: 2, startHour: "15:00", endHour: "16:00" },
  ];

  test.beforeEach(async ({ page }) => {
    // Mock della route per GET e POST su /api/v1/weekday-time
    await page.route("**/api/v1/weekday-time", async (route, request) => {
      if (request.method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            data: weekdayTimes,
            message: "Success",
          }),
        });
      } else if (request.method() === "POST") {
        const body = await request.postDataJSON();

        // Gestione della POST per aggiornare i weekdayTimes mockati
        const updatedWeekday = weekdayTimes.find(
          (wt) => wt.weekdayId === body.weekdayId,
        );
        if (updatedWeekday) {
          updatedWeekday.hour = body.timetableId.map((id) => {
            const timetable = timetables.find((t) => t.id === id);
            return {
              id: id,
              hour: timetable?.startHour || "",
            };
          });
        }

        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            data: updatedWeekday,
            message: "Success",
          }),
        });
      } else {
        await route.continue();
      }
    });

    // Mock della GET per i timetables
    await page.route("**/api/v1/timetable**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: timetables,
          message: "Success",
        }),
      });
    });

    await page.goto("/assign-timetables");
  });
  test("should show spinner while loading", async ({ page }) => {
    await page.route("**/api/v1/weekday-time", async (route) => {
      await new Promise((res) => setTimeout(res, 500));
      await route.continue();
    });
    await page.reload();
    await expect(page.locator("ion-spinner")).toBeVisible();
  });

  test("should show error on API failure", async ({ page }) => {
    await page.route("**/api/v1/weekday-time", async (route) => {
      await route.abort();
    });
    await page.reload();
    await expect(page.locator("text=Ops")).toBeVisible();
  });

  test("should render weekday times with correct info", async ({ page }) => {
    await expect(page.locator("text=Lunedì")).toBeVisible();
    await expect(page.locator('ion-chip:has-text("09:00")')).toBeVisible();
    await expect(page.locator('img[alt="Timetable\'s avatar"]')).toHaveCount(1);
  });

  test("should update weekday time via modal", async ({ page }) => {
    // Trova la weekday e swipe per mostrare il pulsante elimina
    const weekdayItem = page.locator("ion-item-sliding").first();
    await weekdayItem.evaluate((el) => {
      (el as HTMLElement & { open: (side: string) => void }).open("start");
    });

    // Clicca il pulsante elimina
    await page.locator('ion-item-option[color="warning"]').click();

    // Attendi che la modale sia visibile e caricata
    await expect(page.locator("ion-modal")).toBeVisible();

    // Attendi che la sezione degli orari assegnati sia caricata
    await expect(
      page.locator("ion-card-title").filter({ hasText: "Orari assegnati" }),
    ).toBeVisible();

    // Rimuovi l'orario corrente (09:00) cliccando sulla chip
    await page.getByTestId("assigned-time-1").click();

    await page.waitForTimeout(500);

    // Clicca sul bottone Conferma
    await page.getByTestId("update-weekday-times").click();

    // Attendi che la modale si chiuda
    await expect(page.locator("ion-modal")).not.toBeVisible();

    // Verifica che la lista principale sia aggiornata
    await expect(page.locator('ion-chip:has-text("15:00")')).toBeVisible();
    await expect(page.locator('ion-chip:has-text("09:00")')).not.toBeVisible();
  });
});
