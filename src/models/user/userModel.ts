import { User as Auth0User } from "@auth0/auth0-react";

export type TUser = Auth0User & {
  app_metadata: {
    is_active: boolean;
    roles: string[];
  };
};
