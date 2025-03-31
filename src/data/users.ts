export interface User {
  id: number;
  dpi: string;
  name: string;
  email: string;
  password: string;
  profile_picture: string;
  role: string;
  institution: string;
  accessFrom: string;
  accessTo: string;
  creationApprovalDocument: string;
  jobTitle: string;
  hasChangedPassword: boolean;
}

export enum UserRole {
  ADMIN = "Administrador",
  NEWS_EDITOR = "Editor de Noticias",
  SUPER_ADMIN = "Super Administrador",
}
