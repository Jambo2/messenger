import { useState } from "react";

export default function ChatWindow({
  chat,
  messages,
  onSendMessage,
  messageText,
  setMessageText,
  users,
  currentUser,
  onDeleteMessage,
}) {
  function formatTime(timestamp) {
    const date = new Date(timestamp);
    return `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes(),
    ).padStart(2, "0")}`;
  }

  const [contextMenu, setContextMenu] = useState(null);

  const user = users.find((user) => user.id === chat.userId);

  return (
    <div
      onClick={() => setContextMenu(null)}
      className="flex flex-1 flex-col shadow-xl"
    >
      <div className="flex h-16 items-center px-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-400 font-bold text-white">
          {user.name[0]}
        </div>

        <div className="ml-3">
          <h2 className="font-semibold text-gray-800">{user.name}</h2>
          <p className="text-xs text-gray-400">в сети</p>
        </div>
      </div>

      <div className="flex-1 space-y-3 max-h-80 overflow-y-auto p-5">
        {messages.map((message) => {
          const isMyMessage = message.senderId === currentUser.id;

          return (
            <div
              key={message.id}
              className={
                isMyMessage ? "flex justify-end" : "flex justify-start"
              }
            >
              <div
                className={
                  isMyMessage
                    ? "max-w-xs rounded-2xl rounded-br-md bg-pink-300 px-4 py-3 shadow-sm"
                    : "max-w-xs rounded-2xl rounded-bl-md bg-white px-4 py-3 shadow-sm"
                }
                onContextMenu={(e) => {
                  e.preventDefault();

                  setContextMenu({
                    messageId: message.id,
                    x: e.clientX,
                    y: e.clientY,
                  });
                }}
              >
                <p className="mb-1 text-sm font-semibold text-gray-700">
                  {isMyMessage ? "Я" : user.name}
                </p>

                <p className="text-sm text-gray-800">{message.text}</p>

                <span className="mt-1 block text-right text-xs text-gray-400">
                  {formatTime(message.createdAt)}
                </span>
              </div>
            </div>
          );
        })}

        {messages.length === 0 && (
          <p className="text-center text-sm text-gray-400">Нет сообщений</p>
        )}
      </div>

      {contextMenu && (
        <button
          onClick={() => {
            onDeleteMessage(contextMenu.messageId);
            setContextMenu(null);
          }}
          className="fixed rounded-lg bg-white px-4 py-2 text-sm shadow-lg hover:bg-gray-100"
          style={{
            left: contextMenu.x,
            top: contextMenu.y,
          }}
        >
          Удалить
        </button>
      )}

      <div className="flex gap-2 bg-white p-4">
        <input
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSendMessage();
            }
          }}
          className="flex-1 rounded-xl border border-gray-300 px-4 py-2 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Введите текст..."
        />

        <button
          className="rounded-xl bg-pink-400 px-5 py-2 font-medium text-white transition hover:bg-pink-500"
          onClick={onSendMessage}
        >
          Отправить
        </button>
      </div>
    </div>
  );
}
