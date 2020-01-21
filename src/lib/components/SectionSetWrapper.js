import React, {memo} from 'react';

const SectionSetWrapper = ({ sectionSet, uid, value, onMoveUp, onMoveDown, onDelete, onValueChange }) => {
  
  const SectionInputComponent = sectionSet.inputCompoenet;

  const handleValueChange = newValue => {
    onValueChange(uid, newValue);
  }

  return (
    <div className="section-set-container">
      <div className="toolbar">
        <span className="uid-indicator">{ uid }</span>
        <button type="button" onClick={_=> onMoveUp(uid)}>排列往上</button>
        <button type="button" onClick={_=> onMoveDown(uid)}>排列往下</button>
        <button type="button" onClick={_=> onDelete(uid)}>刪除版型</button>
      </div>
      <div className="input-container">
        <SectionInputComponent value={value} setValue={handleValueChange} />
      </div>
    </div>
  )
}

export default memo(SectionSetWrapper);