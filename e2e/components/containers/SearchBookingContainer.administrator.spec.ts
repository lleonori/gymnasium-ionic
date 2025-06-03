import { test as base, expect } from "@playwright/test";

// Definisci l'interfaccia per i fixtures custom
interface SearchBookingFixtures {
  selectDateTime: (date: string, time: string) => Promise<void>;
}

// Crea un test customizzato con i fixtures
const test = base.extend<SearchBookingFixtures>({
  selectDateTime: async ({ page }, use) => {
    await use(async (date: string, time: string) => {
      // Seleziona il giorno
      await page.locator('ion-select[label="Giorno"]').click();
      const dayAlert = page.locator('ion-alert[aria-modal="true"]');
      await dayAlert.waitFor();
      await dayAlert.locator("button", { hasText: date }).click();
      await dayAlert.locator("button", { hasText: "OK" }).click();

      await page.waitForResponse(
        (response) =>
          response
            .url()
            .includes("/api/v1/timetable?weekdayId=4&startHour.asc") &&
          response.status() === 200,
      );

      // Seleziona l'orario
      await page.locator('ion-select[label="Orario"]').click();
      const timeAlert = page.locator('ion-alert[aria-modal="true"]');
      await timeAlert.waitFor();
      await timeAlert.locator("button", { hasText: time }).click();
      await timeAlert.locator("button", { hasText: "OK" }).click();
    });
  },
});

test.describe("SearchBookingContainer main functionalities", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/search-bookings");
  });

  test("should display filters and allow selection", async ({
    page,
    selectDateTime,
  }) => {
    // I filtri sono visibili
    await expect(page.locator('ion-select[label="Giorno"]')).toBeVisible();
    await expect(page.locator('ion-select[label="Orario"]')).toBeVisible();
    // Seleziona data e ora
    await selectDateTime("2025-05-29", "9:00 - 10:30");
    // Verifica che i valori siano stati selezionati
    await expect(
      page.locator('ion-select[label="Giorno"] .select-text'),
    ).toHaveText("2025-05-29");
    await expect(
      page.locator('ion-select[label="Orario"] .select-text'),
    ).toHaveText("09:00 - 10:30");
  });

  test("should perform booking search", async ({ page, selectDateTime }) => {
    await selectDateTime("2025-05-29", "09:00 - 10:30");
    // Clicca sul pulsante di ricerca
    await page.getByTestId("search-bookings").click();
    // Verifica che i risultati siano visibili
    await expect(page.getByText(/nessuna prenotazione/i)).toBeVisible();
  });

  test("should show an error message if filters are incomplete", async ({
    page,
  }) => {
    // Clicca sul pulsante di ricerca
    await page.getByTestId("search-bookings").click();
    // Verifica che il toast di errore sia visibile
    await expect(page.locator("ion-toast")).toBeVisible();
    await expect(page.locator("ion-toast")).toHaveText(
      /seleziona sia il giorno che l'orario/i,
    );
  });
});
