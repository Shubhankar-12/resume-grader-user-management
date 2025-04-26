/**
 *  This file contains the field names of all possible request's
 *  body fields which hold critical data and a developer
 *  cannot afford to log them anywhere.
 */

const critical_fields = [
  'password',
  'pan_number',
  'aadhar_number',
  'old_password',
  'new_password',
];

export default critical_fields;
