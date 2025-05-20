interface BaseIntervention {
  id: number;
  id_hogar: number;
  cui: string;
  apellido1: string;
  apellido2?: string;
  apellido_de_casada?: string;
  nombre1: string;
  nombre2?: string;
  nombre3?: string;
  sexo: number;
  fecha_nacimiento: Date;
  departamento_nacimiento: number;
  municipio_nacimiento: number;
  pueblo_pertenencia?: number;
  comunidad_linguistica?: number;
  idioma?: number;
  trabaja?: number;
  telefono?: string;
  escolaridad?: number;
  departamento_residencia: number;
  municipio_residencia: number;
  direccion_residencia?: string;
  institucion?: number;
  departamento_otorgamiento?: number;
  municipio_otorgamiento?: number;
  fecha_otorgamiento?: Date;
  valor?: number;
  referencia?: string;
  discapacidad?: number;
  fecha_snis?: Date;
  estado: number;
}

export interface EntregaIntervenciones extends BaseIntervention {
  programa?: number;
  beneficio?: number;
}

export interface EntregaIntervencionesJoined extends BaseIntervention {
  programa?: string;
  beneficio?: string;
}

export interface EntregaIntervencionesSummary {
  programa_nombre: string;
  beneficio_nombre: string;
  total_entregas: number;
  total_valor: number;
  intervention_ids: number[];
}
