import { test, expect } from "@playwright/test";

const users = [
  {
    role: "system-administrator",
    email: "test-system-administrator@test-system-administrator.com",
    password: "gymnasiumAuth0",
    storagePath: ".auth/storageState.system-administrator.json",
  },
];

for (const user of users) {
  test(`Onboarding and login for ${user.role}, save storageState`, async ({
    page,
  }) => {
    await page.goto("http://localhost:8100");

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

    await page.getByTestId("login-button").click();

    await page.getByLabel("Email address").fill(user.email);
    await page.getByLabel("Password").fill(user.password);
    await page.getByRole("button", { name: /^Continue$/ }).click();

    if (
      await page
        .getByRole("button", { name: /^Accept$/ })
        .isVisible()
        .catch(() => false)
    ) {
      await page.getByRole("button", { name: /^Accept$/ }).click();
    }

    await page.waitForURL("**/coaches");
    await expect(page.getByText(/Pronti a partire!/i)).toBeVisible();

    await page.context().storageState({ path: user.storagePath });
  });
}
