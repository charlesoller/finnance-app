import { defineAuth, secret } from '@aws-amplify/backend';

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
    externalProviders: {
      google: {
        clientId: secret('GOOGLE_CLIENT_ID'),
        clientSecret: secret('GOOGLE_CLIENT_SECRET'),

        attributeMapping: {
          email: 'email',
        },
        scopes: ['email', 'profile'],
      },
      callbackUrls: [
        'http://localhost:3001/',
        'https://main.d31aw9xyzenv14.amplifyapp.com/chat/e7e36163-2571-41e7-b973-55738bfcc7ec',
      ],
      logoutUrls: [
        'http://localhost:3001/',
        'https://main.d31aw9xyzenv14.amplifyapp.com/chat/e7e36163-2571-41e7-b973-55738bfcc7ec',
      ],
    },
  },
});
