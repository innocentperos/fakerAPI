# Transformers

Transformers are classes that can take a transformer or an `FAModel` and transform it into another format


Each [`Transformer`](#transformers) most be a decendant class of the `FAAbstractTransformer` class which accept an FAModel or another Transformer.

The transformer then has to override the abstract method `transform(config:ConfigType):any` which will be called any time data to be consumed is requested from the transformer class. check out `ConfigType`


## FAListTransformer
This transform allows you togenerate list of a specific `FAModel` 
