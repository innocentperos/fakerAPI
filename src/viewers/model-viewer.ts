import {FAAbstractModel} from "../models"

class FAAbstractView {
  
  
  protected urlMethodsMap = new Map()
  
  public FAAbstractView(){
    
  }
  
  protected registerAction(path:string, detail: boolean, action: Function){
    
  }
  
  protected get urls(){
    return []
  }
}
