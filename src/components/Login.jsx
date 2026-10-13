import { useState } from "react";

export default function Login({ onLogin, onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin() {
    if (email.trim() === "" || password.trim() === "") {
      setError("Пустая строка");
      return;
    }
    if (!email.includes("@")) {
      setError("Введите корректный email");
      return;
    }
    const data = {
      email: email,
      password: password,
    };

    setError("");
    try {
      const json = JSON.stringify(data);
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: json,
      });
      if (response.ok) {
        const result = await response.json();

        if (result.user) {
          onLogin({
            ...result.user,
            id: Number(result.user.id),
          });
        } else {
          setError(result.message);
        }
      } else {
        setError("Ошибка сервера");
      }
    } catch {
      setError("Не удалось подключиться к серверу");
    }
  }

  return (
    <div className=" min-h-screen flex items-center justify-center bg-pink-50 bg-gradie">
      <div className=" bg-white p-8 rounded-2xl shadow-xl w-full max-w-md flex flex-col gap-3">
        <h1 className=" text-2xl font-bold text-gray-800 mb-2 tracking-tight">
          Вход
        </h1>
        <input
          className="flex-1 p-2 rounded-lg border-b-2 border-pink-200 bg-pink-50/50 outline-none focus:border-pink-400 focus:bg-white transition"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="flex-1 p-2 rounded-lg border-b-2 border-pink-200 bg-pink-50/50 outline-none focus:border-pink-400 focus:bg-white transition"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p className=" text-pink-700 font-bold ">{error} </p>
        <button
          className=" bg-pink-400 hover:bg-pink-500 text-white font-medium rounded-lg py-3 w-full transition"
          onClick={handleLogin}
        >
          Войти
        </button>
        <button
          className="text-pink-500 hover:text-pink-600 font-medium transition "
          onClick={onRegister}
        >
          Зарегистрироваться
        </button>
      </div>
    </div>
  );
}
