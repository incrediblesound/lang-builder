import {
  Entity,
  FieldType,
  Field,
  Cardinality,
} from './types';
import schema from './index';


export default async pg => {
  const entities = Object
    .values(schema)
    .filter((val: Entity | Field): boolean => val instanceof Entity)

  await makeTables(pg, entities)
  await makeColumns(pg, entities)
  console.log('LANG_BUILDER: ~ finished building database ~')
}

async function makeTables(pg, entities) {
  let newTable;
  let tablesToCreate = entities.slice()
  while (tablesToCreate.length) {
    newTable = tablesToCreate.pop()
    const exists = await pg.schema.hasTable(newTable.name)
    if (!exists) {
      await pg.schema.createTable(newTable.name, table => {
        table.increments('id').primary()
      })
      console.log(`LANG_BUILDER: ~ table ${newTable.name} added ~`)
    }
  }
}

async function makeColumns(pg, entities) {
  let tableToUpdate;
  let tablesToUpdate = entities.slice()
  while (tablesToUpdate.length) {
    tableToUpdate = tablesToUpdate.pop()
    await updateTableWithColumns(pg, tableToUpdate)
  }
}

async function updateTableWithColumns(pg, tableToUpdate: Entity) {
  let columnToAdd;
  let columnsToAdd = tableToUpdate.properties.slice()
  while (columnsToAdd.length) {
    columnToAdd = columnsToAdd.pop()
    let columnName = columnToAdd.key
    let columnType = columnToAdd.value
    let oneToMany = false
    if (columnTypeIsMultipleCardinality(columnType)) {
      columnType = removeCardinalityDecorator(columnType)
      oneToMany = true
    }
    const exists = await pg.schema.hasColumn(tableToUpdate.name, columnName)
    if (!exists) {
      const columnTypeDefinition = schema[columnType];
      if (columnTypeDefinition instanceof Entity) {
        await addForeignKey(pg, columnToAdd, tableToUpdate, columnTypeDefinition, oneToMany)
      } else {
        await pg.schema.table(tableToUpdate.name, table => {
          switch(columnTypeDefinition.type) {
            case FieldType.STRING:
            case FieldType.STRING_ENUM:
              if (columnTypeDefinition.cardinality === Cardinality.MULTIPLE) {
                table.specificType(columnName, 'text[]')
              } else {
                table.string(columnName)
              }
              break;
            case FieldType.NUMBER:
            case FieldType.NUMBER_ENUM:
              if (columnTypeDefinition.cardinality === Cardinality.MULTIPLE) {
                table.specificType(columnName, 'int[]')
              } else {
                table.integer(columnName)
              }
              break;
          }
        })
      }
    }
    console.log(`LANG_BUILDER: ~ column ${columnName} of ${tableToUpdate.name} added ~`)
  }
}

async function addForeignKey(pg, columnToAdd, tableToUpdate, columnTypeDefinition, oneToMany) {
  if (!oneToMany) {
    await pg.schema.table(tableToUpdate.name, table => {
      table
        .biginteger(columnToAdd.key)
        .unsigned()
        .notNullable()
        .references('id')
        .inTable(columnTypeDefinition.name)
        .onDelete('CASCADE')
        .index();
    })
  } else {
    const relationName = buildRelationshipTableName(tableToUpdate, columnTypeDefinition)
    const exists = await pg.schema.hasTable(relationName)
    if (!exists) {
      await pg.schema.createTable(relationName, newTable => {
        newTable
          .biginteger(tableToUpdate.name)
          .unsigned()
          .notNullable()
          .references('id')
          .inTable(columnTypeDefinition.name)
          .onDelete('CASCADE')
          .index();
        newTable
          .biginteger(columnTypeDefinition.name)
          .unsigned()
          .notNullable()
          .references('id')
          .inTable(tableToUpdate.name)
          .onDelete('CASCADE')
          .index();
      })
    }
  }
}

const columnTypeIsMultipleCardinality = columnType => 
  columnType.substring(columnType.length-2) === '[]';

const removeCardinalityDecorator = columnType => 
  columnType.substring(0, columnType.length-2);

const buildRelationshipTableName = (tableOne, tableTwo) => `${tableOne.name}__${tableTwo.name}`;