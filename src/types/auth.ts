export enum USER_TYPES {
  admin = 'admin',
  driver = 'driver',
  passenger = 'passenger',
};

export enum REGISTER_TYPES {
  registerWithEmail,
  registerWithOAuth,
  edit,
}

export type AuthConfig = {
  registerType: REGISTER_TYPES,
  name?: string,
  surname?: string,
  phone?: string,
  profilePicture?: string
}