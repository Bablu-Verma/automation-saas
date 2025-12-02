import express from 'express'
import { OAuthCallback, OAuthScopes } from './OAuth2';

const route = express.Router();


route.post("/oauth/google", OAuthScopes);
route.get("/oauth/google/callback", OAuthCallback);



export default route;