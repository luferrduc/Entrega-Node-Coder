import z from "zod"

const cartSchema = z.object({
  products: z.array(z.object({
    product: z.string({
      invalid_type_error: "product must be a string",
      required_error: "product is required"
    }).uuid({message: "product must be a UUID format"}),
    quantity: z.number({
      invalid_type_error: "quantity must be a number"
    }).min(1).default(1)
  })).default([]),

})


export function validateCart(cart){
  return cartSchema.safeParse(cart)
} 