import {
  Entity,
  FieldType,
  Field,
  Cardinality,
  Schema,
} from './types';

const LetterPosition: Field = {
  type: FieldType.STRING_ENUM,
  cardinality: Cardinality.SINGLE,
  validate: value => [ 'initial', 'middle', 'final' ].indexOf(value) !== -1,
}

const MorphemePosition: Field = {
  type: FieldType.STRING_ENUM,
  cardinality: Cardinality.MULTIPLE,
  validate: value => [ 'prefix', 'root', 'suffix' ].indexOf(value) !== -1,
}

const ToneRegister: Field = {
  type: FieldType.STRING_ENUM,
  cardinality: Cardinality.SINGLE,
  validate: value => [ 'low', 'low-mid', 'mid', 'hi-mid', 'hi' ].indexOf(value) !== -1,
}

const TextField: Field = {
  type: FieldType.STRING,
  cardinality: Cardinality.SINGLE,
  validate: value => typeof value === 'string',
}

const NumberField: Field = {
  type: FieldType.NUMBER,
  cardinality: Cardinality.SINGLE,
  validate: value => typeof value === 'number',
}

const Language = new Entity({
  name: 'language',
  properties: [
    {
      key: 'name',
      value: 'TextField',
    }
  ]
})

const Letter = new Entity({
  name: 'letter',
  properties: [
    { 
      key: 'position',
      value: 'LetterPosition',
    },
    {
      key: 'body',
      value: 'TextField',
    },
    {
      key: 'sound',
      value: 'TextField',
    },
    {
      key: 'langauge',
      value: 'Language',
    }
  ]
})

const Tone = new Entity({
  name: 'tone',
  properties: [
    {
      key: 'name',
      value: 'TextField',
    },
    {
      key: 'steps',
      value: 'Step',
    },
    {
      key: 'langauge',
      value: 'Language',
    }
  ]
})

const Step = new Entity({
  name: 'step',
  properties: [
    {
      key: 'position',
      value: 'NumberField',
    },
    {
      key: 'register',
      value: 'ToneRegister',
    },
    {
      key: 'tone',
      value: 'Tone'
    }
  ]
})

const Morpheme = new Entity({
  name: 'morpheme',
  properties: [
    {
      key: 'position',
      value: 'MorphemePosition',
    },
    {
      key: 'text',
      value: 'TextField',
    },
    {
      key: 'letters',
      value: 'Letter[]',
    },
    {
      key: 'meaning',
      value: 'TextField',
    }
  ]
})

const Word = new Entity({
  name: 'word',
  properties: [
   { key: 'text', value: 'TextField' },
   { key: 'morphemes', value: 'Morpheme[]' },
   { key: 'meaning', value: 'TextField' },
  ]
})

const Phrase = new Entity({
  name: 'phrase',
  properties: [
    { key: 'words', value: 'Word[]' },
    { key: 'text', value: 'TextField' },
    { key: 'translations', value: 'TextField' },
  ]
})

const schema: Schema = {
  Morpheme,
  Phrase,
  MorphemePosition,
  LetterPosition,
  ToneRegister,
  TextField,
  NumberField,
  Letter,
  Language,
  Tone,
  Step,
  Word,
}

export default schema