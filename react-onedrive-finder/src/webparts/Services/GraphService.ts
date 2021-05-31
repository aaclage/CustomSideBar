import { MSGraphClientFactory, MSGraphClient } from "@microsoft/sp-http";

export default class GraphService {
  private client: MSGraphClient;

  public async initialize(serviceScope): Promise<boolean> {
    const graphFactory: MSGraphClientFactory = serviceScope.consume(
      MSGraphClientFactory.serviceKey
    );

    return graphFactory.getClient().then((client) => {
      this.client = client;
      return true;
    });
  }

  public async uploadTmpFileToOneDrive(
    SiteId: string,
    ItemId: string,
    files: any
  ): Promise<string> {
    for (var i = 0; i < files.length; i++) {
      let apiUrl = "";
      if (SiteId !== "") {
        if (files[i].fullPath !== "") {
          if (ItemId !== "") {
            apiUrl = `sites/${SiteId}/drive/items/${ItemId}:${files[i].fullPath}:/`;
          } else {
            apiUrl = `sites/${SiteId}/drive/root:${files[i].fullPath}:/`;
          }
        } else {
          if (ItemId !== "") {
            apiUrl = `sites/${SiteId}/drive/items/${ItemId}:/${files[i].name}:/`;
          } else {
            apiUrl = `sites/${SiteId}/drive/root:/${files[i].name}:/`;
          }
        }
      } else {
        if (files[i].fullPath === "") {
          apiUrl = `me/drive/root:${files[i].fullPath}:/`;
        } else {
          apiUrl = `me/drive/root:/${files[i].name}:/`;
        }
      }
      //createUploadSession or content
      const response = await this.uploadFile(apiUrl, files[i]);
      const fileID = response;
      console.log(fileID);
      console.log("Filename: " + files[i].name);
      console.log("Path: " + files[i].fullPath);
    }

    return "success";
  }

  private async uploadFile(apiUrl: string, file) {
    if (file.size < 4 * 1024 * 1024) {
      const resp = await this.client.api(apiUrl + "content").put(file);
      return resp;
    } else {
      const resp = await this.saveLargeFile(
        apiUrl + "createUploadSession",
        file
      );
      return resp;
    }
  }

  public async deleteTmpFileFromOneDrive(fileID: string) {
    const apiUrl = `me/drive/items/${fileID}`;
    this.client.api(apiUrl).delete();
  }

  readFileContent(file: File): Promise<string | ArrayBuffer> {
    return new Promise<string | ArrayBuffer>((resolve, reject) => {
      const myReader: FileReader = new FileReader();

      myReader.onloadend = (e) => {
        resolve(myReader.result);
      };

      myReader.onerror = (e) => {
        reject(e);
      };

      myReader.readAsArrayBuffer(file);
    });
  }

  public async saveLargeFile(apiUrl, file: File) {
    const sessionOptions = {
      item: {
        "@microsoft.graph.conflictBehavior": "rename",
      },
    };
    console.log(file.size);

    return this.client
      .api("/" + apiUrl)
      .post(JSON.stringify(sessionOptions))
      .then(async (response): Promise<any> => {
        try {
          console.log(
            `Upload URL created for ${file.name}: ${response.uploadUrl}`
          );
          const resp = await this.saveToUploadSession(file, response.uploadUrl);
          console.log(`Save Large Attachment result for ${file.name}: `, resp);
          return resp;
        } catch (err) {
          return null;
        }
      });
  }

  private async saveToUploadSession(mimeStream: File, uploadUrl: string) {
    let minSize = 0;
    let maxSize = 5 * 327680;
    while (mimeStream.size > minSize) {
      const mimeStreamString = await this.readFileContent(mimeStream);
      const fileSlice = mimeStreamString.slice(minSize, maxSize);
      const resp = await this.uploadFileSlice(
        uploadUrl,
        minSize,
        maxSize,
        mimeStream.size,
        fileSlice
      );
      minSize = maxSize;
      maxSize += 5 * 327680;
      if (maxSize > mimeStream.size) {
        maxSize = mimeStream.size;
      }
      if (resp.id !== undefined) {
        return resp;
      }
    }
  }

  private async uploadFileSlice(
    uploadUrl: string,
    minSize: number,
    maxSize: number,
    totalSize: number,
    fileSlice: any
  ) {
    const header = {
      "Content-Length": `${maxSize - minSize}`,
      "Content-Range": `bytes ${minSize}-${maxSize - 1}/${totalSize}`,
    };
    const saveResult = await this.client
      .api(uploadUrl)
      .headers(header)
      .put(fileSlice);
    return saveResult;
  }
}
