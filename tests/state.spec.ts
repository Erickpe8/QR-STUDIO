import { test, expect } from "@playwright/test";
import { buildQrDataByType } from "../src/state.js";

test.describe("State helpers", () => {
    test("builds trimmed URL payload", () => {
        const payload = buildQrDataByType("url", {
            url: " https://example.com/path ",
        });
        expect(payload).toBe("https://example.com/path");
    });

    test("builds WiFi payload with chosen encryption and hidden flag", () => {
        const payload = buildQrDataByType("wifi", {
            ssid: "Home Network",
            password: "secret",
            encryption: "WPA/WPA2",
            hidden: true,
        });
        expect(payload).toBe("WIFI:T:WPA;S:Home Network;P:secret;H:true;;");
    });

    test("builds contact vCard with optional fields", () => {
        const payload = buildQrDataByType("contact", {
            fullName: "Jane Doe",
            phone: "+549112345678",
            email: "jane@example.com",
            company: "Acme Corp",
            title: "Founder",
            website: "https://acme.com",
        });
        expect(payload).toContain("BEGIN:VCARD");
        expect(payload).toContain("FN:Jane Doe");
        expect(payload).toContain("TEL:+549112345678");
        expect(payload).toContain("EMAIL:jane@example.com");
        expect(payload).toContain("ORG:Acme Corp");
        expect(payload).toContain("TITLE:Founder");
        expect(payload).toContain("URL:https://acme.com");
        expect(payload).toContain("END:VCARD");
    });

    test("builds WhatsApp link encoding message and cleaning phone", () => {
        const payload = buildQrDataByType("whatsapp", {
            phone: "+57 300 123 4567",
            message: "Hola mundo + amigos",
        });
        expect(payload).toContain("https://wa.me/573001234567");
        expect(payload).toContain("?text=Hola%20mundo%20%2B%20amigos");
    });

    test("builds Google Maps link for a given address", () => {
        const payload = buildQrDataByType("location", {
            address: "Av. Libertad 123, Buenos Aires",
        });
        expect(payload).toBe(
            "https://www.google.com/maps?q=Av.%20Libertad%20123%2C%20Buenos%20Aires"
        );
    });

    test("builds event ICS with mandatory and optional details escaped", () => {
        const payload = buildQrDataByType("event", {
            title: "Gran Evento",
            startDate: "2025-09-01",
            startTime: "14:30",
            endDate: "2025-09-01",
            endTime: "16:00",
            location: "Ciudad, Capital",
            description: "Línea 1\nLínea 2, con coma",
        });
        expect(payload).toContain("BEGIN:VCALENDAR");
        expect(payload).toContain("SUMMARY:Gran Evento");
        expect(payload).toContain("DTSTART:20250901T143000");
        expect(payload).toContain("DTEND:20250901T160000");
        expect(payload).toContain("LOCATION:Ciudad\\, Capital");
        expect(payload).toContain("DESCRIPTION:Línea 1\\nLínea 2\\, con coma");
        expect(payload).toContain("END:VEVENT");
        expect(payload).toContain("END:VCALENDAR");
    });

    test("builds mailto with encoded subject and body", () => {
        const payload = buildQrDataByType("email", {
            to: "contacto@example.com",
            subject: "Hola mundo",
            body: "Línea 1\nLínea 2",
        });
        expect(payload).toContain("mailto:contacto@example.com?");
        expect(payload).toContain("subject=Hola%20mundo");
        expect(payload).toContain("body=L%C3%ADnea%201%0AL%C3%ADnea%202");
    });

    test("builds telephone link stripping non numeric characters", () => {
        const payload = buildQrDataByType("phone", {
            phone: "+1 (555) 123-4567",
        });
        expect(payload).toBe("tel:+15551234567");
    });

    test("returns empty string for unsupported types", () => {
        const payload = buildQrDataByType("unknown" as any, {});
        expect(payload).toBe("");
    });
});
