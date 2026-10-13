export default function Header({ currentUser, onLogout, onProfile }) {
  return (
    <header className="flex items-center justify-between px-6 py-4">
      <h1>Messemger </h1>
      <div className=" flex items-center gap-4">
        <div className=" flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 h-10 w-10">
          {currentUser.name[0]}
        </div>
        <span className=" font-medium">{currentUser.name}</span>

        <button
          className=" rounded-lg px-3 py-2 text-sm hover:bg-gray-300"
          onClick={onProfile}
        >
          Профиль
        </button>

        <button
          className="rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-50"
          onClick={onLogout}
        >
          Выйти
        </button>
      </div>
    </header>
  );
}
