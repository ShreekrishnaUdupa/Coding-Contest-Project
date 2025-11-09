import githubLogo from '../assets/github-logo.svg';

export default function GithubButton () {

  const githubClientId = 'Ov23liU9rpwmoyU3qoVa';
  const redirectUri = 'http://localhost:5173/oauth/callback?provider=github';
  const scope = 'read:user user:email';

  const githubLogin = () => {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
  }

  return (
    <button
      onClick={githubLogin}
      className='flex items-center justify-center cursor-pointer gap-2 px-4 py-3 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors duration-200'  
    >
      <img src={githubLogo} alt='Github' className='w-5 h-5' />
    </button>
  );
}