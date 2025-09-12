import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OAuthCallback () {

  const navigate = useNavigate();
  const called = useRef(false);

  useEffect (() => {
    const urlParams = new URLSearchParams(window.location.search);
    const provider = urlParams.get('provider');
    const code = urlParams.get('code');

    if (called.current) return;
    called.current = true;

    async function fetchData () {
      try {
        const response = await fetch (`http://localhost:4000/api/auth/${provider}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
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