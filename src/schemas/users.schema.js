import z from "zod"

const userSchema = z.object({
  first_name: z.string({
    invalid_type_error: "first_name must be a string",
    required_error: "first_name is required"
  }),
  last_name: z.string({
    invalid_type_error: "last_name must be a string",
    required_error: "last_name is required"
  }),
  email: z.string({
    invalid_type_error: "email must be a string",
    required_error: "email is required"
  }).email({ message: "email must be an valid email" }),
  age: z.number({
    invalid_type_error: "age must be a number",
    required_error: "age is required"
  }).min(1, {message: "age must be greater or equal to 1"}).or(z.string()),
  password: z.string().trim().min(6, { message: "password must be 6 or more characteres long"}),
  cart: z.string().uuid().nullish(),
  role: z.enum(["user", "admin", "premium"]).default("user"),
  last_connection: z.string().datetime().default((new Date()).toLocaleString()),
  documents: z.array(z.object({
    name: z.string(),
    reference: z.string()
  })).default([])

})


export function validateUser(user){
  return userSchema.safeParse(user)
} 