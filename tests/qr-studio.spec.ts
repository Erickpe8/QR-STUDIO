import { test, expect } from "@playwright/test";

test.describe("QR Studio - layout y funcionalidad", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
    });

    test("layout responsive y alineado en desktop y mobile", async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 800 });

        const sidebar = page.locator("#app-sidebar");
        const previewColumn = page.locator(".preview-column");
        const leftColumn = page.locator(".main-grid > section").first();

        await expect(sidebar).toBeVisible();
        await expect(previewColumn).toBeVisible();

        const leftBox = await leftColumn.boundingBox();
        const rightBox = await previewColumn.boundingBox();

        expect(Math.abs((leftBox?.y || 0) - (rightBox?.y || 0))).toBeLessThan(8);
        expect((rightBox?.width || 0)).toBeGreaterThanOrEqual(330);
        expect((rightBox?.width || 0)).toBeLessThanOrEqual(360);

        await page.setViewportSize({ width: 430, height: 932 });
        await expect(sidebar).toBeHidden();

        const stackedLeft = await leftColumn.boundingBox();
        const stackedRight = await previewColumn.boundingBox();

        expect((stackedRight?.y || 0)).toBeGreaterThan((stackedLeft?.y || 0));

        const hasHorizontalOverflow = await page.evaluate(
            () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
        );
        expect(hasHorizontalOverflow).toBeFalsy();
    });

    test("genera QR y habilita descarga con URL valida", async ({ page }) => {
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

    test("valida error con URL invalida", async ({ page }) => {
        const input = page.locator("#qr-url-input");
        const error = page.locator("#qr-url-error");
        const downloadBtn = page.locator("#qr-download-btn");
        const placeholder = page.locator("#qr-placeholder");

        await input.fill("not-a-valid-url");

        await expect(error).toBeVisible();
        await expect(downloadBtn).toBeDisabled();
        await expect(placeholder).toHaveCSS("opacity", "1");
    });

    test("texto largo no rompe el layout ni crea overflow", async ({ page }) => {
        const longUrl = "https://example.com/" + "a".repeat(200);
        await page.locator("#qr-url-input").fill(longUrl);

        const hasHorizontalOverflow = await page.evaluate(
            () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
        );
        expect(hasHorizontalOverflow).toBeFalsy();
    });

    test("descarga el QR cuando esta listo", async ({ page }) => {
        await page.locator("#qr-url-input").fill("https://example.com");
        await expect(page.locator("#qr-download-btn")).toBeEnabled();

        const [download] = await Promise.all([
            page.waitForEvent("download"),
            page.click("#qr-download-btn"),
        ]);

        expect(download.suggestedFilename()).toContain(".png");
    });

    test("accesibilidad basica: atributos aria y navegacion con teclado", async ({ page }) => {
        const input = page.locator("#qr-url-input");
        const downloadBtn = page.locator("#qr-download-btn");

        await expect(input).toHaveAttribute("aria-label", /URL para generar el QR/i);
        await expect(downloadBtn).toHaveAttribute("aria-label", /Descargar codigo QR/i);

        await page.keyboard.press("Tab");
        const activeTag = await page.evaluate(() => document.activeElement?.tagName || "");
        expect(activeTag).not.toBe("");
    });
});
