import {
  Entity,
  EntityType,
  Field,
  Property,
  Schema,
} from './types';
import schema from './index';

export default pg => {
  const entities = Object
    .values(schema)
    .filter((val: Entity | Field): boolean => val instanceof Entity)

  processEntity(pg, entities, () => {
    processRelationship(pg, RELS, () => {
      console.log('FINISHED BUILDING TABLES')
    })
  })


  function processEntity(pg, entities, finalCallback) {
    let current = entities.pop()
    if (current) {
      buildTable(pg, current, () => processEntity(pg, entities, finalCallback))
    } else {
      finalCallback()
    }
  }

  function processRelationship(pg, rels, finalCallback){
    let currentArgs = rels.pop()
    if (currentArgs) {
      currentArgs.push(() => {
        processRelationship(pg, rels, finalCallback)
      })
      buildRelationship.apply(this, currentArgs);
    } else {
      finalCallback
    }
  }
}

const RELS: any[] = [];

const buildTable = (pg, schemaEntity: Entity, cb): void => {
  pg.schema.hasTable(schemaEntity.name).then(exists => {
    if (!exists) {
      pg.schema.createTable(schemaEntity.name, table => {
        table.increments('id').primary()
        addColumns(pg, table, schemaEntity)
      }).then(cb)
    } else {
      pg.schema.table(schemaEntity.name, table => {
        addColumns(pg, table, schemaEntity)
      }).then(cb)
    }
  });

  const addColumns = (pg, table, schemaEntity: Entity): void => {
    schemaEntity.properties.forEach(prop => {
      buildColumn(pg, prop, table, schemaEntity, schema)
    })
  }
}

const buildColumn = (pg, prop: Property, table, schemaEntity: Entity, schema: Schema): void => {
  let key = prop.key
  let value = prop.value
  let oneToMany = false
  if (value.substring(value.length-2) === '[]') {
    value = value.substring(0, value.length-2)
    console.log(prop)
    oneToMany = true
  } else {
    value = value
  }
  pg.schema.hasColumn(schemaEntity.name, key).then(exists => {
    if (!exists) {
      const entity = schema[value];
      if (entity instanceof Entity) {
        // entity is a class so this column is a foreign key
        RELS.push([pg, key, schemaEntity, entity, oneToMany]);
      } else {
        // entity is a field so this is a normal column
        switch(entity.type) {
          case EntityType.PRIMITIVE:
            table[entity.name](key);
          case EntityType.ENUM:
            table.specificType(key, 'text[]')
        }
      }
    }
  })
}

const buildRelationship = (pg, key, entityOne, entityTwo, oneToMany, cb) => {
  if (!oneToMany) {
    pg.schema.hasColumn(entityOne.name, key).then(exists => {
      if (!exists) {
        pg.schema.table(entityOne.name, table => {
          table
            .biginteger(key)
            .unsigned()
            .notNullable()
            .references('id')
            .inTable(entityTwo.name)
            .onDelete('CASCADE')
            .index();
        }).then(cb)
      }
    })
  } else {
    const relationName = `${entityOne.name}__${entityTwo.name}`;
    pg.schema.hasTable(relationName).then(exists => {
      if (!exists) {
        pg.schema.createTable(relationName, newTable => {
          newTable
            .biginteger(entityOne.name)
            .unsigned()
            .notNullable()
            .references('id')
            .inTable(entityTwo.name)
            .onDelete('CASCADE')
            .index();
          newTable
            .biginteger(entityTwo.name)
            .unsigned()
            .notNullable()
            .references('id')
            .inTable(entityOne.name)
            .onDelete('CASCADE')
            .index();
        }).then(cb)
      }
    })
  }
}
