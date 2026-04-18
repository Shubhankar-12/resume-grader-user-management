export const Algorithm = { SHA256: 'sha256' };

export enum Status {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED',
  DISCONTINUED = 'DISCONTINUED',
  PENDING = 'PENDING',
}
export const StatusArray = ['ENABLED', 'DISABLED', 'DRAFT', 'PENDING'];

export enum TokenStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
}

export enum OtpStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
}

export const BUCKET_URL_HTTPS = 'https://advait-demo.s3.ap-southeast-2.amazonaws.com';
