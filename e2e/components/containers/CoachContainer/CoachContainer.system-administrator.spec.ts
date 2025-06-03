import { test, expect } from "@playwright/test";

test.describe(() => {
  let coaches = [
    { id: 1, name: "Mario", surname: "Rossi", notes: "note1,note2" },
    { id: 2, name: "Luigi", surname: "Verdi", notes: "note3,note4" },
  ];

  test.beforeEach(async ({ page }) => {
    // Mock GET lista coach
    await page.route("**/api/v1/coach", async (route, request) => {
      console.log(
        "API called:",
        route.request().method(),
        route.request().url(),
      );
      if (request.method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            data: coaches,
          }),
        });
      } else {
        await route.continue();
      }
    });

    await page.route(/\/api\/v1\/coach\/\d+$/, async (route, request) => {
      if (request.method() === "PATCH") {
        const body = await request.postDataJSON();
        coaches = coaches.map((c) =>
          c.id === body.id ? { ...c, ...body } : c,
        );
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ data: body }),
        });
      } else if (request.method() === "DELETE") {
        coaches = coaches.filter((c) => c.id !== 1);
        await route.fulfill({ status: 200, body: "{}" });
      } else {
        await route.continue();
      }
    });

    await page.goto("/"); // Cambia se la route è diversa
  });

  test("shows spinner while loading", async ({ page }) => {
    await page.route("**/api/v1/coach**", async (route) => {
      await new Promise((res) => setTimeout(res, 500));
      await route.continue();
    });
    await page.reload();
    await expect(page.locator("ion-spinner")).toBeVisible();
  });

  test("shows error on API failure", async ({ page }) => {
    await page.route("**/api/v1/coach**", async (route) => {
      await route.abort();
    });
    await page.reload();
    await expect(page.locator("text=Errore")).toBeVisible();
  });

  test("renders coaches with correct info", async ({ page }) => {
    await expect(page.locator("text=Mario Rossi")).toBeVisible();
    await expect(page.locator("text=Luigi Verdi")).toBeVisible();
    await expect(page.locator('ion-chip:has-text("note1")')).toBeVisible();
    await expect(page.locator('ion-chip:has-text("note4")')).toBeVisible();
    await expect(page.locator('img[alt="Coach\'s avatar"]')).toHaveCount(2);
  });

  test("update coach via dialog", async ({ page }) => {
    // Verifica che il coach sia visibile
    await expect(page.getByText("Mario Rossi")).toBeVisible();

    // Simula lo swipe o attiva manualmente le opzioni (Ionic v8 workaround)
    await page.evaluate(() => {
      const sliding = document.querySelector("ion-item-sliding");
      if (sliding) {
        sliding.classList.add(
          "ios",
          "item-sliding-active-slide",
          "item-sliding-active-options-start",
        );
      }
    });

    // Clicca sull’icona modifica
    await page.getByTestId("update-coach-1").click();

    // Attendi che la modale sia visibile (adatta il selettore se necessario)
    await expect(page.locator("ion-modal")).toBeVisible();

    // Compila il campo nome (adatta il selettore al tuo form)
    await page.fill('input[name="name"]', "Giovanni");

    // Conferma la modifica (adatta il selettore al tuo pulsante di conferma)
    await page.getByTestId("insert-update-coach").click();

    // Attendi che il toast di conferma sia visibile
    await expect(
      page.locator('ion-toast[is-open="true"]:not(.overlay-hidden)'),
    ).toBeVisible();

    // Verifica che il nome aggiornato sia visibile
    await expect(page.getByText("Giovanni Rossi")).toBeVisible();
  });

  test("delete coach via ActionSheet", async ({ page }) => {
    // Verifica che il coach sia visibile
    await expect(page.getByText("Mario Rossi")).toBeVisible();

    // Simula lo swipe o attiva manualmente le opzioni (Ionic v8 workaround)
    await page.evaluate(() => {
      const sliding = document.querySelector("ion-item-sliding");
      if (sliding) {
        sliding.classList.add(
          "ios",
          "item-sliding-active-slide",
          "item-sliding-active-options-end",
        );
      }
    });

    // Clicca sull’icona elimina
    await page.getByTestId("delete-coach-1").click();

    // Attendi che l’ActionSheet sia visibile
    await expect(page.locator("ion-action-sheet")).toBeVisible();

    // Clicca su "Elimina"
    await page.locator('ion-action-sheet button:has-text("Elimina")').click();

    // Attendi che il toast di conferma sia visibile
    await expect(
      page.locator('ion-toast[is-open="true"]:not(.overlay-hidden)'),
    ).toBeVisible();

    // Verifica che il coach sia stato rimosso dalla lista
    await expect(page.getByText("Mario Rossi")).not.toBeVisible();
  });
});
