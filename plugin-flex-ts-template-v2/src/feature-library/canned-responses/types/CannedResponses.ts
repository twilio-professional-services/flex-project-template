export interface CannedResponse {
  label: string;
  text: string;
}

export interface ResponseCategory {
  section: string;
  responses: CannedResponse[];
}

export interface CannedResponseCategories {
  categories: ResponseCategory[];
}
