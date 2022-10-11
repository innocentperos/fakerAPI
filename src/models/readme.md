---
noteId: "e6c9e3c0497711eda0dbc538f2b1c241"
tags: []

---

# Join Letter

## FAModel {#FAModel}

This defines the structure and schema of the data FakerAPI will generate

### Example

Let say we have a  route `GET "/api/comments/"` that will return a list of comment object which contains a username, full name and a body, we can fake this with FakerServer using the FAModel and FAListTransformer.

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

### API Reference

The FAModel is a child of the [`FAAbstractModel`](#FAAbstractModel) abstract class, it accept an object as the only parameter of it constructor. The object keys (which is a string) represent the field it should generate while the value (which is an instance of the [`Field`](#Field) , `string`, `number`, `any[]`, or [`function`](#FieldFunctionType)) represent the type of data it would populate it with.

> constructor
>
> ```typescript
>constructor(fields: {[key: string]: string | number | any[] | Field })
>
>```


