import React from 'react'
import { Entity, Field } from '../../schema/types'
import schema from '../../schema/index'

interface FormProps {
  entityDefinition: Entity | Field;
  isMultiple: boolean;
  canEdit: boolean;
  label: string;
}

interface FormState {
  entityDefinition: Entity | Field;
}

const propertyIsMultipleCardinality = propertyValue => 
  propertyValue.substring(propertyValue.length-2) === '[]';

const removeCardinalityDecorator = propertyValue => 
  propertyValue.substring(0, propertyValue.length-2);

class Form extends React.Component<FormProps, FormState> {
  constructor(props: FormProps){
    super(props)
    this.state = {
      entityDefinition: props.entityDefinition,
    }
  }
  render(){
    const { entityDefinition } = this.state;
    const { canEdit, label } = this.props;
    const isEntity = entityDefinition instanceof Entity
    if (isEntity){
      return (
        <div className="entity-container">
          <p>{ label }</p>
          { entityDefinition.properties.map(prop => {
            const isMultiple = propertyIsMultipleCardinality(prop.value)
            const propertyTypeName = removeCardinalityDecorator(prop.value)
            const entity = schema[propertyTypeName]
            return (
              <Form
                entityDefinition={entity}
                isMultiple={isMultiple}
                canEdit={canEdit}
                label={prop.key}
              />
            )
          })}
        </div>
      )
    } else {
      return (
        <FormField
          entityDefinition={entityDefinition}
          isMultiple={false}
          canEdit={canEdit}
          label={prop.key}
        />
      )
    }
  }
}

export default Form