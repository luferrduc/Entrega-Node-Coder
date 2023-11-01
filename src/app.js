import path from "node:path";
import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import { __dirname } from "./utils.js";
import productsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";
import viewsRouter from "./routes/views.routes.js";
import mongoose from "mongoose";

// Manager de los mensajes
import MessageManager from "./dao/dbManagers/messages.manager.js"

const app = express();
const PORT = 8080;

// Engine Config
app.engine(".hbs", handlebars.engine({ extname: ".hbs" }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", ".hbs");

// Middlewares
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);


// Database
try {
  await mongoose.connect("mongodb+srv://lucianoferrando94:RxBWSWiQeU9Ic0Xy@cluster55575.ixldvmd.mongodb.net/ecommerce?retryWrites=true&w=majority") 
  console.log("Database connected")
} catch (error) {
  console.log(error.message)
}
// Server
const server = app.listen(PORT, () => {
  console.log(`Server is ready on http://localhost:${PORT}`);
});

const socketServer = new Server(server)

socketServer.on("connection", socket => {
  const messagesManager = new MessageManager()
  console.log("Cliente conectado")

  socket.on("message", async (data) => {
    try {
      const result = await messagesManager.create(data)
      const messages = await messagesManager.getAll()
      socketServer.emit("messageLogs", messages)
    } catch (error) {
      console.error({error: error.message})
    }
  
  })

  socket.on("authenticated", async (data) => {
    const messages = await messagesManager.getAll()
    socket.emit("messageLogs", messages)
    socket.broadcast.emit("newUserConnected", data)
  })
})

app.set('socketio', socketServer)