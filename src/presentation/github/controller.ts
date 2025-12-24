import { Request, Response } from "express";

export class GithubController {
  constructor(){}
  
  webhookHandler(req: Request, res: Response) {
    const githubEvent = req.header('x-github-event');
    const payload = req.body;
    
    console.log(payload)
    
    res.status(202).send('Accepted');
  }
}