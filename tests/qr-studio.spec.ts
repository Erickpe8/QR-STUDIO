import { test, expect } from "@playwright/test";
import { goToContentStep, goToDesignStep } from "./utils";

test.describe("QR Studio editor layout", () => {
    test("Step 1 no renderiza preview ni columnas extras", async ({ page }) => {
        await page.goto("/");
        await expect(page.locator("#preview-column")).toHaveCount(0);
        await expect(page.locator(".main-content")).toHaveCount(0);
    });

    test("Step 1 selecciÃ³n de tipo avanza automÃ¡ticamente al contenido", async ({ page }) => {
        await page.goto("/");
        await page.click('[data-qr-type="wifi"]');
        await expect(page.locator("#options-column input").first()).toBeVisible({ timeout: 5000 });
        await expect(page.locator("#preview-column")).toBeVisible({ timeout: 5000 });
    });

    test("Step 2 muestra formulario a la izquierda y preview sticky a la derecha", async ({ page }) => {
        await goToContentStep(page);
        await page.setViewportSize({ width: 1280, height: 900 });

        const leftColumn = page.locator("#options-column");
        const previewColumn = page.locator("#preview-column");
        await expect(leftColumn).toBeVisible();
        await expect(previewColumn).toBeVisible();

        const leftBox = await leftColumn.boundingBox();
        const previewBox = await previewColumn.boundingBox();

        expect(Math.abs((leftBox?.y || 0) - (previewBox?.y || 0))).toBeLessThan(20);

        const isRight = await previewColumn.evaluate(preview => {
            const left = document.getElementById("options-column");
            if (!left) return false;
            const previewLeft = preview.offsetLeft;
            const leftRight = left.offsetLeft + left.offsetWidth;
            return previewLeft >= leftRight - 8;
        });
        expect(isRight).toBe(true);
    });

    test("Step 3 mantiene preview a la derecha mientras diseÃ±as", async ({ page }) => {
        await goToDesignStep(page);
        await page.setViewportSize({ width: 1280, height: 900 });

        const leftColumn = page.locator("#options-column");
        const previewColumn = page.locator("#preview-column");
        await expect(leftColumn).toBeVisible();
        await expect(previewColumn).toBeVisible();

        const leftBox = await leftColumn.boundingBox();
        const previewBox = await previewColumn.boundingBox();

        expect(Math.abs((leftBox?.y || 0) - (previewBox?.y || 0))).toBeLessThan(20);

        const isRight = await previewColumn.evaluate(preview => {
            const left = document.getElementById("options-column");
            if (!left) return false;
            const previewLeft = preview.offsetLeft;
            const leftRight = left.offsetLeft + left.offsetWidth;
            return previewLeft >= leftRight - 8;
        });
        expect(isRight).toBe(true);
    });
});

test.describe("QR Studio content flow", () => {
    test.beforeEach(async ({ page }) => {
        await goToContentStep(page);
    });

    test("QB Url valida habilita descarga", async ({ page }) => {
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

    test("Url invalida muestra error y deshabilita descarga", async ({ page }) => {
        const input = page.locator("#qr-url-input");
        const error = page.locator("#qr-url-error");
        const downloadBtn = page.locator("#qr-download-btn");
        const placeholder = page.locator("#qr-placeholder");

        await input.fill("not-a-valid-url");
        await input.press("Tab");

        await expect(error).toBeVisible();
        await expect(downloadBtn).toBeDisabled();
        await expect(placeholder).toHaveCSS("opacity", "1");
    });

    test("WhatsApp valida telefono solo tras blur", async ({ page }) => {
        await page.goto("/");
        await page.click('[data-qr-type="whatsapp"]');
        const phoneField = page.locator("#whatsapp-phone");
        const error = page.locator("#whatsapp-phone-error");

        await expect(error).toBeHidden();
        await phoneField.fill("123");
        await phoneField.blur();
        await expect(error).toBeVisible();
        await phoneField.fill("+51911234567");
        await phoneField.blur();
        await expect(error).toBeHidden();
    });

    test("descarga emite PNG cuando el QR estÃ¡ listo", async ({ page }) => {
        const downloadBtn = page.locator("#qr-download-btn");
        await page.locator("#qr-url-input").fill("https://example.com");
        await expect(downloadBtn).toBeEnabled();

        const [download] = await Promise.all([
            page.waitForEvent("download"),
            downloadBtn.click(),
        ]);

        expect(download.suggestedFilename()).toMatch(/qr-ticket-\d{8}-\d{4}\.png/);
    });
});

test.describe("Flujos adicionales Step 2 y 3", () => {
    test("Wi-Fi pide SSID y habilita el botón continuar", async ({ page }) => {
        await page.goto("/");
        await page.click('[data-qr-type="wifi"]');

        const ssid = page.locator("#wifi-ssid");
        const error = page.locator("#wifi-ssid-error");
        const nextBtn = page.locator("#qr-content-next");

        await ssid.fill("");
        await ssid.blur();
        await expect(error).toBeVisible();
        await expect(nextBtn).toBeDisabled();

        await ssid.fill("MiRed");
        await ssid.blur();
        await expect(error).toBeHidden();
        await expect(nextBtn).toBeEnabled();
    });

    test("Contacto requiere nombre completo antes de avanzar", async ({ page }) => {
        await page.goto("/");
        await page.click('[data-qr-type="contact"]');

        const name = page.locator("#contact-name");
        const error = page.locator("#contact-name-error");
        const nextBtn = page.locator("#qr-content-next");

        await name.fill("");
        await name.blur();
        await expect(error).toBeVisible();
        await expect(nextBtn).toBeDisabled();

        await name.fill("Erick Perez");
        await name.blur();
        await expect(error).toBeHidden();
        await expect(nextBtn).toBeEnabled();
    });

});
