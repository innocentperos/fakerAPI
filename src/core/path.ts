
type ParamsType = {
  [key : string] : any
}

function isMatch(pathMap: string, currentPath: string):undefined | ParamsType{
  
  //This path is a static path return an empty parameter list, not regex comparison required to be performed
  if (pathMap == currentPath) return {

  }
  
  //Spliting both the current and path to an array with separator / 
  let _path = pathMap.trim().split("/")
  let _currentPath = currentPath.trim().split("/")
  
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
      const pattern = /^\:/
      const endPattern = /$\?/
      
      if (_p.match(pattern)) {
        
        // Checks if the parameter is optional (has ?  as the end)
        if(_p.match(endPattern)){
          params[_p.replace(pattern, "")] = _c
          continue
        }
        
        // The paramater is not optional , then check that the parameter is not empty
        if(_c.length >0 ) {
          params[_p.replace(pattern, "")] = _c
          continue
        }
        
        // The parameter is not optional and the parameter was not provided
        failed = true 
        break
        
      } else {
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
