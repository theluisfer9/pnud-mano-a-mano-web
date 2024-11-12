export type Bulletin = {
  id: number;
  date: string;
  title: string;
  body: string;
  mainSecondaryImage?: string;
  firstAdditionalBody?: string;
  secondAdditionalBody?: string;
  additionalImages?: string[];
  tags?: string[];
  topics?: string[];
};
