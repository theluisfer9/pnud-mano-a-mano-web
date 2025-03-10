export interface Programme {
  id: number;
  institution: string;
  name: string;
  type: "individual" | "home" | "communitary";
  programManager: string;
  adminDirection: string;
  email: string;
  phone: string;
  budget: string;
  productName: string;
  programName: string;
  programDescription: string;
  programObjective: string;
  legalFramework: string;
  startDate: string;
  endDate: string;
  executionYear: number;
}
