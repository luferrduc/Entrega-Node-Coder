export default class UsersDto  {
  constructor(user){
    // this.first_name = user.first_name
    // this.last_name = user.last_name
    // this.email = user.email
    // this.role = user.role
    // this.age = user.age
    // this.cart = user.cart
    // this.last_connection = user.last_connection
    this.user = user
  }
  getPublicData(){
    const publicUser = {
      first_name : this.user.first_name,
      last_name : this.user.last_name,
      email : this.user.email,
      role : this.user.role,
      age : this.user.age,
      cart : this.user.cart,
      last_connection : this.user.last_connection
    }
    return publicUser
  }
  getPrivateData(){
    const privateUser = {
      _id: this.user._id,
      first_name : this.user.first_name,
      last_name : this.user.last_name,
      email : this.user.email,
      role : this.user.role,
      age : this.user.age,
      cart : this.user.cart,
      last_connection : this.user.last_connection,
      isAdmin: this.user.role === "admin"
    }
    return privateUser
  }

}