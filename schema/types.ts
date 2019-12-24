export enum EntityType { CLASS=1, PRIMITIVE=2, ENUM=3, }
export enum Cardinality { SINGLE=1, MULTIPLE=2, }

export class Entity {
  name: string;
  properties: Property[];
  constructor({ name, properties }){
    this.properties = properties
    this.name = name
  }
}

export interface Field {
  type: EntityType;
  name: string;
  cardinality: Cardinality;
  validate(v: any): boolean;
}

export interface Property {
  key: string;
  value: string;
}

export type Schema = Record<string, Entity | Field>