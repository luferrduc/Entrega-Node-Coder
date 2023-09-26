import express from 'express'
import productsRouter from './routes/products.routes.js'
import cartsRouter from './routes/carts.routes.js'
const app = express()
const PORT = 8080



// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);


app.listen(PORT, ()=>{
    console.log(`Server listening on port ${PORT}`)
})