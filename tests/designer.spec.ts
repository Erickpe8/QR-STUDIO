import { test, expect } from "@playwright/test";
import { Buffer } from "buffer";
import { goToDesignStep } from "./utils";

test.describe("Designer interactions", () => {
    test.beforeEach(async ({ page }) => {
        await goToDesignStep(page);
    });

    test("toggles gradient controls and title visibility", async ({ page }) => {
        const textDetails = page.locator("details", { hasText: "Textos" });
        if ((await textDetails.getAttribute("open")) === null) {
            await textDetails.locator("summary").click();
        }

        const gradientSection = page.locator("#ticket-gradient-section");
        const titleSection = page.locator("#title-section");
        const titleToggle = page.locator("#ticket-show-title-input");
        await expect(gradientSection).not.toHaveClass(/pointer-events-none/);

        await page.selectOption("#ticket-bgtype-input", "solid");
        await expect(gradientSection).toHaveClass(/pointer-events-none/);

        await titleToggle.click();
        await expect(titleSection).toHaveClass(/opacity-50/);

        await titleToggle.click();
        await expect(titleSection).not.toHaveClass(/opacity-50/);

        await page.click('[data-preset-id="mint"]');
        await expect(page.locator("#qr-fg-hex")).toHaveValue("#0f172a");
        await expect(page.locator("#qr-bg-hex")).toHaveValue("#ffffff");
    });

    test("uploads and removes a logo", async ({ page }) => {
        const logoDetails = page.locator("details", { hasText: "Logo" });
        if ((await logoDetails.getAttribute("open")) === null) {
            await logoDetails.locator("summary").click();
        }

        const logoPreview = page.locator("#logo-preview");
        const removeButton = page.locator("#logo-remove");

        const pngBase64 =
            "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/5+hHgAHggJ/PChiPAAAAABJRU5ErkJggg==";
        const logoBuffer = Buffer.from(pngBase64, "base64");

        await page.setInputFiles("#logo-input", {
            name: "logo.png",
            mimeType: "image/png",
            buffer: logoBuffer,
        });

        await expect(logoPreview).not.toHaveClass(/hidden/);
        await removeButton.click();
        await expect(logoPreview).toHaveClass(/hidden/);
    });
});
