import * as ADALNode from 'adal-node';

export const ADAL = {
  ADAL_CONFIG: {
    CRMUrl: '',
    webAPIurl: '',
    clientId: '',
    clientSecret: '',
    tenantId: '',
    authorityHostUrl: '',
    tokenPath: '',
  },

  token: null,
  expirationDate: null,
  acquireToken() {
    return new Promise((resolve, reject) => {
      if (this.expirationDate) {
        const tokenLimit = new Date(this.expirationDate.getTime() - (15*60*1000));
        const now = new Date();

        if (now <= tokenLimit){
          resolve(this.token);

          return;
        }
      }

      const { AuthenticationContext } = ADALNode;
      const {
        authorityHostUrl,
        tenantId,
        tokenPath,
        clientId,
        clientSecret,
        CRMUrl,
      } = this.ADAL_CONFIG;
      const context = new AuthenticationContext(`${authorityHostUrl}/${tenantId}${tokenPath}`);

      context.acquireTokenWithClientCredentials(CRMUrl, clientId, clientSecret,
        (err, tokenResponse:any ) => {
          if (err) {
            console.log(`well that didn't work: ${err.stack}`);
            reject(err);
          }

          const {
            accessToken,
            expiresOn,
          } = tokenResponse;

          this.token = accessToken;
          this.expirationDate = expiresOn;

          resolve(accessToken);
        }
      );
    })
  },
};
