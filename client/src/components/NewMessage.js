import React, { useState } from "react";

function NewMessage({ currentUser, onAddMessage }) {
  const [body, setBody] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    fetch("/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        body: body,
        username: currentUser.username,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to post message: ${response.statusText}`);
        }
        return response.json();
      })
      .then((newMessage) => {
        console.log(newMessage)
        onAddMessage(newMessage);
        setBody("");
      })
      .catch((error) => {
        console.error('Error fetching message:', error.message);
      });
  }

  return (
    <form className="new-message" onSubmit={handleSubmit}>
      <input
        type="text"
        name="body"
        autoComplete="off"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}

export default NewMessage;
