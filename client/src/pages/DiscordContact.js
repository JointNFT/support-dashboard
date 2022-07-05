import React from "react";

const DiscordContact = () => {
  return (
    <>
      <div className="mb-3">
        <label htmlFor="exampleFormControlInput1" className="form-label">
          Contact name
        </label>
        <input
          type="text"
          className="form-control"
          id="exampleFormControlInput1"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="exampleFormControlInput1" className="form-label">
          Contact phone
        </label>
        <input
          type="tel"
          className="form-control"
          id="exampleFormControlInput1"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="exampleFormControlTextarea1" className="form-label">
          Example textarea
        </label>
        <textarea
          className="form-control"
          id="exampleFormControlTextarea1"
          rows="3"
        ></textarea>
      </div>
			<div className="mb-3">
				<button className="btn btn-rounded rounded">Send</button>
			</div>
    </>
  );
};

export default DiscordContact;
