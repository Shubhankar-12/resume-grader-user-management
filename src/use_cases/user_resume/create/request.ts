/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ICreateUserResumeRequest {
  user_id: string;
  resume: {
    name: string;
    url: string;
    mimetype: string;
  };
  extractedText?: string;
  analysis?: {
    gradingScore: number;
    atsScore: number;
    suggestions: string[];
  };

  status?: string;
}
