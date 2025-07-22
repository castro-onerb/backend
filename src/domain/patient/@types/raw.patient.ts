export type PatientRaw = {
  id: string;
  fullname: string;
  cpf: string;
  birth?: Date;
  active: boolean;
  password: string;
};
