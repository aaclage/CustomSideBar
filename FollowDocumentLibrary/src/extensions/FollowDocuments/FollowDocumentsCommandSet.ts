import * as React from 'react';
import * as ReactDom from 'react-dom';

import { override } from "@microsoft/decorators";
import { Log } from "@microsoft/sp-core-library";
import {
  BaseListViewCommandSet,
  Command,
  ListViewCommandSetContext,
  IListViewCommandSetListViewUpdatedParameters,
  IListViewCommandSetExecuteEventParameters,
} from "@microsoft/sp-listview-extensibility";
import { ExtensionContext } from '@microsoft/sp-extension-base';
import { Providers, SharePointProvider } from "@microsoft/mgt";

import * as strings from "FollowDocumentsCommandSetStrings";
import followDocumentDialog from "../components/followDocumentDialog/followDocumentDialog";
import { followDocumentListPanel } from '../components/followDocumentList/followDocumentList';
import { IfollowDocumentListProps } from '../components/followDocumentList/IfollowDocumentListProps';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IFollowDocumentsCommandSetProperties {
  sampleTextOne: string;
  sampleTextTwo: string;
}

export interface IFileProperties {
  fileUrl?: string;
  fileIcon?: string;
  TenantUrl?: string;
  DriveId?: string;
  ItemID?: string;
  context?: ListViewCommandSetContext;
}

const LOG_SOURCE: string = "FollowDocumentsCommandSet";

export default class FollowDocumentsCommandSet extends BaseListViewCommandSet<IFollowDocumentsCommandSetProperties> {
  private fileInfo: IFileProperties[] = [];
  private _panelPlaceHolder: HTMLDivElement = null;
  
  @override
  public onInit(): Promise<void> {
    Providers.globalProvider = new SharePointProvider(this.context);
    this._panelPlaceHolder = document.body.appendChild(document.createElement("div"));
    return Promise.resolve();
  }

  @override
  public onListViewUpdated(
    event: IListViewCommandSetListViewUpdatedParameters
  ): void {
    const compareOneCommand: Command = this.tryGetCommand("COMMAND_1");
    if (compareOneCommand) {
      if (event.selectedRows.length === 1) {
        console.log(event.selectedRows[0]);
        let TenantUrl = this.context.pageContext.site.absoluteUrl.replace(
          this.context.pageContext.site.serverRelativeUrl,
          ""
        );
        let DriveID = event.selectedRows[0].getValueByName(".spItemUrl");
        DriveID = DriveID.substring(
          DriveID.indexOf("/drives/") + 8,
          DriveID.lastIndexOf("/items")
        );
        let ItemID = event.selectedRows[0].getValueByName(".spItemUrl");
        ItemID = ItemID.substring(
          ItemID.lastIndexOf("/items/") + 7,
          ItemID.lastIndexOf("?")
        );
        this.fileInfo = [];
        this.fileInfo.push({
          TenantUrl: TenantUrl,
          fileUrl: TenantUrl + event.selectedRows[0].getValueByName("FileRef"),
          fileIcon:
            this.context.pageContext.site.absoluteUrl +
            "/_layouts/15/images/" +
            event.selectedRows[0].getValueByName(
              "HTML_x0020_File_x0020_Type.File_x0020_Type.mapico"
            ),
          DriveId: DriveID,
          ItemID: ItemID,
          context: this.context,
        });
      }
      compareOneCommand.visible = event.selectedRows.length === 1;
    }
  }
  @override
  public onExecute(event: IListViewCommandSetExecuteEventParameters): void {
    switch (event.itemId) {
      case "COMMAND_1":
        const dialog: followDocumentDialog = new followDocumentDialog();
        dialog.initialize(this.fileInfo);
        break;
      case "COMMAND_2":
        this._showPanel();
        break;
      default:
        throw new Error("Unknown command");
    }
  }
  private _showPanel = (): void => {

    this._renderPanelComponent({
      context: this.context as ExtensionContext,
      isOpen: true,
    });
  }

  private _renderPanelComponent = (props: IfollowDocumentListProps): void => {
    const element: React.ReactElement<IfollowDocumentListProps> = React.createElement(followDocumentListPanel, props);
    ReactDom.render(element, this._panelPlaceHolder);
  }
}
