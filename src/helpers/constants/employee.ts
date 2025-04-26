export enum BloodGroup {
  A_POSITIVE = "A+",
  A_NEGATIVE = "A-",
  B_POSITIVE = "B+",
  B_NEGATIVE = "B-",
  AB_POSITIVE = "AB+",
  AB_NEGATIVE = "AB-",
  O_POSITIVE = "O+",
  O_NEGATIVE = "O-",
}

export const BloodGroupArray = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
];

export enum Gender {
  MALE = "Male",
  FEMALE = "Female",
}

export const GenderArray = ["MALE", "FEMALE", "PREFER_NOT_TO_SAY"];

export const fields = [
  "title",
  "first_name",
  "last_name",
  "middle_name",
  "date_of_birth",
  "primary_nationality",
  "secondary_nationality",
  "civil_status",
  "personal_mobile_number",
  "home_telephone_no",
  "emergency_contact_uae",
  "emergency_contact_abroad",
  "driving_license",
  "own_car",
  "employee_status",
];

export enum EmployeeStatus {
  ENABLED = "ENABLED",
  DISABLED = "DISABLED",
  PENDING = "PENDING",
  DRAFT = "DRAFT",
}

export const EmployeeStatusArray = [
  "APPLICANT",
  "EMPLOYEE",
  "DEPARTED",
  "TERMINATED",
];
export const TitleArray = ["MR", "MRS", "MS"];
