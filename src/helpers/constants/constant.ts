export const Algorithm = { SHA256: "sha256" };

export enum Status {
  ENABLED = "ENABLED",
  DISABLED = "DISABLED",
  DISCONTINUED = "DISCONTINUED",
  PENDING = "PENDING",
}
export const VisaCancellationStatus = ["PENDING", "INPROGRESS", "COMPLETED"];
export const SettlementStatus = ["COMPLETED", "INPROGRESS"];
export const StatusArray = ["ENABLED", "DISABLED", "DRAFT", "PENDING"];
export const ApprovalStatusArray = ["APPROVED", "REJECTED", "PENDING APPROVAL"];
export const BrandingDoucmentsArray = [
  "TYPOGRAPHY_GUIDELINES",
  "COLOR_PALETTE",
  "IMAGERY_GUIDELINES",
  "VOICE_AND_TONE_GUIDELINES",
  "USAGE_EXAMPLES_GUIDELINES",
];
export const BrandingAssetArray = [
  "COMPANY_STAMP",
  "LETTER_HEAD",
  "BUSINESS_CARD",
  "RECIEPT_VOUCHER",
  "BOOKING_AND_DEPOSIT_COMMISSION",
  "A4_ENVELOPE",
  "DL_ENVELOPE",
];

export enum Months {
  JANUARY = "January",
  FEBRUARY = "February",
  MARCH = "March",
  APRIL = "April",
  MAY = "May",
  JUNE = "June",
  JULY = "July",
  AUGUST = "August",
  SEPTEMBER = "September",
  OCTOBER = "October",
  NOVEMBER = "November",
  DECEMBER = "December",
}

export const MonthsArray = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export enum TokenStatus {
  ACTIVE = "ACTIVE",
  EXPIRED = "EXPIRED",
}

export enum OtpStatus {
  ACTIVE = "ACTIVE",
  EXPIRED = "EXPIRED",
}

export const BUCKET_URL_HTTP = "http://hireavilla-images.s3.amazonaws.com/";
export const BUCKET_URL_HTTPS = "https://hireavilla-images.s3.amazonaws.com/";

export const planLimits = {
  FREE: {
    resumeUploads: 1,
    tailoredResumes: 1,
    coverLetters: 1,
    githubAnalyses: 0,
  },
  BASIC: {
    resumeUploads: 3,
    tailoredResumes: 3,
    coverLetters: 3,
    githubAnalyses: 3,
  },
  PRO: {
    resumeUploads: Infinity,
    tailoredResumes: Infinity,
    coverLetters: Infinity,
    githubAnalyses: Infinity,
  },
};
