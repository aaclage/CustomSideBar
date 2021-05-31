import { WebPartContext } from "@microsoft/sp-webpart-base";
import { ServiceScope } from "@microsoft/sp-core-library";

export interface IOneDriveFinderProps {
  description: string;
  context: WebPartContext;
  serviceScope: ServiceScope;
}
