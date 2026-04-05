/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IReorderApplicationRequest {
  application_id: string;
  new_status: string;
  new_position: number;
  user_id: string;
}
