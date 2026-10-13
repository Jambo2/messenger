import React, { useState } from "react";

export default function Register({ onLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleRegister() {
    setError("");

    if (password === "" || confirmPassword === "") {
      setError("пустые строки");
      return;
    }
    if (password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов");
      return;
    }
    if (password !== confirmPassword) {
      setError("пароли не совпадают ");
      return;
    }
    if (name === "") {
      setError("Введите своё имя");
      return;
    }
    if (email === "") {
      setError("Введите email");
      return;
    }
    if (!email.includes("@")) {
      setError("Введите корректный email");
      return;
    }

    const data = {
      name: name,
      email: email,
      password: password,
    };
    console.log(data);

    const json = JSON.stringify(data);
    try {
      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: json,
      });
      if (response.ok) {
        const result = await response.json();
        console.log(result);
        setSuccess(true);
      } else {
        setError("Ошибка регистрации");
      }
    } catch (error) {
      setError("Ошибка регистрации");
    }
  }

  return (
    <div className=" min-h-screen flex items-center justify-center bg-pink-50">
      <div className=" bg-white rounded-lg shadow-lg p-8 w-full max-w-md flex flex-col gap-2">
        <h1 className=" text-2xl font-bold text-gray-800 mb-2">Регистрация</h1>
        <div className=" flex flex-col gap-2">
          <input
            className="flex-1 p-2 rounded-lg border-b-2 border-pink-200 bg-pink-50/50 outline-none focus:border-pink-400 focus:bg-white transition"
            type="text"
            placeholder="Имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            className="flex-1 p-2 rounded-lg border-b-2 border-pink-200 bg-pink-50/50 outline-none focus:border-pink-400 focus:bg-white transition"
            type="password"
            placeholder="Повторите пароль"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {error !== "" && <p className=" text-red-500">{error}</p>}
          {success && <p className=" text-green-400">вы успешно зарегались</p>}
        </div>
        <button
          className=" bg-pink-400 hover:bg-pink-500 text-white font-medium rounded-lg py-3 w-full transition"
          onClick={handleRegister}
        >
          Зарегистрироваться
        </button>
        <button
          className=" text-pink-500 hover:text-pink-600 font-medium transition"
          onClick={onLogin}
        >
          Уже есть аккаунт
        </button>
      </div>
    </div>
  );
}
