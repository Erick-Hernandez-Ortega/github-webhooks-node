import { envs } from "../config/envs";

export class DiscordService {
  private readonly discordWebhookUrl: string = envs.DISCORD_WEBHOOK_URL;

  constructor() {}

  async notify(message: string): Promise<boolean> {
    const body = {
      content: message,
    };

    const reponse: Response = await fetch(this.discordWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!reponse.ok) {
      console.error("Error sending message to discord");
      return false;
    }

    return true;
  }
}
