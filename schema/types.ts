export enum FieldType { STRING=1, NUMBER=2, STRING_ENUM=3, NUMBER_ENUM=4 }
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
  type: FieldType;
  cardinality: Cardinality;
  validate(v: any): boolean;
}

export interface Property {
  key: string;
  value: string;
}

export type Schema = Record<string, Entity | Field>