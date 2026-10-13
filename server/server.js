const express = require("express");

const app = express();
const cors = require("cors");
const { Pool } = require("pg");
const { use } = require("react");
app.use(cors());
app.use(express.json());
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "messenger_db",
  password: "1234",
  port: 5432,
});

app.get("/", (req, res) => {
  res.json({
    message: "Сервер работает",
  });
});

app.get("/api/test", (req, res) => {
  res.json({
    message: "API работает",
  });
});

app.get("/api/chats", async (req, res) => {
  const userId = req.query.userId;
  const result = await pool.query(
    "SELECT * FROM chats WHERE user1_id = $1 OR user2_id = $1 ",
    [userId],
  );
  const chats = result.rows.map((chat) => {
    const interlocutorId =
      chat.user1_id === Number(userId) ? chat.user2_id : chat.user1_id;

    return {
      id: chat.id,
      userId: interlocutorId,
      lastMessage: chat.last_message ?? "",
    };
  });
  res.json(chats);
});
app.post("/api/chats", async (req, res) => {
  const { user1Id, user2Id } = req.body;
  if (
    Number.isInteger(user1Id) &&
    user1Id > 0 &&
    Number.isInteger(user2Id) &&
    user2Id > 0
  ) {
    try {
      const result = await pool.query(
        "SELECT * FROM chats WHERE (user1_id = $1 and user2_id=$2) or (user1_id = $2 and user2_id=$1)",
        [user1Id, user2Id],
      );
      if (result.rows.length !== 0) {
        res.json(result.rows[0]);
      } else {
        const newChat = await pool.query(
          `INSERT INTO chats (user1_id, user2_id, last_message)
   VALUES ($1, $2, NULL)
   RETURNING *`,
          [user1Id, user2Id],
        );
        res.json(newChat.rows[0]);
      }
    } catch (error) {
      console.error("Ошибка при создании чата:", error);

      return res.status(500).json({
        message: "Ошибка сервера при создании чата",
      });
    }
  } else {
    res.status(400).json({
      message: "Необходимо указать ID обоих пользователей",
    });
  }
});
app.post("/api/messages", async (req, res) => {
  try {
    const result = await pool.query(
      "INSERT INTO messages (chat_id,sender_id,text) VALUES($1,$2,$3)RETURNING *;",
      [req.body.chatId, req.body.senderId, req.body.text],
    );
    await pool.query("UPDATE chats SET last_message = $1 WHERE id = $2", [
      req.body.text,
      req.body.chatId,
    ]);
    res.json(result.rows[0]);
  } catch (error) {
    res.json({
      message: "Ошибка сервера",
    });
  }
});
app.post("/api/register", async (req, res) => {
  const result = await pool.query(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
    [req.body.name, req.body.email, req.body.password],
  );
  res.status(201).json({
    message: "Пользователь создан",
  });
});
app.post("/api/login", async (req, res) => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    req.body.email,
  ]);
  if (result.rows.length === 0) {
    res.json({
      message: "Такого пользователя не сущесвует",
    });
  } else {
    if (req.body.password === result.rows[0].password) {
      res.json({
        user: {
          id: result.rows[0].id,
          name: result.rows[0].name,
          email: result.rows[0].email,
        },
      });
    } else {
      res.json({
        message: "пароль не правльный",
      });
    }
  }
});
app.get("/api/messages/:chatId", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM messages WHERE chat_id = $1 ORDER BY created_at ASC",
      [req.params.chatId],
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Ошибка при загрузке сообщений:", error);

    res.status(500).json({ message: "Ошибка сервера" });
  }
});
app.get("/api/users/:id", async (req, res) => {
  const result = await pool.query("SELECT * FROM users WHERE id = $1 ", [
    req.params.id,
  ]);
  if (result.rows.length !== 0) {
    res.json({
      user: {
        id: result.rows[0].id,
        name: result.rows[0].name,
        email: result.rows[0].email,
      },
    });
  } else {
    res.json({
      message: "такого пользователя не существует",
    });
  }
});

app.get("/api/users", async (req, res) => {
  if (!req.query.name) {
    const users = await pool.query("SELECT * FROM users");
    res.json(
      users.rows.map((user) => ({
        id: user.id,
        name: user.name,
      })),
    );
  } else {
    const result = await pool.query("SELECT * FROM users WHERE name ILIKE $1", [
      "%" + req.query.name + "%",
    ]);
    res.json(
      result.rows.map((user) => ({
        id: user.id,
        name: user.name,
      })),
    );
  }
});
app.listen(3000, () => {
  console.log("Server started");
});
