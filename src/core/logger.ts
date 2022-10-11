import {Request, Response} from "express"

const MethodPadding = 8;

function logRequest(request:Request){
  const method = request.method.toUpperCase()
  const mLen = method.length
  const padLeft = Math.floor((7 - mLen )/2)
  const padRight = Math.ceil((7 - mLen )/2) 
  
  
  const colors:any = {
    GET: "\x1b[44m",
    POST: "\x1b[42m",
    DELETE: "\x1b[41m",
    PUT: "\x1b[42m",
    OPTIONS: "\x1b[43m"
    
  }
  let color:string | undefined = colors[method]
  if(!color) color = "\x1b[46m " 
  
  process.stdout.write("\x1b[0m \n")
  process.stdout.write(color)
  process.stdout.write(method.padStart(padLeft + mLen).padEnd(padLeft + mLen + padRight) )
  process.stdout.write("\x1b[0m");
  
  process.stdout.write("\t --- \t ")
  
  process.stdout.write(request.path)
  
  process.stdout.write("\n")
}

function logResponse(response:Response){
    process.stdout.write("\x1b[0m \n")

}

function logMessage(message:string, type:"error"|"info"|"debug"|"warning" = "debug"){
  
  const colors = {
    error : "\x1b[41m",
    info : "\x1b[44m",
    debug : "\x1b[42m",
    warning : "\x1b[43m"
  }
  
  process.stdout.write("\x1b[0m \n")
  process.stdout.write(colors[type])
  process.stdout.write(type.toUpperCase())
  process.stdout.write("\x1b[0m ")
  process.stdout.write(message + "\n")
  
}

export {
  logRequest, logResponse, logMessage
}
