import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";

import { AWS_REGION } from "@/constants";

export const cognitoClient = new CognitoIdentityProviderClient({
  region: AWS_REGION,
});
