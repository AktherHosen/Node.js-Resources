const { create } = require("domain");
const http = require("http");
const path = require("path");
const fs = require("fs");
const { json } = require("stream/consumers");

const filepath = path.join(__dirname, "./DB/todo.json");

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathName = url.pathname;
  //   console.log(url);
  //   console.log(req, res);
  //   res.end("Welcome to the ToDo App server!");
  // GET ALL TODOS
  if (pathName === "/todos" && req.method === "GET") {
    // res.end("All todos will be fetched here");

    // Read the file
    const data = fs.readFileSync(filepath, "utf-8");
    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    // res.setHeader("Content-Type", "application/json");
    // res.setHeader("email", "test");
    // res.statusCode = 201;
    res.end(data);
  }
  // POST A TODO
  else if (pathName === "/todos/create-todos" && req.method === "POST") {
    let data = "";
    req.on("data", (chunk) => {
      data = data + chunk;
    });

    req.on("end", () => {
      console.log(data);
      const { title, body } = JSON.parse(data);
      console.log(title, body);
      const createdAt = new Date().toISOString();
      const todo = {
        title,
        body,
        createdAt,
      };
      const allTodos = fs.readFileSync(filepath, { encoding: "utf-8" });
      const parsedTodos = JSON.parse(allTodos);
      parsedTodos.push(todo);
      fs.writeFileSync(filepath, JSON.stringify(parsedTodos, null, 2), {
        encoding: "utf-8",
      });
      res.end(JSON.stringify(todo), null, 2);
    });
  } else if (pathName === "/todo" && req.method === "GET") {
    const title = url.searchParams.get("title");
    console.log(title);
    const data = fs.readFileSync(filepath, "utf-8");
    const parsedData = JSON.parse(data);
    const todo = parsedData.find((todo) => todo.title === title);
    if (!todo) {
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ message: "Todo not found" }));
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(todo));
  }
  // UPDATE A TODO
  else if (pathName === "/todos/update-todos" && req.method === "PATCH") {
    const title = url.searchParams.get("title");
    let data = "";
    req.on("data", (chunk) => {
      data = data + chunk;
    });

    req.on("end", () => {
      const { body } = JSON.parse(data);
      const allTodos = fs.readFileSync(filepath, { encoding: "utf-8" });
      const parsedTodos = JSON.parse(allTodos);
      const todoIndex = parsedTodos.findIndex((todo) => todo.title === title);
      if (todoIndex === -1) {
        res.writeHead(404, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ message: "Todo not found" }));
      }
      parsedTodos[todoIndex].body = body;
      fs.writeFileSync(filepath, JSON.stringify(parsedTodos, null, 2), {
        encoding: "utf-8",
      });
      res.end(
        JSON.stringify(
          {
            title,
            body,
            createdAt: parsedTodos[todoIndex].createdAt,
          },
          null,
          2
        )
      );
    });
  }
  // DELETE A TODO
  else if (pathName === "/todos/delete-todo" && req.method === "DELETE") {
    const title = url.searchParams.get("title");
    const allTodos = fs.readFileSync(filepath, { encoding: "utf-8" });
    const parsedTodos = JSON.parse(allTodos);
    const todoIndex = parsedTodos.findIndex((todo) => todo.title === title);
    if (todoIndex === -1) {
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ message: "Todo not found" }));
    }
    const deletedTodo = parsedTodos.splice(todoIndex, 1)[0];
    fs.writeFileSync(filepath, JSON.stringify(parsedTodos, null, 2), {
      encoding: "utf-8",
    });
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ message: "Todo deleted", todo: deletedTodo }, null, 2)
    );
  } else {
    res.end("Route not found");
  }
});
server.listen(5000, "127.0.0.1", () => {
  console.log(`Server is listening to port 5000`);
});

/*
 * /todos - GET - All todo
 * /todos/create-todos - POST - Create a todo
 *
 *
 */
