import configs from "../config.js"

const persistence = configs.persistence


let Products, Carts, Messages, Users, Tickets

switch(persistence) {
  case 'MONGO':
    console.log("Trabajando con BD Mongo")
    // Imports dinámicos
    const mongoose = await import('mongoose')
    const MongoStore = await import("connect-mongo")
    try {
      await mongoose.connect(configs.mongoUrl)    
      const { default: ProductsMongo } = await import('./dbManagers/products.manager.js')
      const { default: CartsMongo } = await import('./dbManagers/carts.manager.js')
      const { default: UsersMongo } = await import('./dbManagers/users.manager.js')
      const { default: MessagesMongo } = await import('./dbManagers/messages.manager.js')
      const { default: TicketsMongo } = await import('./dbManagers/tickets.manager.js')

      Products = ProductsMongo
      Carts = CartsMongo
      Users = UsersMongo
      Messages = MessagesMongo
      Tickets = TicketsMongo
   
    } catch (error) {
      console.log(error.message)
      mongoose.disconnect()
    }
    break
  case 'FILE':
    console.log("Trabajando con archivos")
    const { default: CartsFile } = await import('./fileManagers/carts.file.js')
    const { default: ProductsFile } = await import('./fileManagers/products.file.js')
    // const { default: CartsFile } = await import('./fileManagers/carts.file.js')
    // const { default: CartsFile } = await import('./fileManagers/carts.file.js')
    Products = ProductsFile
    Carts = CartsFile
    // Users = UsersMongo
    // Messages = MessagesMongo
    // Tickets = TicketsMongo

    break    
}

export {
  Products,
  Carts,
  Users,
  Messages,
  Tickets
}