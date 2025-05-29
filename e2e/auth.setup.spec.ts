import { test, expect } from "@playwright/test";

test("Onboarding e login, salva storageState", async ({ page }) => {
  await page.goto("http://localhost:8100"); // Cambia la porta/route se necessario

  // Salta l'onboarding (clicca "Salta" o "Skip")
  if (
    await page
      .getByRole("button", { name: /salta/i })
      .isVisible()
      .catch(() => false)
  ) {
    await page.getByRole("button", { name: /salta/i }).click();
  } else if (
    await page
      .getByTestId("skip-button")
      .isVisible()
      .catch(() => false)
  ) {
    await page.getByTestId("skip-button").click();
  }

  // Clicca "Inizia ora" sull'ultimo slide
  await page.getByTestId("login-button").click();

  // Se usi Auth0, automatizza qui la login Auth0 (se possibile)
  // Esempio:
  await page
    .getByLabel("Email address")
    .fill("test-administrator@test-administrator.com");
  await page.getByLabel("Password").fill("gymnasiumAuth0");
  await page.getByRole("button", { name: /^Continue$/ }).click();

  // Attendi che la home sia caricata (adatta la route se necessario)
  await page.waitForURL("**/search-bookings");

  // Verifica che la home sia visibile (opzionale)
  await expect(page.getByText(/Benvenuto/i)).toBeVisible();

  // Salva lo storage state per i prossimi test
  await page.context().storageState({ path: ".auth/storageState.json" });
});
