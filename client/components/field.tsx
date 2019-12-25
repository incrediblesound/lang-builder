import React from 'react'
import { Entity, Field } from '../../schema/types'
import schema from '../../schema/index'

interface FormFieldProps {
  entityDefinition: Field;
  canEdit: boolean;
}

interface FormFieldState {
  entityDefinition: Field;
}

class FormField extends React.Component<FormFieldProps, FormFieldState> {
  constructor(props: FormFieldProps){
    super(props)
    this.state = {
      entityDefinition: props.entityDefinition,
    }
  }
  render(){
    const { entityDefinition } = this.state;
    const { canEdit } = this.props;
      return (<div></div>)
    }
  }
}

export default FormField

const NumberField = ({ }) => (
  <input type="number" />
)

const TextField = ({ }) => (
  <input type="text" />
)