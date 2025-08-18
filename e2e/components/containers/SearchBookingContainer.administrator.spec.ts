import { test, expect } from "@playwright/test";

test.describe(() => {
  test.beforeEach(async ({ page }) => {
    // Mock getCalendar
    await page.route(/\/api\/v1\/calendar.*/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          today: "2025-06-27",
          tomorrow: "2025-06-28",
        }),
      });
    });

    // Mock getTimetables
    await page.route(/\/api\/v1\/timetable.*/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: [
            {
              id: 1,
              startHour: "09:00",
              endHour: "10:00",
            },
            {
              id: 2,
              startHour: "10:00",
              endHour: "11:00",
            },
          ],
        }),
      });
    });

    // Mock getBookings
    await page.route(/\/api\/v1\/booking.*/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: [
            {
              id: 1,
              fullname: "Mario Rossi",
              mail: "mario@rossi.it",
              day: "2025-06-27",
              startHour: "09:00",
              endHour: "10:00",
            },
          ],
        }),
      });
    });

    // Vai alla pagina che contiene il componente
    await page.goto("/administrator/search-bookings"); // Cambia con il path corretto se necessario
  });

  test("should display filters and search for bookings", async ({ page }) => {
    // Aspetta che i filtri siano visibili
    await expect(page.getByLabel("Giorno")).toBeVisible();
    await expect(page.getByLabel("Orario")).toBeVisible();

    // Seleziona il giorno
    await page.locator('ion-select[label="Giorno"]').click();
    const dayAlert = page.locator("ion-alert:visible");
    await dayAlert.waitFor();
    await dayAlert.locator("button", { hasText: "27-06-2025" }).click();
    await dayAlert.locator("button", { hasText: "OK" }).click();

    // Seleziona l'orario
    await page.locator('ion-select[label="Orario"]').click();
    const timeAlert = page.locator("ion-alert:visible");
    await timeAlert.waitFor();
    await timeAlert.locator("button", { hasText: "09:00 - 10:00" }).click();
    await timeAlert.locator("button", { hasText: "OK" }).click();

    // Clicca il bottone di ricerca
    await page.getByTestId("search-bookings").click();

    // Verifica che venga mostrata la prenotazione mockata
    await expect(page.getByText("Mario Rossi")).toBeVisible();
  });

  test("should show no reservation message", async ({ page }) => {
    // Sovrascrivi la route per questo test specifico
    await page.route(/\/api\/v1\/booking.*/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: [], // Array vuoto
        }),
      });
    });

    // Aspetta che i filtri siano visibili
    await expect(page.getByLabel("Giorno")).toBeVisible();
    await expect(page.getByLabel("Orario")).toBeVisible();

    // Seleziona il giorno
    await page.locator('ion-select[label="Giorno"]').click();
    const dayAlert = page.locator("ion-alert:visible");
    await dayAlert.waitFor();
    await dayAlert.locator("button", { hasText: "28-06-2025" }).click();
    await dayAlert.locator("button", { hasText: "OK" }).click();

    // Seleziona l'orario
    await page.locator('ion-select[label="Orario"]').click();
    const timeAlert = page.locator("ion-alert:visible");
    await timeAlert.waitFor();
    await timeAlert.locator("button", { hasText: "09:00 - 10:00" }).click();
    await timeAlert.locator("button", { hasText: "OK" }).click();

    // Clicca il bottone di ricerca
    await page.getByTestId("search-bookings").click();

    // Verifica che venga mostrato il messaggio di nessuna prenotazione
    await expect(page.getByText("Nessuna prenotazione")).toBeVisible();
    await expect(
      page.getByText("Al momento non ci sono prenotazioni.")
    ).toBeVisible();
  });

  test("should show toast if filters are not selected", async ({ page }) => {
    // Clicca il bottone di ricerca senza selezionare i filtri
    await page.getByTestId("search-bookings").click();

    // Verifica che il toast di errore sia visibile
    await expect(page.locator("ion-toast")).toBeVisible();
    await expect(page.locator("ion-toast")).toHaveText(
      /seleziona sia il giorno che l'orario/i
    );
  });
});
