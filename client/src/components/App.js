import React, { useEffect, useState } from "react";
import Header from "./Header";
import Search from "./Search";
import MessageList from "./MessageList";
import NewMessage from "./NewMessage";

const testUser = { username: "Duane" };

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/messages")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.statusText}`);
      }
      return response.json();
    })
    .then((messages) => {
      setMessages(messages);
    })
    .catch((error) => {
      console.error('Error fetching messages:', error.message);
    });
  }, []);


  function handleAddMessage(newMessage) {
    setMessages([...messages, newMessage]);
  }

  function handleDeleteMessage(id) {
    const updatedMessages = messages.filter((message) => message.id !== id);
    setMessages(updatedMessages);
  }

  function handleUpdateMessage(updatedMessageObj) {
    const updatedMessages = messages.map((message) => {
      if (message.id === updatedMessageObj.id) {
        return updatedMessageObj;
      } else {
        return message;
      }
    });
    setMessages(updatedMessages);
  }

  const displayedMessages = messages.filter((message) =>
    message.body.toLowerCase().includes(search.toLowerCase())
);

  return (
    <main className={isDarkMode ? "dark-mode" : ""}>
      <Header isDarkMode={isDarkMode} onToggleDarkMode={setIsDarkMode} />
      <Search search={search} onSearchChange={setSearch} />
      <MessageList
        messages={displayedMessages}
        currentUser={testUser}
        onMessageDelete={handleDeleteMessage}
        onUpdateMessage={handleUpdateMessage}
      />
      <NewMessage currentUser={testUser} onAddMessage={handleAddMessage} />
    </main>
  );
}

export default App;
