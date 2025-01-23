import { expect, test } from "playwright/test"

test.beforeEach(async ({ page }, info) => {
	await page.goto(
		new URL("/?path=/story/example-dialog--default", info.config.webServer?.url ?? "http://localhost:6006").href,
	)
})

test.describe("Dialog", () => {
	test("dialog: press escape", async ({ page }) => {
		await page.getByTestId("dialog").click()
		await expect(page.getByText("Make changes to your profile here. Click save when you're done.")).toBeVisible()

		// await page.keyboard.down("Escape")
		// await expect(
		// 	page.getByText("Make changes to your profile here. Click save when you're done."),
		// ).not.toBeVisible()
	})
	// test("dialog: press outside", async ({ page }) => {
	// 	await page.getByTestId("dialog-01").click()
	// 	await expect(page.getByText("Make changes to your profile here. Click save when you're done.")).toBeVisible()
	// 	await page.mouse.click(0, 0)
	// 	await expect(
	// 		page.getByText("Make changes to your profile here. Click save when you're done."),
	// 	).not.toBeVisible()
	// })
})
