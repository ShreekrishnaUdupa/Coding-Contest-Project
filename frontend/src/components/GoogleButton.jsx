import googleLogo from '../assets/google-logo.svg';

export default function GoogleButton () {
  
  const googleClientId = '526158806621-o7d11om8t87sgi09uncq4qe45d65mh9f.apps.googleusercontent.com';
  const redirectUri = 'http://localhost:5173/oauth/callback?provider=google';
  const scope = 'openid email profile';

  const googleLogin = () => {
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(googleClientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&access_type=offline&include_granted_scopes=true`;
  }

  return (
    <button
      onClick={googleLogin}
      className="flex items-center justify-center cursor-pointer gap-2 px-4 py-3 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors duration-200"
    >
      <img src={googleLogo} alt="Google" className="w-5 h-5" />
    </button>
  );
}