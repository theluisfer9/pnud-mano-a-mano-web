export interface Programme {
  id: number;
  institution: string;
  name: string;
  type: "individual" | "home" | "communitary";
  program_manager: string;
  admin_direction: string;
  email: string;
  phone: string;
  budget: string;
  product_name: string;
  program_name: string;
  program_description: string;
  program_objective: string;
  legal_framework: string;
  start_date: string;
  end_date: string;
  execution_year: number;
}
