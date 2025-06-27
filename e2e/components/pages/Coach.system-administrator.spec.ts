import { test, expect } from "@playwright/test";

test.describe("Coach page - inserimento coach", () => {
  const coaches = [
    { id: 1, name: "Mario", surname: "Rossi", notes: "note1,note2" },
    { id: 2, name: "Luigi", surname: "Verdi", notes: "note3,note4" },
  ];

  test.beforeEach(async ({ page }) => {
    // Mock GET lista coach
    await page.route("**/api/v1/coach", async (route, request) => {
      if (request.method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ data: coaches }),
        });
      } else if (request.method() === "POST") {
        // Simula inserimento coach
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

    await page.goto("/coaches"); // Aggiorna la route se necessario
  });

  test("should create coach via modal", async ({ page }) => {
    const chip = page.getByTestId("create-coach");
    const headerBtn = page.getByTestId("create-coach-header");

    if (await chip.isVisible().catch(() => false)) {
      await chip.click();
    } else if (await headerBtn.isVisible().catch(() => false)) {
      await headerBtn.click();
    } else {
      throw new Error("Nessun pulsante per creare il coach trovato!");
    }

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
});
