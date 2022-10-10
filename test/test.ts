import {Fields, FAModel } from "../src/"

const userModel = new FAModel({
  name: new Fields.NameField(),
  email: new Fields.EmailField()
})

console.log(userModel.generate(null))
