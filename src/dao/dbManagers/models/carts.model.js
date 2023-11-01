import mongoose from "mongoose"


const cartsCollection = "carts"

const productsCartsSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        immutable: true
    },
    quantity: {
        type: Number,
        default: 1
    }
})

const cartsSchema = new mongoose.Schema({
    products: {
        type: [
            productsCartsSchema
        ],
        required: false,
        default: []
    }
})

export const cartsModel = mongoose.model(cartsCollection, cartsSchema)