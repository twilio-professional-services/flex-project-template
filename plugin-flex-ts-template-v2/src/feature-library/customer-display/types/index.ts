/**
 * Customer Display feature types
 */

export interface CustomerData {
  fullName: string;
  accountName: string;
  lastInteractionDate: string;
  openCasesCount: number;
}

export interface FetchCustomerResponse {
  data?: CustomerData;
  error?: string;
}
