import React from 'react';
import { sectionFieldRender } from 'react-customizable-section-field';

const exampleTextSection = {
  typeName: 'one-column',
  label: '範例文字輸入框',
  iconSrc: '',
  initValue: 'Sample Text',
  inputCompoenet: ({ value, setValue }) => <input type="text" onChange={ e => setValue(e.target.value)} value={value}/>,
  displayCompoenet: ({ value }) => <div>{ value }</div>
}

sectionFieldRender(
  [exampleTextSection],
  'demo-field',
)