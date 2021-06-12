import {
  SPHttpClient,
  SPHttpClientResponse,
  ISPHttpClientOptions,
} from "@microsoft/sp-http";

export default class Rest {
  public async isfollowed(
    spHttpClient: SPHttpClient,
    fileUrl: string,
    siteUrl: string
  ): Promise<boolean> {
    const spOpts: ISPHttpClientOptions = {
      headers: {
        Accept: "application/json;odata.metadata=minimal",
        "Content-type": "application/json;odata=verbose",
      },
      body: `{'actor': { 'ActorType':1, 'ContentUri':'${fileUrl}', 'Id':null}}`,
    };

    const value = spHttpClient
      .post(
        `${siteUrl}/_api/social.following/isfollowed`,
        SPHttpClient.configurations.v1,
        spOpts
      )
      .then((response: SPHttpClientResponse): Promise<{
        value: boolean;
      }> => {
        // Access properties of the response object.
        console.log(`Status code: ${response.status}`);
        console.log(`Status text: ${response.statusText}`);

        //response.json() returns a promise so you get access to the json in the resolve callback.
        return response.json();
        /* response.json().then((responseJSON: JSON) => {
            console.log(responseJSON);
          });*/
      })
      .then((item: { value: boolean }) => {
        return item.value;
      });
    return value;
  }

  public async follow(
    spHttpClient: SPHttpClient,
    fileUrl: string,
    siteUrl: string
  ): Promise<boolean> {
    const spOpts: ISPHttpClientOptions = {
      headers: {
        Accept: "application/json;odata.metadata=minimal",
        "Content-type": "application/json;odata=verbose",
      },
      body: `{'actor': { 'ActorType':1, 'ContentUri':'${fileUrl}', 'Id':null}}`,
    };
    const value = await spHttpClient
      .post(
        `${siteUrl}/_api/social.following/follow`,
        SPHttpClient.configurations.v1,
        spOpts
      )
      .then((response: SPHttpClientResponse): Promise<number> => {
        // Access properties of the response object.
        console.log(`Status code: ${response.status}`);
        console.log(`Status text: ${response.statusText}`);

        return response.json();
      })
      .then((Value: number) => {
        return Value;
      });
    if (value === 0) {
      return true;
    } else {
      return false;
    }
  }

  public async stopfollowing(
    spHttpClient: SPHttpClient,
    fileUrl: string,
    siteUrl: string
  ): Promise<boolean> {
    const spOpts: ISPHttpClientOptions = {
      headers: {
        Accept: "application/json;odata.metadata=minimal",
        "Content-type": "application/json;odata=verbose",
      },
      body: `{'actor': { 'ActorType':1, 'ContentUri':'${fileUrl}', 'Id':null}}`,
    };
    const value = await spHttpClient
      .post(
        `${siteUrl}/_api/social.following/stopfollowing`,
        SPHttpClient.configurations.v1,
        spOpts
      )
      .then((response: SPHttpClientResponse) => {
        // Access properties of the response object.
        console.log(`Status code: ${response.status}`);
        console.log(`Status text: ${response.statusText}`);
        return true;
      });
    return value;
  }
  public async followed(spHttpClient: SPHttpClient, siteUrl: string) {
    const spOpts: ISPHttpClientOptions = {
      headers: {
        Accept: "application/json;odata.metadata=minimal",
        "Content-type": "application/json;odata=verbose",
      },
    };
    spHttpClient
      .post(
        `${siteUrl}/_api/social.following/my/followed(types=2)`,
        SPHttpClient.configurations.v1,
        spOpts
      )
      .then((response: SPHttpClientResponse) => {
        // Access properties of the response object.
        console.log(`Status code: ${response.status}`);
        console.log(`Status text: ${response.statusText}`);

        //response.json() returns a promise so you get access to the json in the resolve callback.
        response.json().then((responseJSON: JSON) => {
          console.log(responseJSON);
        });
      });
  }
}
