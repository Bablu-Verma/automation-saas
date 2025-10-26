import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

export function OAuthProvider_() {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_APP_GOOGLE_CLIENT_ID || ''}>
      <GoogleLogin
        onSuccess={credentialResponse => {
          console.log('Google credential:', credentialResponse);
          // credentialResponse.credential contains JWT, send to backend
        }}
        onError={() => {
          console.log('Login Failed');
        }}
      />
    </GoogleOAuthProvider>
  );
}
