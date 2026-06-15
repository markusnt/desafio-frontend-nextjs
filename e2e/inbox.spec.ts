import { expect, test } from "@playwright/test";

test.describe("Inbox WhatsApp", () => {
  test("listar conversas, abrir chat, enviar mensagem e sugerir resposta IA", async ({ page }) => {
    await page.goto("/inbox");

    const listbox = page.getByRole("listbox", { name: "Lista de conversas" });
    await expect(listbox).toBeVisible({ timeout: 30_000 });

    const firstConversation = page.getByRole("option").first();
    await expect(firstConversation).toBeVisible();
    await firstConversation.click();

    await expect(page.getByRole("log", { name: "Histórico de mensagens" })).toBeVisible({
      timeout: 30_000,
    });

    const composer = page.getByRole("textbox", { name: "Mensagem" });
    const uniqueText = `E2E ${Date.now()}`;

    await composer.fill(uniqueText);
    await page.getByRole("button", { name: "Enviar mensagem" }).click();

    const messageLog = page.getByRole("log", { name: "Histórico de mensagens" });
    await expect(messageLog.getByText(uniqueText)).toBeVisible({ timeout: 15_000 });

    await page.getByRole("button", { name: "Sugerir resposta com IA" }).click();
    await expect(composer).not.toHaveValue("", { timeout: 20_000 });
  });
});
