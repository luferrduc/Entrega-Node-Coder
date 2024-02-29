import z from "zod"

const productSchema = z.object({
  title: z.string({
    invalid_type_error: "title must be a string",
    required_error: "title is required"
  }),
  description: z.string(),
  price: z.number({
    invalid_type_error: "price must be a number",
    required_error: "price is required"
  }).min(100, {
    message: "number must be greater or equal than 100"
  }),
  thumbnail: z.array(z.string()).default([]),
  code: z.string({
    invalid_type_error: "code must be a string",
    required_error: "code is required"
  }).trim().min(5, {
    message: "code must be 5 or more characteres long"
  }).max(12, {
    message: "code must be 12 or less characteres long"
  }).toLowerCase(),
  stock: z.number({
    invalid_type_error: "stock must be a number",
    required_error: "stock is required"
  }).min(0),
  status: z.boolean({
    invalid_type_error: "status must be a boolean",
    required_error: "status is required"
  }).default(true),
  owner: z.string().default("admin")
})


export function validateProduct(product){
  return productSchema.safeParse(product)
} 