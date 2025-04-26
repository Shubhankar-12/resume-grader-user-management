/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { BaseParser } from "../../../base_classes";
import { ImageValidator } from "../ImageValidator";

export class UploadDocParser extends BaseParser {
  private imageValidator: ImageValidator;

  constructor(data: any, imageValidator: any) {
    super();
    this.imageValidator = imageValidator;
  }
}
