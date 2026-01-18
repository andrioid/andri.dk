import { test, expect } from "@playwright/test";

test.describe("About Page", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/about/");
	});

	test("should load the about page successfully", async ({ page }) => {
		await expect(page).toHaveTitle(/About/);
	});

	test("should contain personal information", async ({ page }) => {
		// Check that the page contains the main heading
		await expect(
			page.getByRole("heading", { name: "About Me" }),
		).toBeVisible();

		// Check for basic information elements that should be present
		await expect(page.locator("text=Andri")).toBeVisible();
		await expect(page.locator("text=Icelandic")).toBeVisible();
	});

	test("should contain work experience", async ({ page }) => {
		// Should see at least one work experience entry
		await expect(page.locator(".border-l-4")).toBeVisible();
	});

	test("should contain education information", async ({ page }) => {
		// Should see education section
		await expect(page.getByText("Education")).toBeVisible();
	});

	test("should contain skills", async ({ page }) => {
		// Should see skills section
		await expect(page.getByText("Skills")).toBeVisible();
	});
});
