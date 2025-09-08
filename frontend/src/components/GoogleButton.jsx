import { useGoogleLogin } from '@react-oauth/google';

export function GoogleButton () {

  const googleLogin = useGoogleLogin({
    ux_mode: 'redirect',
    redirect_uri: 'http://localhost:5173/oauth/callback?provider=google'
  });

  return (
    <div>
      <button onClick={googleLogin}>
        Google Baba
      </button>
    </div>
  );
}