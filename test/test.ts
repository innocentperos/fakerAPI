import {Fields, FAModel , FakerServer} from "../src/"

const userModel = new FAModel({
  name: new Fields.NameField(),
  email: new Fields.EmailField()
})

const server = new FakerServer("/api")
server.run()
