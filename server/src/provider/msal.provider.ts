import { FactoryProvider } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { ConfidentialClientApplication } from '@azure/msal-node';

export type MsalProviderType = {
  cca: ConfidentialClientApplication;
  scopes: Array<string>;
  sharePointSiteUrl: string;
};
export const MSAL = Symbol('MSAL_SERVICE');
export const MsalProvider: FactoryProvider<MsalProviderType> = {
  provide: MSAL,
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    const tenantId: string | undefined = config.get('TENANT_ID');
    const clientId: string | undefined = config.get(
      'SHAREPOINT_CLIENT_ID_GRAPH',
    );
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

    const cca = new ConfidentialClientApplication({
      auth: {
        clientId,
        clientSecret,
        authority: `https://login.microsoftonline.com/${tenantId}`,
      },
    });
    const graphBaseUrl = 'https://graph.microsoft.com';
    const scopes = [`${graphBaseUrl}/.default`];
    const sharePointSiteUrl = `${graphBaseUrl}/v1.0/sites/${siteId}`;
    return {
      cca,
      scopes,
      sharePointSiteUrl,
    };
  },
};
