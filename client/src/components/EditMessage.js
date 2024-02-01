import React, { useState } from "react";

function EditMessage({ id, body, onUpdateMessage }) {
  const [messageBody, setMessageBody] = useState(body);

  function handleFormSubmit(e) {
    e.preventDefault();
    console.log(messageBody)

    fetch(`/messages/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        body: messageBody,
      }),
    })
      .then((r) => {
        if (!r.ok) {
          throw new Error(`Failed to patch message: ${r.statusText}`);
        }
        return r.json();
      })
      .then((updatedMessage) => {
        console.log(updatedMessage)
        onUpdateMessage(updatedMessage)
      })
      .catch((error) => {
        console.error('Error fetching message', error.message)
      });
  }

  return (
    <form className="edit-message" onSubmit={handleFormSubmit}>
      <input
        type="text"
        name="body"
        autoComplete="off"
        value={messageBody}
        onChange={(e) => setMessageBody(e.target.value)}
      />
      <input type="submit" value="Save" />
    </form>
  );
}

export default EditMessage;
