import {ViewSet} from "./viewset"
import {Model} from "./../"
import {Request, Response} from "express"

/**
 * This viewset is used to create an in-memory stateful data of a specific method, this is useful when you need random data but can be access from different part of your application an expect it to provide thesame data everytime
 */
abstract class StatefulViewSet extends ViewSet{
  
  private models = new Map()
  private lastId = 0
  private model:Model

  constructor(model:Model){
    super()
    this.model = model
  }

  public get(request:Request, response:Response){
    response.send(Array.from(this.models.values()))
  }
  
  public create(request:Request, response:Response){
    
    const length = this.lastId
    
    const _model = this.model.generate(request, {})
    const model = {..._model, id: this.lastId}
    
    this.models.set(String(this.lastId), model)
    this.lastId ++;
    response.status(201)
    response.send(model)
    
  }
  
  public retreive(request:Request, response:Response,id:any){
    
    const _model = this.models.get(id)
    
    if(_model){
      response.send(_model)
    }else{
      response.status(404)
      response.send({
        "message":"Item not found"
      })
    }
  }
  
  public update(request:Request, response:Response, id: any ){
    
    const _model = this.models.get(id)
    
    if(_model){
      const model = {
        id, ... this.model.generate(request,{id})
      }
      this.models.set(id, model)
      response.send(model)
    }else{
      response.status(404)
      response.send({
        "message": "Item not found"
      })
    }
  }
  
  public delete(request:Request, response:Response, id:any){
    
    const _model = this.models.get(id)
    if(_model){
      this.models.delete(id)
      response.send({
        message:"Item removed/deleted"
      })
    }else{
      response.status(404)
      response.send({
        "message": "Item not found"
      })
    }
  }
  
  protected getItem(id:any){
    return this.models.get(id)
  }
  
  public addItem(item:any, id?:any):any{
    if(id){
      this.models.set(id,item)
      return id
    }else{
      const _id = String(this.lastId)
      this.models.set(_id,item)
      return _id

    }
    
  }
  
}

export {
  StatefulViewSet
}
