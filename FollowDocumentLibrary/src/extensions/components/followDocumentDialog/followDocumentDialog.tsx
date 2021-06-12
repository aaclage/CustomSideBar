
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BaseDialog, IDialogConfiguration } from '@microsoft/sp-dialog';
import { IFileProperties } from "../../FollowDocuments/FollowDocumentsCommandSet";
import RestService from "../../Services/RestService";

import { FollowDocument } from "../FollowDocument/followDocument";


export default class followDocumentDialog extends BaseDialog {
    public fileInfo: IFileProperties[] = [];
    private followStatus: boolean = false;

    public async initialize(info: IFileProperties[]) {
        this.fileInfo = info;
        const restService: RestService = new RestService();
        const followDocumentExist = await restService.isfollowed(this.fileInfo[0].context.spHttpClient, this.fileInfo[0].fileUrl, this.fileInfo[0].context.pageContext.site.absoluteUrl);
        if (followDocumentExist) {
            this.followStatus = followDocumentExist;
            this.show();
        } else {
            this.followStatus = followDocumentExist;
            this.show();
        }
    }

    public render(): void {
        const reactElement =
            <FollowDocument
                fileInfo={this.fileInfo}
                close={this.close}
                followStatus={this.followStatus}
            />;

        ReactDOM.render(reactElement, this.domElement);
    }

    public getConfig(): IDialogConfiguration {
        return {
            isBlocking: false
        };
    }

}