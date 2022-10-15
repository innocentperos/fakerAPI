import { Request } from "express";
import {FAAbstractModel} from "../" 
import {ParamsType} from "../core/"

abstract class FAAbstractTransformer{
  
  protected image: FAAbstractModel | FAAbstractTransformer  ;
  constructor(image : FAAbstractTransformer | FAAbstractModel){
    
    this.image = image
    
  }
  
  public abstract transform(request?: Request, params?: ParamsType):any
}

export {
  FAAbstractTransformer
}
