import {FAAbstractModel} from "../" 
import {ConfigType} from "../core/"

abstract class FAAbstractTransformer{
  
  protected image: FAAbstractModel | FAAbstractTransformer  ;
  constructor(image : FAAbstractTransformer | FAAbstractModel){
    
    this.image = image
    
  }
  
  public abstract transform(config: ConfigType):any
}

export {
  FAAbstractTransformer
}
