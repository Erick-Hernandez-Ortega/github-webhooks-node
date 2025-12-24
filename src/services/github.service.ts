import { GitHubIssueWebhook } from "../interfaces/github-issue.interface";
import { GitHubStarWebhook } from "../interfaces/github-start.interface";

export class GithubService {
  constructor() {}
  
  onStar(payload: GitHubStarWebhook): string{
    const { action, sender, repository } = payload;
    return `User ${sender.login} ${action} star on ${repository.full_name}`;
  }
  
  onIssues(payload: GitHubIssueWebhook): string {
    const { action, issue } = payload;
    const actions: string[] = ['opened', 'closed', 'reopened']
    
    if (actions.includes(action)) { 
      return `An issue was ${action} with this title ${issue.title}`
    }
    
    return `An unknow event`
  }
}