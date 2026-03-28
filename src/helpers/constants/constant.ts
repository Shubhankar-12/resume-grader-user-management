export const Algorithm = { SHA256: "sha256" };

export enum Status {
  ENABLED = "ENABLED",
  DISABLED = "DISABLED",
  DISCONTINUED = "DISCONTINUED",
  PENDING = "PENDING",
}
export const StatusArray = ["ENABLED", "DISABLED", "DRAFT", "PENDING"];

export enum TokenStatus {
  ACTIVE = "ACTIVE",
  EXPIRED = "EXPIRED",
}

export enum OtpStatus {
  ACTIVE = "ACTIVE",
  EXPIRED = "EXPIRED",
}

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
