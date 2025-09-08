import { useGoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useEffect } from 'react';

export default function GoogleLoginPage () {
  return (
    <GoogleOAuthProvider clientId="526158806621-o7d11om8t87sgi09uncq4qe45d65mh9f.apps.googleusercontent.com">
        <GoogleLogin />
    </GoogleOAuthProvider>
  );
}

async function handleAuthCode (code) {

  try {
      const response = await fetch('http://localhost:4000/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });

      console.log('coming here');

      const data = await response.json();

      console.log('code: ', code);
      console.log('data: ', data);
  }

  catch (error) {
    console.error(error);
  }
  
}

function GoogleLogin () {
  
  useEffect (() => {

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    console.log(code);

    if (code) {
      handleAuthCode(code);
    }
  }, []);

  const googleLogin = useGoogleLogin({
    flow: 'auth-code',
    ux_mode: 'redirect',
    redirect_uri: 'http://localhost:5173/temp'
  });

  return (
    <div className='App'>
      <button onClick={googleLogin}>
        Login with Google brooo 
      </button>
    </div>
  );
}

// function GoogleLogin () {
  
//   useEffect(() => {

//     const urlParams = new URLSearchParams(window.location.search);
//     console.log(urlParams.size);
//     const code = urlParams.get('code');
    
//     if (code) {
//       // Process the code
//       handleAuthCode(code);
      
//       // Clean up the URL (optional)
//       window.history.replaceState({}, document.title, window.location.pathname);
//     }
//   }, []);

//   const handleAuthCode = async (code) => {
//     try {
//       console.log('Got code:', code);

//       const response = await fetch('http://localhost:4000/api/auth/google', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ code })
//       });

//       const data = await response.json();
//       console.log('Server responded with this data', data);
      
//       // Handle successful login (redirect to dashboard, store tokens, etc.)
      
//     } catch (error) {
//       console.error('Error while requesting google code: ', error);
//     }
//   };
  
// }