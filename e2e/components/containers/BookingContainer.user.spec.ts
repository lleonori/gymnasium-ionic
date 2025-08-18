import { test, expect } from "@playwright/test";

test.describe("BookingContainer - prenotazione lezione", () => {
  let bookings = [
    {
      id: 1,
      day: "2025-06-12",
      startHour: "09:00",
      endHour: "10:30",
      mail: "test@example.com",
      fullname: "Test User",
    },
  ];

  const timetables = [
    { id: 1, startHour: "08:00", endHour: "12:00" },
    { id: 2, startHour: "14:00", endHour: "18:00" },
  ];

  test.beforeEach(async ({ page }) => {
    // Mock calendar API
    await page.route(/\/api\/v1\/calendar.*/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          today: "2025-06-12",
          tomorrow: "2025-06-13",
        }),
      });
    });

    // Mock timetables API
    // Mock GET lista orari
    await page.route(/\/api\/v1\/timetable.*/, async (route, request) => {
      if (request.method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ data: timetables }),
        });
      } else {
        await route.continue();
      }
    });

    // Mock bookings API (GET, POST, DELETE)
    await page.route(/\/api\/v1\/booking.*/, async (route, request) => {
      if (request.method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ data: bookings }),
        });
      } else if (request.method() === "POST") {
        const body = await request.postDataJSON();
        const newBooking = {
          ...body,
          id: 2,
          startHour: "11:00",
          endHour: "12:30",
        };
        bookings = [...bookings, newBooking];
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({ data: newBooking }),
        });
      } else if (request.method() === "DELETE") {
        // Remove the first booking for simplicity
        bookings = bookings.slice(1);
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ message: "Booking deleted" }),
        });
      } else {
        await route.continue();
      }
    });

    await page.goto("/user/booking");
  });

  test("the user can book a lesson", async ({ page }) => {
    // Seleziona il giorno
    await page
      .locator('ion-select:has(div[slot="label"]:has-text("Giorno"))')
      .click();
    let alert = page.getByRole("alertdialog", { name: "Giorno" });
    await alert.waitFor();
    await alert.locator("button", { hasText: "13-06-2025" }).click();
    await alert.locator("button", { hasText: "OK" }).click();

    // Seleziona orario
    await page
      .locator('ion-select:has(div[slot="label"]:has-text("Orario"))')
      .click();
    alert = page.getByRole("alertdialog", { name: "Orario" });
    await alert.waitFor();
    await alert.getByRole("radio", { name: "08:00 - 12:00" }).click();
    await alert.locator("button", { hasText: "OK" }).click();

    await page.waitForTimeout(500);

    // Invia la prenotazione
    await page.getByTestId("create-booking").click();

    // Verifica che la nuova prenotazione sia visibile nella lista
    await expect(page.locator('ion-chip:has-text("13-06-2025")')).toBeVisible();
  });

  test("the user can delete a booking", async ({ page }) => {
    // Trova la prenotazione e swipe per mostrare il pulsante elimina
    const bookingItem = page.locator("ion-item-sliding").first();
    await bookingItem.evaluate((el) => {
      (el as HTMLElement & { open: (side: string) => void }).open("end");
    });

    // Clicca il pulsante elimina
    await page.locator('ion-item-option[color="danger"]').click();

    // Conferma l'eliminazione nell'action sheet
    await page.locator('ion-action-sheet button:has-text("Elimina")').click();

    // Verifica che il coach sia stato rimosso dalla lista
    await expect(page.getByText("Test User")).not.toBeVisible();
  });
});
