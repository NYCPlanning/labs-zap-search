import { FactoryProvider, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import msal from '@azure/msal-node';

export type MsalProviderType = {
  getGraphClientToken: () => Promise<msal.AuthenticationResult>;
  sharePointSiteUrl: string;
};
export const MSAL = Symbol('MSAL_SERVICE');
export const MsalProvider: FactoryProvider<MsalProviderType> = {
  provide: MSAL,
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    const tenantId: string | undefined = config.get('TENANT_ID');
    const clientId: string | undefined = config.get('SHAREPOINT_CLIENT_ID_GRAPH');
    const clientSecret: string | undefined = config.get(
      'SHAREPOINT_CLIENT_SECRET_GRAPH',
    );
    const siteId: string | undefined = config.get('SHAREPOINT_SITE_ID_GRAPH');
    if (
      tenantId === undefined ||
      clientId === undefined ||
      clientSecret === undefined ||
      siteId === undefined
    )
      throw new Error('Missing SharePoint credential');

    const cca = new msal.ConfidentialClientApplication({
      auth: {
        clientId,
        clientSecret,
        authority: `https://login.microsoftonline.com/${tenantId}`,
      },
    });
    const graphBaseUrl = 'https://graph.microsoft.com';
    const scopes = [`${graphBaseUrl}/.default`];
    const sharePointSiteUrl = `${graphBaseUrl}/v1.0/sites/${siteId}`;

    // Method also checks for a cached token before calling security token service
    // https://github.com/MicrosoftDocs/entra-docs/blob/main/docs/identity-platform/msal-acquire-cache-tokens.md#recommended-call-pattern-for-public-client-applications
    const getGraphClientToken = () => {
      try {
        return cca.acquireTokenByClientCredential({
          scopes,
        });
      } catch {
        throw new HttpException(
          {
            code: 'GRAPH_TOKEN_ERROR',
            title: 'Error retrieving Graph token',
            detail: 'Error retrieving Graph token',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    };

    return {
      getGraphClientToken,
      sharePointSiteUrl,
    };
  },
};
