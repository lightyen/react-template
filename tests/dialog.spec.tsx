import { expect, test } from "playwright/test"

test.beforeEach(async ({ page }, info) => {
	const baseUrl = info.config.webServer?.url ?? "http://localhost:5173"
	await page.goto(new URL("/components", baseUrl).href)
})

test.describe("Dialog", () => {
	test("dialog: press escape", async ({ page }) => {
		await page.getByRole("button", { name: "Dialog" }).click()
		await expect(page.getByText("Make changes to your profile here. Click save when you're done.")).toBeVisible()

		await page.keyboard.down("Escape")
		await expect(
			page.getByText("Make changes to your profile here. Click save when you're done."),
		).not.toBeVisible()
	})
	test("dialog: press outside", async ({ page }) => {
		await page.getByRole("button", { name: "Dialog" }).click()
		await expect(page.getByText("Make changes to your profile here. Click save when you're done.")).toBeVisible()
		await page.mouse.click(0, 0)
		await expect(
			page.getByText("Make changes to your profile here. Click save when you're done."),
		).not.toBeVisible()
	})
})
