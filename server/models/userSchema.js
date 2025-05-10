import { model, Schema } from "mongoose";


const userSchema = Schema({
  name:{
    type:String,
  },
  pasword:{
    type:String,
  }
})

const User = model('users',userSchema);

export default User;