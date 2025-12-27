import express from "express";
import { envs } from "./config/envs";
import { GithubController } from "./presentation/github/controller";
import { GithubSha256Middleware } from "./presentation/github/middlewares/github-sha256.middleware";

((): void => {
  main();
})();

function main(): void {
  const app = express();

  const controller: GithubController = new GithubController();

  app.use(express.json());

  app.use(GithubSha256Middleware.verifyGithubSignature);

  app.post("/api/github", controller.webhookHandler.bind(controller));

  app.listen(envs.PORT, (): void => {
    console.log(`App running on port ${envs.PORT}`);
  });
}
