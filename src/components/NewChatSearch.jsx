import React, { useState } from "react";

export default function NewChatSearch({ onClose, onSelectUser }) {
  const [searchText, setSearchText] = useState("");
  const [users, setUsers] = useState([]);
  async function searchUsers() {
    const response = await fetch(
      `http://localhost:3000/api/users?name=${searchText}`,
    );
    const list = await response.json();
    setUsers(list);
  }
  return (
    <div className="w-80 rounded-2xl bg-white p-5 shadow-lg">
      <div className=" flex gap-2">
        <input
          className="flex-1 p-2 rounded-lg border-b-2 border-pink-200 bg-pink-50/50 outline-none focus:border-pink-400 focus:bg-white transition"
          type="text"
          placeholder="Найти пользователя"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
          }}
        />
        <button
          className="rounded-xl bg-pink-400 px-4 py-2 font-medium text-white transition hover:bg-pink-500"
          onClick={() => searchUsers()}
        >
          Найти
        </button>
      </div>
      <button
        onClick={onClose}
        className="mt-4 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-pink-100 hover:text-pink-500"
      >
        ←
      </button>
      <div className=" max-h-80 overflow-y-auto mt-4 flex flex-col gap-2 ">
        {users.map((user) => (
          <button
            className=" flex items-center gap-3 rounded-xl p-3 text-left transition hover:bg-pink-50 shadow"
            onClick={() => onSelectUser(user.id)}
            key={user.id}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pink-200 font-bold text-pink-700">
              {user.name[0]}
            </div>
            <div>
              <p className="font-medium text-gray-800"> {user.name} </p>
              <p className="text-sm text-gray-400"> ID: {user.id} </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
