---
noteId: "e6c9e3c0497711eda0dbc538f2b1c241"
tags: []

---

## FAModel
This defines the structure and schema of the data FakerAPI will generate

### Example
Let say we have a  route ` GET "/api/comments/"` that will return a list of comment object which contains a username, full name and a body, we can fake this with FakerServer using the FAModel and FAListTransformer.


```typescript

const FakerAPI = require("faker-api")

const {FakerServer, Fields, FAModel, FAListTransformer} = FakerAPI 

const CommentModel = new FAModel({
    username: new Fields.UsernameField(),
    name: new Fields.EmailField(),
    body: new Fields.TextField()
})

const fakerServer = new FakerServer("/api")

fakerServer.get("/comments/", new FAListTransformer(CommentModel))

fakerServer.run(5000)

```