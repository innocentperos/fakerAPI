import { Request } from "express"
import {FAAbstractTransformer} from "."
import {FAAbstractModel} from "../"
import {ParamsType} from "../core/"


class FAListTransformer<T extends FAAbstractModel> extends FAAbstractTransformer{
  
  constructor (model: FAAbstractModel ){
    super(model)
  }
  
  public transform (requesr:Request, params:ParamsType) {
    const copy = []
    
    for(let index = 0; index <10 ; index++){
      copy.push((this.image as FAAbstractModel).generate())
    }
    return copy
  }
}

export default FAListTransformer;
