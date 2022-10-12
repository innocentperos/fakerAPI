
type ParamsType = {
  [key : string] : any
}

/**
 * Performs an comparison of the current path to the path format 
 * Basically it will extract dynamic parameters from the currentPath that has thesame position with a /:param/ in the pathFormat 
 * 
 * Example
 * 
 * ```javascript
 * console.log(isMatch("/:id/info", "/5/info"))
 * ```
 * 
 * This will return 
 * 
 * >```json
 * >{
   >"id" : 5
 >}
 >```
 
 * @param {string} pathFormat The path format to compare the currentPath to
 * 
 * @param {string} currentPath The actual path which will be compared to the format and data will be extracted
 * 
 * @param {boolean} stripEnd If ending trailing forward slashes would be omitted
 * 
 * @returns {undefined | ParamsType} Undefined if currentPath does not match pathFormat, else an Object that contains all exracted params with key as the param name and the value as the extacted data
 * .
 * */
function isMatch(pathFormat: string, currentPath: string, stripEnd:boolean = false):undefined | ParamsType{
  
  /*This path is a static path return an empty parameter list, not regex comparison required to be performed
  */
  if (pathFormat == currentPath) return {

  }
  
  //Spliting both the current and path to an array with separator / 
  let strippedPath = pathFormat.trim()
  let strippedCurrentPath = currentPath.trim()
  
  
  
  let _path = strippedPath.split("/")
  let _currentPath = strippedCurrentPath.split("/")
  
  //This will eliminate / at the end of paths 
  //example /users/ will become /users
  if(stripEnd){
    if(_path[_path.length-1].length<1){
      _path.pop()
    }
    if(_currentPath[_currentPath.length-1].length<1){
      _currentPath.pop()
    }
  }
  
  // Path segment length does not match 
  if (_path.length !== _currentPath.length) return

  let failed = false
  const params: ParamsType= {}

  for (let index = 0; index < _currentPath.length; index++) {
    
    // Remove trailing spaces to path and current path, to avoid mismatchs due to user error
    const _c = _currentPath[index].trim()
    const _p = _path[index].trim()

    if (_p === _c) {
      continue
    } else {
      const paramPattern = /^\:.+$/
      const endPattern = /\?$/
      const optionalPattern =/^\**$/
      
      if (_p.match(paramPattern)) {
        
        // Checks if the parameter is optional (has ?  as the end)
        const startParamPatten = /^\:/
        if(_p.match(endPattern)){
          
          params[_p.replace(startParamPatten, "")] = _c
          
          continue
        }
        
        // The paramater is not optional , then check that the parameter is not empty
        if(_c.length >0 ) {
          params[_p.replace(startParamPatten, "")] = _c
          continue
        }
        
        // The parameter is not optional and the parameter was not provided
        failed = true 
        break
        
      }else if(_p.match(optionalPattern)){
        //Ignore this path of the pattern and move to the next segment
        continue
      }else {
        failed = true
        break;
      }
    }

  }

  // Paths did not match,  return undefined (nothing)
  if (failed) return
  
  //Paths matches all return the parsed parameters
  return params

}

const Path = {
  isMatch
}

export {
  Path as PathUtil,
  ParamsType
}
