export interface User {
  id: string;
  created_at: Date;
  dpi: string;
  password: string;
  role: UserRole;
  salt: string;
  name: string;
  profile_picture?: string;
}

export enum UserRole {
  ADMIN = "Administrador",
  NEWS_EDITOR = "Editor de Noticias",
  SUPER_ADMIN = "Super Administrador",
}
