import { test, expect } from "@playwright/test";

const users = [
  {
    roles: ["user", "admin", "systemAdministrator"],
    email: "test-user-multi-roles@test-user-multi-roles.com",
    password: "gymnasiumAuth0",
    storagePath: ".auth/storageState.user-multi-roles.json",
  },
];

for (const user of users) {
  test(`Onboarding and login for multi roles user, save storageState`, async ({
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

    await page.getByTestId("login-button").click({ force: true });

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

    await page.waitForURL("**/");
    await expect(
      page.getByText(/Con quale ruolo vuoi accedere?/i)
    ).toBeVisible();

    await page.context().storageState({ path: user.storagePath });
  });
}
