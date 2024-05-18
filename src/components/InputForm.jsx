import React from 'react'

const InputForm = ({ inputs, handleChange, handleSubmit }) => {
  return (
    <div className='cont'>
    <div className='inputForm'>
    {Object.keys(inputs).map((key) => (
      <div key={key} className='inputDiv'>
        <label>{key}: </label>
        <input className='input' type="number" name={key} value={inputs[key]} onChange={handleChange} />
      </div>
    ))}
    </div>
    
    <button onClick={handleSubmit}>Рассчитать</button>
  </div>
  )
}

export default InputForm