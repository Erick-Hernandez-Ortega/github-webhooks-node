import express from 'express';
import { envs } from './config/envs';
import { GithubController } from './presentation/github/controller';

((): void => {
  main();
})();

function main(): void {
  const app = express();
  
  const controller: GithubController = new GithubController();
  
  app.use(express.json());
 
  app.post('/api/github', controller.webhookHandler);
  
  app.listen(envs.PORT, (): void => {
    console.log(`App running on port ${envs.PORT}`)
  });
}