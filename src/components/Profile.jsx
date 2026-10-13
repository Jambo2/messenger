export default function Profile({
  currentUser,
  onClose,
  selectedUser,
  onStartChat,
}) {
  const user = selectedUser || currentUser;
  return (
    <div className="w-96 rounded-2xl bg-white p-6 shadow-xl">
      <h2 className="mb-4 text-2xl font-bold">Профиль</h2>

      <div className="mb-4 flex items-center gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-300 text-2xl font-bold">
          {user.name[0]}
        </div>

        <div>
          <p className="text-lg font-medium">{user.name}</p>
          <p className="text-gray-500">ID: {user.id}</p>
        </div>
      </div>
      {selectedUser === null ? (
        <button className="w-full p-3 bg-pink-400 rounded-xl font-medium hover:bg-pink-500 text-white transition">
          редактировать
        </button>
      ) : (
        <div className=" mt-6 flex flex-col gap-2 ">
          <button
            onClick={() => onStartChat(user.id)}
            className="w-full p-3 bg-pink-400 rounded-xl font-medium hover:bg-pink-500 text-white transition"
          >
            Написать сообщение
          </button>
          <button className="w-full p-3 bg-pink-400 rounded-xl font-medium hover:bg-pink-500 text-white transition">
            добавить в друзья
          </button>
        </div>
      )}
      <button
        className=" mt-4 rounded-lg px-4 py-2 text-sm text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
        onClick={onClose}
      >
        Назад
      </button>
    </div>
  );
}
