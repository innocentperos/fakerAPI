import {Express, Request, Response} from "express"


class FakerServer {
  
  private serverPath:string;
  private expressApp:Express;
  
  constructor(path:string,expressInstance:Express){
    
    this.serverPath = path;
    this.expressApp = expressInstance;
    
  }
  
  public static from(expressInstance:Express, path:string = "/api"):FakerServer{
    return new FakerServer(path, expressInstance)
  }
  
}

export {FakerServer};