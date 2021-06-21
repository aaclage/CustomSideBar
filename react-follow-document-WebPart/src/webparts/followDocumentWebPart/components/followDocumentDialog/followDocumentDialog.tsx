
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { followType } from "../../util/followType";
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { BaseDialog, IDialogConfiguration } from '@microsoft/sp-dialog';
import { DialogContent, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { FollowDocumentProperties } from '../followDocumentProperties/followDocumentProperties';

export default class FollowDocumentDialog extends BaseDialog {
    public _followDocumentState:boolean=false;
    private _webUrl: string;
    public _followTypeDialog: followType;
    public _filename: string;
    public return: (string)=>void;

    public async initialize(url: string, type: followType) {
        this._webUrl = url;
        this._followTypeDialog = type;
        this.show();
    }

    public render(): void {
        let reactElement;
        const Unfollow = () => {
            this._followDocumentState=true;
            this.close();
        };
        switch (this._followTypeDialog) {
            case followType.ViewPropreties:
                reactElement =
                    <FollowDocumentProperties
                        url={this._webUrl}
                        close={this.close}
                    />;
                break;
            case followType.Unfollow:
                reactElement = <DialogContent
                    title="Follow Status"
                    showCloseButton={true}
                    onDismiss={this.close}
                >
                    <div>
                        <div>Do you want to unfollow <b>"{this._filename}"</b>?</div>
                        <DialogFooter>
                            <PrimaryButton onClick={Unfollow} text="Unfollow" />
                            <DefaultButton onClick={this.close} text="Cancel" />
                        </DialogFooter>

                    </div>
                </DialogContent>;

                break;
            default:
                throw new Error("Unknown command");
        }
        ReactDOM.render(reactElement, this.domElement);

    }
    protected onAfterClose(): void {
        super.onAfterClose();
        
        // Clean up the element for the next dialog
        ReactDOM.unmountComponentAtNode(this.domElement);
    }
    public getConfig(): IDialogConfiguration {
        return {
            isBlocking: false
        };
    }

}