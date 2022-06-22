import React from "react";
import { useState } from "react";
import ReactDOM from "react-dom/client";

const HeaderForm = () => {
    const [inputs, setInputs] = useState({});
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}))
      }
      const handleSubmit = (event) => {
        event.preventDefault();
        console.log(inputs);
      }
    

  return (
    <div className="headerForm">
      <h4>Header Form</h4>
      <p>
        Enter details for Header
      </p>
      <form onSubmit={handleSubmit}>
      <label>Heading:
      <input 
        type="text" 
        name="heading" 
        value={inputs.heading || ""} 
        onChange={handleChange}
      />
      </label>
      <label>Sub-heading:
        <input 
          type="text" 
          name="subheading" 
          value={inputs.subheading || ""} 
          onChange={handleChange}
        />
        </label>
        <input type="submit" />
    </form>
    </div>
  );
};

export default HeaderForm;
