import React, { useState, useEffect } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import ClipboardJS from 'clipboard';

import SectionSetWrapper from './SectionSetWrapper';

const RootField = ({name, defaultValue, sections}) => {

  const [ outputValue, setOutput ] = useState([]);
  const [ addedSections, setAddedSections ] = useState([]);
  const [ addedSectionCounter, setAddedSectionCounter ] = useState(0);
  const [ advanceActive, setAdvanceActive ] = useState(false);
  const [ advanceCodeValue, setAdvanceCodeValue ] = useState('');
  const [ copyButtonLabel, setCopyButtonLabel ] = useState('複製');

  useEffect(() => {
    setupFromJson(defaultValue);
  }, [defaultValue])

  useEffect(() => {
    renderOutput(addedSections);
  }, [addedSections])

  useEffect(() => {
    const clipboard = new ClipboardJS('.copy-btn');
    clipboard.on('success', _ => setCopyButtonLabel('已複製！'));
  }, []);

  // ========== Helpers ==========

  const setupFromJson = jsonSource => {
    if (!sections) throw new ReferenceError('尚未加入任何 section set。');
    if (typeof sections !== 'object' || !sections.length) throw new TypeError('型別錯誤，sections 非陣列或為空陣列。');

    if (typeof jsonSource === 'string') jsonSource = JSON.parse(jsonSource || '[]');

    let counter = 0;
    let sectionsFromJson = jsonSource.map( ({type, value}) => {
      const sectionSet = sections.find( _ => _.typeName === type);
      if (sectionSet) {
        counter++;
        return {  $$uid: counter - 1, value, sectionSet }
      }
      else {
        console.error(`沒有找到對應的 Section Set: ${type}`)
      }
    });
    sectionsFromJson = sectionsFromJson.filter( _ => _ );

    setAddedSections(sectionsFromJson);
    setAddedSectionCounter(counter);
  }

  const findIndexByUid = uid => addedSections.findIndex( _ => _.$$uid === uid)

  const renderOutput = newSections => {
    const output = newSections.map( item => ({ type: item.sectionSet.typeName, value: item.value}));
    setOutput(output);
  }

  const exchangeSection = (aIndex, bIndex) => {
    if (aIndex < 0 || aIndex >= addedSections.length) return;
    if (bIndex < 0 || bIndex >= addedSections.length) return;

    const newSections = [ ...addedSections];
    const a = {...newSections[aIndex]};
    newSections[aIndex] = newSections[bIndex];
    newSections[bIndex] = a;

    setAddedSections(newSections);
  }



  // ========== Event Handlers ==========
  
  const handleSectionAdd = (sectionSet, value) => {
    const newSections = [
      ...addedSections, 
      { $$uid: addedSectionCounter, value: value || sectionSet.initValue ,sectionSet}
    ];
    setAddedSections(newSections);
    setAddedSectionCounter(addedSectionCounter + 1);
  }

  const handleSectionDelete = uid => {
    const index = findIndexByUid(uid);
    setAddedSections([...addedSections.slice(0, index), ...addedSections.slice(index + 1)]);
  }

  const handleSectionMoveDown = uid => {
    const index = findIndexByUid(uid);
    exchangeSection(index, index + 1);
  }

  const handleSectionMoveUp = uid => {
    const index = findIndexByUid(uid);
    exchangeSection(index, index - 1);
  }

  const handleSectionValueChange = (uid, newValue) => {
    const index = findIndexByUid(uid);
    const newSections = [...addedSections];
    newSections[index] = {...newSections[index], value: newValue}
    setAddedSections(newSections);
  }

  const handleAdvanceTirggerClick = _ => {
    setAdvanceActive(true);
    setAdvanceCodeValue(JSON.stringify(outputValue));
    setCopyButtonLabel('複製');
  }

  const handleLoadFromCodeInput = _ => {
    setupFromJson(advanceCodeValue);
  }



  // ========== Render ==========

  return (
    <>
      <div className={'section-manager' + ( advanceActive ? ' -advance-active' : '')}>

        { !advanceActive && <button type="button" className="advance-trigger" onClick={handleAdvanceTirggerClick}>···</button> }
        {
          advanceActive &&
          <div className="advance-feature-panel">
            <span>當前版型原始碼</span>
            <input type="text" id="section-code-input" value={advanceCodeValue} onChange={ e => setAdvanceCodeValue(e.target.value) }/>
            <button type="button" className="copy-btn" data-clipboard-target="#section-code-input">{ copyButtonLabel }</button>
            <button type="button" onClick={handleLoadFromCodeInput}>讀取</button>
            <button type="button" onClick={_=> setAdvanceActive(false)}>關閉</button>
          </div>
        }

        <TransitionGroup>
          {
            addedSections.map( ({$$uid, sectionSet, value}) => 
              <CSSTransition key={`ss${$$uid}`} timeout={500} classNames="section-input-item">
                <SectionSetWrapper 
                  uid={$$uid}
                  value={value}
                  sectionSet={sectionSet}
                  onMoveUp={handleSectionMoveUp}
                  onMoveDown={handleSectionMoveDown}
                  onDelete={handleSectionDelete}
                  onValueChange={handleSectionValueChange}
                />
              </CSSTransition>
            )
          }
        </TransitionGroup>

        {
          addedSections.length <= 0 && <div className="empty-indicator">尚無排版版型，請點選下方按鈕新增。</div>
        }

        <div className="section-select-bar">
          <div className="title-label">
            <span>新增排版版型</span>
          </div>
          <ul className="sections-list">
            {
              sections.map( (set, index) => (
                <li className="section-item" key={ `sl${index}` }>
                  <button type="button" onClick={ _=> handleSectionAdd(set) }>
                    <img src={ set.iconSrc } alt=""/>
                    <span>{ set.label }</span>
                  </button>
                </li>
              ))
            }
          </ul>
        </div>


      </div>
      <input type="hidden" name={name} value={JSON.stringify(outputValue)} />
    </>
  )
}

export default RootField;