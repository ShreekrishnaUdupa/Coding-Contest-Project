import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OauthCallbackPage () {

  const navigate = useNavigate();

  useEffect (() => {
    const urlParams = new URLSearchParams(window.location.search);
    const provider = urlParams.get('provider');
    const code = urlParams.get('code');

    async function fetchData () {
      try {
        const response = await fetch (`http://localhost:4000/api/auth/${provider}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify ({code})
        });

        const data = await response.json();

        console.log(data);
        navigate ('/');
      }

      catch (error) {
        console.error(error);
      }
    }

    fetchData();

  }, []);

  return (
    <>
      Signing you in...
    </>
  );
}