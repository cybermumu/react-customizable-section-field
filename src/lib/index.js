import React from 'react';
import ReactDOM from 'react-dom';
import RootField from './components/RootField';

const sectionFieldRender = (sections, inputName, wrapperClassName = '') => {

  const dom = document.querySelector(`input[name=${inputName}]`)
  if (!dom) throw new ReferenceError(`找不到指定 name 為 ${inputName} 的 input HTMLElement。`)

  sections.forEach(({typeName, initValue, inputCompoenet, displayCompoenet}, index) => {
    if (!typeName) throw new ReferenceError(`尚未指定 Section Set #${index} 的 typeName 屬性，請確實指定。`)
    if (!initValue) throw new ReferenceError(`尚未指定 Section Set #${index} 的 initValue 屬性，請確實指定。`)
    if (!inputCompoenet) throw new ReferenceError(`尚未指定 Section Set #${index} 的 inputCompoenet 屬性，請確實指定。`)
    if (!displayCompoenet) throw new ReferenceError(`尚未指定 Section Set #${index} 的 displayCompoenet 屬性，請確實指定。`)
  });

  var sectionEditorDiv = document.createElement('div');
  sectionEditorDiv.id = inputName;
  sectionEditorDiv.className = `section-field-wrapper ${wrapperClassName}`;

  dom.parentNode.replaceChild(sectionEditorDiv, dom);

  ReactDOM.render(
    <RootField 
      defaultValue={dom.value} 
      name={inputName} 
      sections={sections}
    />, 
    sectionEditorDiv
  );
}

export { sectionFieldRender, RootField };
