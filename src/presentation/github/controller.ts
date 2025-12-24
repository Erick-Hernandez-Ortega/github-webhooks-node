import { Request, Response } from "express";
import { GithubService } from "../../services/github.service";
import { DiscordService } from "../../services/discord.service";

export class GithubController {
  constructor(
    private readonly githubService: GithubService = new GithubService(),
    private readonly discordService: DiscordService = new DiscordService(),
  ) {}

  webhookHandler(req: Request, res: Response) {
    const githubEvent: string | undefined = req.header("x-github-event");
    const payload: any = req.body;
    let message: string = "";

    switch (githubEvent) {
      case "star":
        message = this.githubService.onStar(payload);
        break;
      case "issues":
        message = this.githubService.onIssues(payload);
        break;
      default:
        message = `Unknow event: ${githubEvent}`;
        break;
    }

    this.discordService
      .notify(message)
      .then(() => {
        res.status(202).send("Accepted");
      })
      .catch((error: unknown) => {
        res.json(500).json({ error: "internal server error" });
      });
  }
}
