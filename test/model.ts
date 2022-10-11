
import {FakerServer, Fields, FAModel, FAListTransformer}  from "../src"

const CommentModel = new FAModel({
    username: new Fields.UsernameField(),
    name: new Fields.EmailField(),
    body: new Fields.TextField()
})

const fakerServer = new FakerServer("/api")

fakerServer.get("/comments/", new FAListTransformer(CommentModel))

fakerServer.run(5000)