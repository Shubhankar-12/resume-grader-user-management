/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import validator from "validator";
import mongoose from "mongoose";
import critical_fields from "./constants/HideFields";
import jsonwebtoken from "jsonwebtoken";
import { ObjectId } from "mongodb";
import axios from "axios";
import pdf from "pdf-parse";

export class TextUtils {
  public static sanitize(unsafeText: string): string {
    // return domPurify.sanitize(unsafeText);
    return unsafeText;
  }

  public static validateWebURL(url: string): boolean {
    return validator.isURL(url);
  }

  public static validateEmailAddress(email: string): boolean {
    // eslint-disable-next-line max-len
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  public static createRandomNumericString(numberDigits: number): string {
    const chars = "0123456789";
    let value = "";
    for (let i = numberDigits; i > 0; --i) {
      value += chars[Math.round(Math.random() * (chars.length - 1))];
    }
    return value;
  }

  public static validateMongoId(id: string): boolean {
    if (id === null || id === undefined || id === "") return false;
    return ObjectId.isValid(id);
  }
  // public StringToObjectId(id: string): typeof ObjectId {
  //   return ObjectId(id).toHexString();
  // }

  public static capitalize(str: string) {
    return str.slice(0, 1).toUpperCase() + str.slice(1, str.length);
  }

  /**
   * Will help convert an email to it's appropriate regex string
   * e.g. converting example@domain.com to ^example@domain\.com$
   * @param email email
   */
  public static emailToRegex(email: string): string {
    // add a single slash before all periods (.)
    // add ^ at the start and $ at the end of the string
    const len = email.length;
    let regex = "";
    regex += "^";
    for (let i = 0; i < len; i++) {
      if (email[i] == ".") {
        regex += "\\";
      }
      regex += email[i];
    }
    regex += "$";
    return regex;
  }

  /**
   * Will help convert an string to it's exact regex string
   * e.g. converting sample to ^sample$
   * We need to do this so that sample does not match to any work which
   * has a substring sample
   * @param queryString queryString
   */
  public static toExactStringRegex(queryString: string): string {
    return `^${queryString}$`;
  }
}

export class LoggerUtils {
  /**
   * =====================================================
   * The function DOES NOT SUPPORT CIRCULAR OBJECTS.
   * =====================================================
   */
  /**
   * Used to replace the critical information with the dummy information
   * NOTE: Keep in mind that you send a copy of the object
   * because this will change the values of it's attributes
   * The function DOES NOT SUPPORT CIRCULAR OBJECTS.
   * @param obj the object on which the operation would be performed
   * @param field field of the object which needs to be changed to xxx
   */
  public static replaceCriticalData(obj: any, field: string): any {
    // console.log(obj);
    if (typeof obj == "object" && obj != null) {
      if (obj instanceof Array) {
        for (let element of obj) {
          element = LoggerUtils.replaceCriticalData(element, field);
        }
      } else {
        if (obj[field]) {
          obj[field] = "xxx";
        }
        const keys = Object.keys(obj);
        for (const key of keys) {
          obj[key] = LoggerUtils.replaceCriticalData(obj[key], field);
        }
      }
    }
    return obj;
  }

  public static hideFields(obj: any): any {
    let objCopy = JSON.parse(JSON.stringify(obj));
    for (const field of critical_fields) {
      objCopy = LoggerUtils.replaceCriticalData(objCopy, field);
    }
    return objCopy;
  }
}
export interface AccessControlFetch {
  status?: string;
  module_id?: string;
  applied_level?: string;
  allow_create?: boolean;
  allow_read?: boolean;
  allow_update?: boolean;
  allow_delete?: boolean;
}

export function convertVObject(data: any) {
  if (data == undefined) {
    return data;
  }
  if (data.__v != undefined) {
    data.v = data.__v;
    delete data.__v;
  }
  return data;
}

export function convertVArray(data: Array<any>) {
  if (data == null) {
    return null;
  }
  for (let i = 0; i < data.length; i++) {
    data[i] = convertVObjectRecursive(data[i]);
  }
  return data;
}

export function convertVObjectRecursive(data: any) {
  if (data == undefined) {
    return data;
  }
  if (data.__v != undefined) {
    data.v = data.__v;
    delete data.__v;
    const keys = Object.keys(data);
    for (const key of keys) {
      if (data[key] instanceof Array) {
        data[key] = convertVArray(data[key]);
      } else {
        data[key] = convertVObjectRecursive(data[key]);
      }
    }
  }
  return data;
}

export class NumberUtils {
  /**
   * generates a 4 digit otp between the range 1000 and 10000
   */
  static otpGenerator(): string {
    const num = (1000 + Math.random() * 9000).toFixed();
    return num;
  }
}

export class TokenUtils {
  /**
   *
   * @param token the jwt token to verify
   * @param policy the policies
   * This function takes the token, the policy name
   * searches the policy in the env file and and verifies it.
   */
  static verifyToken(token: string, policy: string): boolean {
    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      if (jsonwebtoken.verify(token, process.env[policy]!)) {
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  }
}

export function generateImageLink(path: string): string {
  return `${process.env.IMAGE_PROXY_URL}${path}`;
  if (path == undefined) {
    return "";
  }
  if (path[0] == "/") {
    path = path.slice(1);
  }

  const obj = {
    bucket: process.env.AWS_BUCKET_NAME,
    key: "" + path,
    edits: {
      resize: {
        fit: "inside",
      },
    },
  };

  return `${process.env.IMAGE_PROXY_URL}/${btoa(JSON.stringify(obj))}`;
}

export function generatePdfLink(path: string): string {
  if (path == undefined) {
    return "";
  }
  if (path[0] == "/") {
    path = path.slice(1);
  }

  const obj = {
    bucket: process.env.AWS_BUCKET_NAME,
    key: "" + path,
    edits: {
      resize: {
        fit: "inside",
      },
    },
  };

  return `${process.env.IMAGE_PROXY_URL}/${btoa(JSON.stringify(obj))}`;
}

export const generateEmployeeId = () => {
  // Should contain 2 letters and 3 numbers

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let employeeId = "";
  for (let i = 0; i < 2; i++) {
    employeeId += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  for (let i = 0; i < 3; i++) {
    employeeId += Math.floor(Math.random() * 10);
  }

  return employeeId;
};
export const generateCompanyOwnerId = () => {
  // Should contain 3 letters and 7 numbers

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let employeeId = "";
  for (let i = 0; i < 3; i++) {
    employeeId += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  for (let i = 0; i < 7; i++) {
    employeeId += Math.floor(Math.random() * 10);
  }

  return employeeId;
};

export async function extractTextFromPdf(pdfUrl: string): Promise<string> {
  const resumeUrl = process.env.BUCKET_PROXY_URL + pdfUrl;
  // console.log("Resume URL:", resumeUrl);

  const response = await axios.get(resumeUrl, { responseType: "arraybuffer" });
  const pdfBuffer = Buffer.from(response.data, "binary");
  const data = await pdf(pdfBuffer);
  return data.text || ""; // Return the extracted text or an empty string if not found
}
