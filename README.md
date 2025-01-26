# Mantine Next Template

# Linting

- Uses ESLint with Prettier
- Recommend installing ESLint and Prettier ESLint extensions

  - Follow setup guide in Prettier ESLint
  - yarn lint OR runs on commit

- Best Practices:

  - All styles should be provided via props or CSS modules, never inline styles

  # Authentication

  - Authentication uses AWS Amplify and Cognito
  - You need to have your Client ID and Secret ID set in AWS configure
  - Local Social Auth also requires you to configure secrets via CLI
  - You can run the sandbox with:

```bash
yarn ampx sandbox
```
