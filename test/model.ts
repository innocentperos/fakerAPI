
import {FakerServer, Fields, Model, ListTransformer}  from "../src"

const CommentModel = new Model({
    username: new Fields.UsernameField(),
    name: new Fields.EmailField(),
    body: new Fields.TextField()
})

const fakerServer = new FakerServer()

fakerServer.get("/comments/", new ListTransformer(CommentModel))

fakerServer.run(5000)
