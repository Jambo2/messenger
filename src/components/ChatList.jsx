import { useState } from "react";
import NewChatSearch from "./NewChatSearch";

export default function ChatList({
  chats,
  onSelect,
  users,
  selectedChat,
  onSelectUser,
}) {
  const [showNewChat, setNewChat] = useState(false);

  return (
    <div>
      {showNewChat ? (
        <NewChatSearch
          onClose={() => setNewChat(false)}
          onSelectUser={onSelectUser}
        />
      ) : (
        <>
          <button
            onClick={() => setNewChat(true)}
            className="flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 h-10 w-10"
          >
            +
          </button>
          <div className="w-80 rounded-2xl bg-white">
            {chats.map((chat) => {
              const user = users.find((user) => user.id === chat.userId);

              return (
                <div
                  className={
                    chat.id === selectedChat
                      ? "bg-pink-300 p-4 flex gap-2 rounded-4xl mt-2 mb-2"
                      : " p-4 flex gap-2"
                  }
                  key={chat.id}
                >
                  <div
                    onClick={() => onSelectUser(user.id)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 font-bold"
                  >
                    {user.name[0]}
                  </div>
                  <div onClick={() => onSelect(chat.id)}>
                    <h2>
                      {user.name}-{user.id}
                    </h2>
                    <p>Последнее сообщение: {chat.lastMessage}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
