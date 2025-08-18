import { test, expect } from "@playwright/test";

test.describe(() => {
  let coaches = [
    { id: 1, name: "Mario", surname: "Rossi", notes: "note1,note2" },
  ];

  test.beforeEach(async ({ page }) => {
    // Mock GET lista coach
    await page.route("**/api/v1/coach", async (route, request) => {
      if (request.method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            data: coaches,
          }),
        });
      } else if (request.method() === "POST") {
        const body = await request.postDataJSON();
        const newCoach = { id: 3, ...body };
        coaches.push(newCoach);
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({ data: newCoach }),
        });
      } else {
        await route.continue();
      }
    });

    await page.route(/\/api\/v1\/coach\/\d+$/, async (route, request) => {
      if (request.method() === "PATCH") {
        const body = await request.postDataJSON();
        coaches = coaches.map((c) =>
          c.id === body.id ? { ...c, ...body } : c
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

    await page.goto("/systemAdministrator/coaches"); // Cambia se la route è diversa
  });

  test("should shows spinner while loading", async ({ page }) => {
    await page.route("**/api/v1/coach**", async (route) => {
      await new Promise((res) => setTimeout(res, 500));
      await route.continue();
    });
    await page.reload();
    await expect(page.locator("ion-spinner")).toBeVisible();
  });

  test("should shows error on API failure", async ({ page }) => {
    await page.route("**/api/v1/coach**", async (route) => {
      await route.abort();
    });
    await page.reload();
    await expect(page.locator("text=Ops")).toBeVisible();
  });

  test("should renders coaches with correct info", async ({ page }) => {
    await expect(page.locator("text=Mario Rossi")).toBeVisible();
    await expect(page.locator('ion-chip:has-text("note1")')).toBeVisible();
    await expect(page.locator('img[alt="Coach\'s avatar"]')).toHaveCount(1);
  });

  test("should create coach via modal", async ({ page }) => {
    await page.getByTestId("create-coach").click();

    // Attendi che la modale sia visibile
    await expect(page.locator("ion-modal")).toBeVisible();

    // Compila i campi del form (adatta i selettori ai tuoi input)
    await page.fill('input[name="name"]', "Anna");
    await page.fill('input[name="surname"]', "Bianchi");
    await page.locator("ion-textarea textarea").fill("note");

    // Conferma l'inserimento (adatta il selettore al tuo pulsante di conferma)
    await page.getByTestId("insert-update-coach").click();

    // Attendi che la modale sia completamente chiusa
    await expect(page.locator("ion-modal")).not.toBeVisible();

    // Attendi che la pagina sia aggiornata (opzionale, ma aiuta)
    await page.waitForTimeout(500);

    // Verifica che il nuovo coach sia visibile nella lista
    await expect(page.getByText("Anna Bianchi")).toBeVisible();
  });

  test("should update coach via dialog", async ({ page }) => {
    // Trova la coach e swipe per mostrare il pulsante elimina
    const coachItem = page.locator("ion-item-sliding").first();
    await coachItem.evaluate((el) => {
      (el as HTMLElement & { open: (side: string) => void }).open("start");
    });

    // Clicca il pulsante elimina
    await page.locator('ion-item-option[color="warning"]').click();

    // Attendi che la modale sia visibile
    await expect(page.locator("ion-modal")).toBeVisible();

    // Compila il campo nome (adatta il selettore al tuo form)
    await page.fill('input[name="name"]', "Giovanni");

    // Conferma la modifica (adatta il selettore al tuo pulsante di conferma)
    await page.getByTestId("insert-update-coach").click();

    // Verifica che il nome aggiornato sia visibile
    await expect(page.getByText("Giovanni Rossi")).toBeVisible();
  });

  test("should delete coach via ActionSheet", async ({ page }) => {
    // Trova la coach e swipe per mostrare il pulsante elimina
    const coachItem = page.locator("ion-item-sliding").first();
    await coachItem.evaluate((el) => {
      (el as HTMLElement & { open: (side: string) => void }).open("end");
    });

    // Clicca il pulsante elimina
    await page.locator('ion-item-option[color="danger"]').click();

    // Attendi che l’ActionSheet sia visibile
    await expect(page.locator("ion-action-sheet")).toBeVisible();

    // Conferma l'eliminazione nell'action sheet
    await page.locator('ion-action-sheet button:has-text("Elimina")').click();

    // Verifica che il coach sia stato rimosso dalla lista
    await expect(page.getByText("Mario Rossi")).not.toBeVisible();
  });
});
