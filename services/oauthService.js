/**
 * Cognifyz Web Development Internship - Level 3, Task 8
 * OAuth 2.0 Authorization Code Grant Flow Simulation Service
 */

const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const REGISTERED_CLIENTS = {
  'cognifyz_app_2026': {
    clientId: 'cognifyz_app_2026',
    clientSecret: 'secret_key_cognifyz_99',
    clientName: 'EduPortal Academic Web Client',
    allowedRedirectUris: [
      'http://localhost:3000/#oauth-demo',
      'http://localhost:3000/oauth/callback',
      'http://localhost:3000',
      'http://localhost:3000/'
    ],
    allowedScopes: ['read:profile', 'read:courses', 'write:registrations']
  }
};

const authCodesStore = new Map();
const refreshTokensStore = new Map();
const OAUTH_JWT_SECRET = 'oauth_cognifyz_task8_secret_key_2026';

function generateAuthorizationCode({ clientId, redirectUri, scope, state, userId = 'user_student_101' }) {
  const client = REGISTERED_CLIENTS[clientId];
  if (!client) {
    throw { status: 400, message: `Invalid client_id '${clientId}'.` };
  }

  const effectiveRedirectUri = redirectUri && redirectUri.trim() !== '' ? redirectUri.trim() : client.allowedRedirectUris[0];
  const code = 'code_auth_' + crypto.randomBytes(16).toString('hex');
  const expiresAt = Date.now() + 5 * 60 * 1000;

  authCodesStore.set(code, {
    clientId,
    redirectUri: effectiveRedirectUri,
    scope: scope || 'read:profile',
    userId,
    expiresAt,
    used: false
  });

  return {
    success: true,
    authorizationCode: code,
    expiresInSeconds: 300,
    redirectUri: effectiveRedirectUri,
    state: state || 'state_nonce_123',
    clientName: client.clientName,
    grantedScope: scope || 'read:profile'
  };
}

function exchangeToken({ grantType, clientId, clientSecret, code, redirectUri, refreshToken }) {
  const client = REGISTERED_CLIENTS[clientId];
  if (!client) {
    throw { status: 400, message: `Invalid client_id '${clientId}'.` };
  }

  if (client.clientSecret !== clientSecret) {
    throw { status: 401, message: "Invalid client_secret. Authorization code exchange rejected." };
  }

  if (grantType === 'authorization_code') {
    if (!code) {
      throw { status: 400, message: "Missing required parameter 'code'." };
    }

    const codeData = authCodesStore.get(code);
    if (!codeData) {
      throw { status: 400, message: "Invalid or expired authorization code." };
    }

    if (codeData.used) {
      authCodesStore.delete(code);
      throw { status: 400, message: "Authorization code has already been redeemed." };
    }

    if (Date.now() > codeData.expiresAt) {
      authCodesStore.delete(code);
      throw { status: 400, message: "Authorization code has expired." };
    }

    codeData.used = true;
    authCodesStore.delete(code);

    const accessToken = jwt.sign(
      {
        sub: codeData.userId,
        iss: 'Cognifyz-OAuth2-Provider',
        aud: clientId,
        scope: codeData.scope,
        tokenType: 'Bearer'
      },
      OAUTH_JWT_SECRET,
      { expiresIn: '1h' }
    );

    const newRefreshToken = 'oauth_rt_' + crypto.randomBytes(24).toString('hex');
    refreshTokensStore.set(newRefreshToken, {
      clientId,
      userId: codeData.userId,
      scope: codeData.scope,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000
    });

    return {
      success: true,
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: 3600,
      refresh_token: newRefreshToken,
      scope: codeData.scope,
      issued_at: new Date().toISOString()
    };
  } else if (grantType === 'refresh_token') {
    if (!refreshToken) {
      throw { status: 400, message: "Missing parameter 'refresh_token'." };
    }

    const rtData = refreshTokensStore.get(refreshToken);
    if (!rtData || Date.now() > rtData.expiresAt) {
      throw { status: 401, message: "Invalid or expired refresh token." };
    }

    const newAccessToken = jwt.sign(
      {
        sub: rtData.userId,
        iss: 'Cognifyz-OAuth2-Provider',
        aud: clientId,
        scope: rtData.scope,
        tokenType: 'Bearer'
      },
      OAUTH_JWT_SECRET,
      { expiresIn: '1h' }
    );

    return {
      success: true,
      access_token: newAccessToken,
      token_type: 'Bearer',
      expires_in: 3600,
      scope: rtData.scope,
      issued_at: new Date().toISOString()
    };
  } else {
    throw { status: 400, message: `Unsupported grant_type '${grantType}'.` };
  }
}

function getProtectedResource(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw { status: 401, message: "Missing or invalid OAuth Bearer token in Authorization header." };
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, OAUTH_JWT_SECRET);
    
    return {
      success: true,
      message: "OAuth 2.0 Protected Resource Accessed Successfully!",
      client: REGISTERED_CLIENTS[decoded.aud] ? REGISTERED_CLIENTS[decoded.aud].clientName : decoded.aud,
      scope: decoded.scope,
      userProfile: {
        userId: decoded.sub,
        name: "Nishandhinee M (OAuth User)",
        email: "nishandhinee@cognifyz-edu.com",
        role: "Student Fellow",
        enrolledCourses: [
          "Advanced Web Engineering (CSE-401)",
          "Cloud API Security & OAuth 2.0 (CSE-408)",
          "Database Architecture & Design (CSE-305)"
        ],
        academicGpa: "3.92 / 4.0",
        memberSince: "2024-08-15"
      },
      tokenMeta: {
        issuer: decoded.iss,
        expiresAt: new Date(decoded.exp * 1000).toISOString()
      }
    };
  } catch (err) {
    throw { status: 401, message: "Invalid or expired OAuth access token. Access denied." };
  }
}

module.exports = {
  REGISTERED_CLIENTS,
  generateAuthorizationCode,
  exchangeToken,
  getProtectedResource
};
