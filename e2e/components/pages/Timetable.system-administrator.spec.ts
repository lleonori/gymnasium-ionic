import { test, expect } from "@playwright/test";

test.describe("Timetable page - inserimento orario", () => {
  let timetables = [
    // Changed to let since we modify it
    { id: 1, startHour: "08:00", endHour: "12:00" },
    { id: 2, startHour: "14:00", endHour: "18:00" },
  ];

  test.beforeEach(async ({ page }) => {
    // Mock GET and POST requests
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

    // Navigate after setting up mocks
    await page.goto("/timetables");
  });

  test("should create timetable via dialog", async ({ page }) => {
    const chip = page.getByTestId("create-timetable");
    const headerBtn = page.getByTestId("create-timetable-header");

    if (await chip.isVisible().catch(() => false)) {
      await chip.click();
    } else if (await headerBtn.isVisible().catch(() => false)) {
      await headerBtn.click();
    } else {
      throw new Error("Nessun pulsante per creare l'orario trovato!");
    }

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
      page.locator('ion-chip:has-text("09:15 - 13:45")'),
    ).toBeVisible();
  });
});
