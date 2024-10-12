export class PassportDetailRequest {
  referenceId: string;
  passportNumber: string;
  passportExpiryDate: Date;
  passportDateOfIssue: Date;
  passportPlaceOfIssue: string;
  intentedDateOfEntry: Date;
  isOtherNationality: string;
  otherNationality: string;
  yearOfAcquisition: string;
}
