export default function GithubButton () {

  const githubClientId = 'Ov23liU9rpwmoyU3qoVa';
  const redirectUri = 'http://localhost:5173/oauth/callback?provider=github';
  const scope = 'read:user user:email';

  const githubLogin = () => {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${encodedURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
  }

  return (
    <div>
      <button onClick={githubLogin}>
        Github Baba
      </button>
    </div>
  );

}