import { test, expect } from "@playwright/test";
import { goToContentStep, openModule } from "./utils";

test.describe("Contenido - validaciones", () => {
    test.beforeEach(async ({ page }) => {
        await goToContentStep(page);
    });

    test("URL válida habilita descarga", async ({ page }) => {
        const input = page.locator("#qr-url-input");
        const error = page.locator("#qr-url-error");
        const downloadBtn = page.locator("#qr-download-btn");
        const placeholder = page.locator("#qr-placeholder");

        await input.fill("https://example.com");

        await expect(error).toBeHidden();
        await expect(downloadBtn).toBeEnabled();
        await expect(placeholder).toHaveCSS("opacity", "0");
        await expect(page.locator("#qr-canvas canvas")).toBeVisible({ timeout: 5000 });
    });

    test("URL inválida muestra mensaje", async ({ page }) => {
        const input = page.locator("#qr-url-input");
        const error = page.locator("#qr-url-error");
        const downloadBtn = page.locator("#qr-download-btn");

        await input.fill("not-a-valid-url");
        await input.press("Tab");

        await expect(error).toBeVisible();
        await expect(downloadBtn).toBeDisabled();
    });

    test("WhatsApp valida número tras blur", async ({ page }) => {
        await openModule(page, "whatsapp", "#whatsapp-phone");
        const phone = page.locator("#whatsapp-phone");
        const error = page.locator("#whatsapp-phone-error");

        await expect(error).toBeHidden();
        await phone.fill("123");
        await phone.blur();
        await expect(error).toBeVisible();
        await phone.fill("+549112345678");
        await phone.blur();
        await expect(error).toBeHidden();
    });

    test("Descarga genera PNG con nombre formado", async ({ page }) => {
        const downloadBtn = page.locator("#qr-download-btn");
        await page.locator("#qr-url-input").fill("https://example.com");

        const [download] = await Promise.all([
            page.waitForEvent("download"),
            downloadBtn.click(),
        ]);
        const suggestedName = download.suggestedFilename();
        console.log("download name", JSON.stringify(suggestedName));
        expect(suggestedName).toMatch(/qr-ticket-\d{8}-\d{4}\.png/);
    });
});
