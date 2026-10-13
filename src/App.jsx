import React, { useState, useEffect } from "react";
import ChatList from "./components/ChatList";
import ChatWindow from "./components/ChatWindow";
import Login from "./components/Login";
import Header from "./components/Header";
import Profile from "./components/Profile";
import Register from "./components/Register";

export default function App() {
  const [messageText, setMessageText] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [serverUsers, setServerUsers] = useState([]);
  const [showRegister, setShowRegister] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (selectedChat !== null) {
      getMessages(selectedChat);
    }
  }, [selectedChat]);

  useEffect(() => {
    if (currentUser !== null) {
      getChats(currentUser.id);
    }
  }, [currentUser]);
  useEffect(() => {
    getUsers();
  }, []);

  const selectedChatData = chats.find((chat) => chat.id === selectedChat);
  async function handleStartChat(userId) {
    const existingChat = chats.find((chat) => chat.userId === userId);

    if (existingChat) {
      setSelectedChat(existingChat.id);
      setShowProfile(false);
    } else {
      console.log(typeof currentUser.id, typeof userId);
      const response = await fetch("http://localhost:3000/api/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          user1Id: Number(currentUser.id),
          user2Id: Number(userId),
        }),
      });

      const chatData = await response.json();
      const newChat = {
        ...chatData,
        userId:
          chatData.user1_id === currentUser.id
            ? Number(chatData.user2_id)
            : Number(chatData.user1_id),
        lastMessage: chatData.last_message ?? "",
      };
      console.log("Текущий пользователь:", currentUser.id);
      console.log("Выбранный пользователь:", userId);
      console.log("Ответ сервера:", chatData);
      setChats([...chats, newChat]);
      setSelectedChat(newChat.id);
      setShowProfile(false);
    }
  }

  async function getMessages(chatId) {
    try {
      const response = await fetch(
        `http://localhost:3000/api/messages/${chatId}`,
      );

      if (!response.ok) {
        throw new Error("Не удалось загрузить сообщения");
      }

      const result = await response.json();

      setMessages(
        result.map((message) => ({
          ...message,
          id: Number(message.id),
          senderId: Number(message.sender_id),
          createdAt: message.created_at,
        })),
      );
    } catch (error) {
      console.error("Ошибка загрузки сообщений:", error);
    }
  }
  const handleDeleteMessage = (messageId) => {
    const newChats = chats.map((chat) => {
      if (chat.id === selectedChat) {
        const newMessages = chat.messages.filter((message) => {
          return message.id !== messageId;
        });
        return {
          ...chat,
          messages: newMessages,
          lastMessage:
            newMessages.length > 0
              ? newMessages[newMessages.length - 1].text
              : "",
        };
      }
      return chat;
    });
    setChats(newChats);
  };

  async function getUsers() {
    const response = await fetch("http://localhost:3000/api/users");
    const result = await response.json();
    const users = result.map((user) => ({
      ...user,
      id: Number(user.id),
    }));
    setServerUsers(users);
  }
  async function getChats(userId) {
    const response = await fetch(
      `http://localhost:3000/api/chats?userId=${userId}`,
    );
    const result = await response.json();
    setChats(result);
  }
  async function onSelectUser(id) {
    const response = await fetch(`http://localhost:3000/api/users/${id}`);
    const user = await response.json();
    setSelectedUser({
      ...user.user,
      id: Number(user.user.id),
    });
    setShowProfile(true);
  }
  const handleSendMessage = async () => {
    if (messageText.trim() === "") {
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/messages", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          chatId: selectedChat,
          text: messageText,
          senderId: currentUser.id,
        }),
      });
      if (!response.ok) {
        throw new Error("Не удалось отправить сообщение");
      }
      setChats((prevChats) =>
        prevChats.map((chat) => {
          if (chat.id === selectedChat)
            return {
              ...chat,
              lastMessage: messageText,
            };
          return chat;
        }),
      );
      await getMessages(selectedChat);
      setMessageText("");
    } catch (error) {
      console.error(error);
    }
  };
  if (currentUser === null) {
    if (showRegister === false) {
      return (
        <Login
          onRegister={() => {
            setShowRegister(true);
          }}
          onLogin={setCurrentUser}
        />
      );
    } else {
      return (
        <Register
          onLogin={() => {
            setShowRegister(false);
          }}
        />
      );
    }
  }

  return (
    <div>
      <Header
        onProfile={() => setShowProfile(true)}
        currentUser={currentUser}
        onLogout={() => {
          setCurrentUser(null);
          setSelectedChat(null);
        }}
      />

      {showProfile ? (
        <Profile
          onStartChat={handleStartChat}
          selectedUser={selectedUser}
          currentUser={currentUser}
          onClose={() => {
            setShowProfile(false);
            setSelectedUser(null);
          }}
        />
      ) : (
        <>
          <div className=" flex gap-3 p-3">
            <ChatList
              selectedChat={selectedChat}
              chats={chats}
              users={serverUsers}
              onSelect={setSelectedChat}
              onSelectUser={onSelectUser}
            />

            {selectedChatData && (
              <ChatWindow
                messages={messages}
                onDeleteMessage={handleDeleteMessage}
                currentUser={currentUser}
                chat={selectedChatData}
                onSendMessage={handleSendMessage}
                messageText={messageText}
                setMessageText={setMessageText}
                users={serverUsers}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
