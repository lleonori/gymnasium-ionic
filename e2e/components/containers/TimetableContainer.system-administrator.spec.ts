import { test, expect } from "@playwright/test";

test.describe(() => {
  let timetables = [{ id: 1, startHour: "08:00", endHour: "12:00" }];

  test.beforeEach(async ({ page }) => {
    // Mock GET lista orari
    await page.route(/\/api\/v1\/timetable.*/, async (route, request) => {
      if (request.method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ data: timetables }),
        });
      } else if (request.method() === "POST") {
        const body = await request.postDataJSON();
        const newTimetable = { ...body, id: 3 };
        timetables = [...timetables, newTimetable];
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({ data: newTimetable }),
        });
      } else {
        await route.continue();
      }
    });

    // Mock PATCH e DELETE
    await page.route(/\/api\/v1\/timetable\/\d+$/, async (route, request) => {
      if (request.method() === "PATCH") {
        const body = await request.postDataJSON();
        timetables = timetables.map((t) =>
          t.id === body.id
            ? { id: t.id, startHour: body.startHour, endHour: body.endHour }
            : t,
        );
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ data: body }),
        });
      } else if (request.method() === "DELETE") {
        const id = Number(route.request().url().split("/").pop());
        timetables = timetables.filter((t) => t.id !== id);
        await route.fulfill({ status: 200, body: "{}" });
      } else {
        await route.continue();
      }
    });

    await page.goto("/timetables"); // Cambia la route se necessario
  });

  test("should show spinner while loading", async ({ page }) => {
    await page.route("**/api/v1/timetable**", async (route) => {
      await new Promise((res) => setTimeout(res, 500));
      await route.continue();
    });
    await page.reload();
    await expect(page.locator("ion-spinner")).toBeVisible();
  });

  test("should show error on API failure", async ({ page }) => {
    await page.route("**/api/v1/timetable**", async (route) => {
      await route.abort();
    });
    await page.reload();
    await expect(page.locator("text=Ops")).toBeVisible();
  });

  test("should render timetables with correct info", async ({ page }) => {
    await expect(
      page.locator("ion-chip:has-text('08:00-12:00')"),
    ).toBeVisible();

    await page.waitForTimeout(1000); // attesa extra per debug
    console.log(await page.content());

    await expect(page.locator('img[alt="Timetable\'s avatar"]')).toHaveCount(1);
  });

  test("should create timetable via dialog", async ({ page }) => {
    await page.getByTestId("create-timetable").click();

    // Attendi che la modale sia visibile
    await expect(page.locator("ion-modal")).toBeVisible();

    // Ora Inizio
    await page
      .locator('ion-select:has(div[slot="label"]:has-text("Ora Inizio"))')
      .click();
    let alert = page.getByRole("alertdialog", { name: "Ora Inizio" });
    await alert.waitFor();
    await alert.locator("button", { hasText: "09" }).click();
    await alert.locator("button", { hasText: "OK" }).click();

    // Minuti Inizio
    await page
      .locator('ion-select:has(div[slot="label"]:has-text("Minuti Inizio"))')
      .click();
    alert = page.getByRole("alertdialog", { name: "Minuti Inizio" });
    await alert.waitFor();
    await alert.getByRole("radio", { name: "15" }).click();
    await alert.locator("button", { hasText: "OK" }).click();

    // Ora Fine
    await page
      .locator('ion-select:has(div[slot="label"]:has-text("Ora Fine"))')
      .click();
    alert = page.getByRole("alertdialog", { name: "Ora Fine" });
    await alert.waitFor();
    await alert.getByRole("radio", { name: "13" }).click();
    await alert.locator("button", { hasText: "OK" }).click();

    // Minuti Fine
    await page
      .locator('ion-select:has(div[slot="label"]:has-text("Minuti Fine"))')
      .click();
    alert = page.getByRole("alertdialog", { name: "Minuti Fine" });
    await alert.waitFor();
    await alert.getByRole("radio", { name: "45" }).click();
    await alert.locator("button", { hasText: "OK" }).click();

    // Conferma la creazione
    await page.getByTestId("create-update-timetable").click();

    // Attendi che la modale sia completamente chiusa
    await expect(page.locator("ion-modal")).not.toBeVisible();

    // Attendi che la pagina sia aggiornata (opzionale, ma aiuta)
    await page.waitForTimeout(500);

    // Verifica che il nuovo orario sia visibile nella lista
    await expect(
      page.locator('ion-chip:has-text("09:15-13:45")'),
    ).toBeVisible();
  });

  test("should update timetable via dialog", async ({ page }) => {
    // Trova la orario e swipe per mostrare il pulsante elimina
    const timetableItem = page.locator("ion-item-sliding").first();
    await timetableItem.evaluate((el) => {
      (el as HTMLElement & { open: (side: string) => void }).open("start");
    });

    // Clicca il pulsante elimina
    await page.locator('ion-item-option[color="warning"]').click();

    // Attendi che la modale sia visibile
    await expect(page.locator("ion-modal")).toBeVisible();

    // Ora Inizio
    await page
      .locator('ion-select:has(div[slot="label"]:has-text("Ora Inizio"))')
      .click();
    let alert = page.getByRole("alertdialog", { name: "Ora Inizio" });
    await alert.waitFor();
    await alert.locator("button", { hasText: "09" }).click();
    await alert.locator("button", { hasText: "OK" }).click();

    // Minuti Inizio
    await page
      .locator('ion-select:has(div[slot="label"]:has-text("Minuti Inizio"))')
      .click();
    alert = page.getByRole("alertdialog", { name: "Minuti Inizio" });
    await alert.waitFor();
    await alert.getByRole("radio", { name: "15" }).click();
    await alert.locator("button", { hasText: "OK" }).click();

    // Ora Fine
    await page
      .locator('ion-select:has(div[slot="label"]:has-text("Ora Fine"))')
      .click();
    alert = page.getByRole("alertdialog", { name: "Ora Fine" });
    await alert.waitFor();
    await alert.getByRole("radio", { name: "13" }).click();
    await alert.locator("button", { hasText: "OK" }).click();

    // Minuti Fine
    await page
      .locator('ion-select:has(div[slot="label"]:has-text("Minuti Fine"))')
      .click();
    alert = page.getByRole("alertdialog", { name: "Minuti Fine" });
    await alert.waitFor();
    await alert.getByRole("radio", { name: "00" }).click();
    await alert.locator("button", { hasText: "OK" }).click();

    // Conferma la creazione
    await page.getByTestId("create-update-timetable").click();

    // Attendi che la modale sia completamente chiusa
    await expect(page.locator("ion-modal")).not.toBeVisible();

    // Attendi che la pagina sia aggiornata (opzionale, ma aiuta)
    await page.waitForTimeout(500);

    // Verifica che il nuovo orario sia visibile nella lista
    await expect(
      page.locator('ion-chip:has-text("09:15-13:00")'),
    ).toBeVisible();
  });

  test("should delete timetable via ActionSheet", async ({ page }) => {
    // Trova la prenotazione e swipe per mostrare il pulsante elimina
    const timetableItem = page.locator("ion-item-sliding").first();
    await timetableItem.evaluate((el) => {
      (el as HTMLElement & { open: (side: string) => void }).open("end");
    });

    // Clicca il pulsante elimina
    await page.locator('ion-item-option[color="danger"]').click();

    // Attendi che l’ActionSheet sia visibile
    await expect(page.locator("ion-action-sheet")).toBeVisible();

    // Conferma l'eliminazione nell'action sheet
    await page.locator('ion-action-sheet button:has-text("Elimina")').click();

    // Verifica che l'orario sia stato rimosso dalla lista
    await expect(
      page.locator('ion-chip:has-text("08:00 - 12:00")'),
    ).not.toBeVisible();
  });
});
