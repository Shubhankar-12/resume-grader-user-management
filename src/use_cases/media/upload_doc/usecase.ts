import {
  UseCase,
  Either,
  errClass,
  successClass,
  UseCaseError,
  ResponseLocalAuth,
} from "../../../interfaces";
import { IUploadDocDto } from "./dto";
import { logUnexpectedUsecaseError } from "../../../logger";
import { DocNotUploadedError, NoDocUploadedError } from "./errors";
import AWS from "aws-sdk";
import { v4 as uuid } from "uuid";
import { ManagedUpload } from "aws-sdk/clients/s3";
import { AuthenticationError } from "../../../helpers";
import { generateImageLink, generatePdfLink } from "../../../helpers/utils";

type Response = Either<
  UseCaseError,
  {
    url: string;
  }
>;
type S3Response = Either<UseCaseError, ManagedUpload.SendData>;
type UseCaseRequest = {
  file: IUploadDocDto;
  auth: ResponseLocalAuth;
};

const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION,
});

export class UploadDocUseCase implements UseCase<UseCaseRequest, Response> {
  @logUnexpectedUsecaseError({ level: "error" })
  async execute({ file, auth }: UseCaseRequest): Promise<Response> {
    console.log("Vook ASdsakl");
    if (!file.buffer) {
      return errClass(new NoDocUploadedError("document"));
    }

    const myFile = file.originalname.split(".");
    const fileType = myFile[myFile.length - 1];

    const generatedUuid = uuid();

    let params;
    let generateAWSUrl;
    // if (fileType === "pdf") {

    let pathName = `/${generatedUuid}.` + fileType;
    if (file.folder) {
      pathName = `${file.folder}/${generatedUuid}.` + fileType;
    } else {
      pathName = `doc/${generatedUuid}.` + fileType;
    }

    params = {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: pathName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    console.log(params, " Thisis paras");

    const result: S3Response = await new Promise((resolve, reject) => {
      try {
        s3.upload(params, (error: Error, data: ManagedUpload.SendData) => {
          return resolve(successClass(data));
        });
      } catch (error: any) {
        return reject(errClass(new DocNotUploadedError(error.name)));
      }
    });
    if (result.isErrClass()) {
      return errClass(new DocNotUploadedError("document"));
    }
    let attachment_url = `/${params.Key}`;

    // if (fileType === "pdf") {
    //   generateAWSUrl = generatePdfLink(attachment_url);
    // } else {
    //   generateAWSUrl = generateImageLink(attachment_url);
    // }

    return successClass({
      url: attachment_url,
      name: myFile[0] ? myFile[0].trim() : "document",
      mimetype: file.mimetype,
    });
  }
}
