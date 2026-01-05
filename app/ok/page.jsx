import GithubContributions from "./github-contributions";

export default function Profile() {
    const username = process.env.GITHUB_USERNAME;
  return (
    <GithubContributions username={username} />
  );
}