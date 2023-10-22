export enum Roles {
  OPERATOR = 'operator',
  POLICE = 'police',
  MANAGER = 'manager'
}

export interface AgentsPosition {
  [clientId: string]: number[];
}