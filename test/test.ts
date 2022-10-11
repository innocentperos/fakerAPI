import {Fields, FAModel , FakerServer, FAListTransformer} from "../src/"

const UserModel = new FAModel({
  name: new Fields.NameField(),
  email: new Fields.EmailField()
})

const server = new FakerServer("/api")

server.get("/user/", new FAListTransformer(UserModel))
server.get("/user/:id/", UserModel)
server.post("/user/:id/:name", (req, res, params)=>{
  
  res.send("hello adding user "+params?.name)
})



server.run()
