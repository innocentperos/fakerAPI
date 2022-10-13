import { ViewSet, ViewSetType } from "./viewset"
import { PathUtil } from "./path"

function extractUrls(view:typeof ViewSet, root: string = "") {
  //extract the blueprint
  let blueprint = ((view as any).prototype as ViewSetType)

  // Extraxt the meta data that was added to the viewset class by the action decorator
  let actions = blueprint.__actions__
  let actionKeys = Array.from(actions.keys())

  let urls: string[] = []

  //loop through each action
  for (const key of actionKeys) {
    const action = actions.get(key)
    if (action?.detail) {
      urls.push(root + "/:id/" + key)
    } else {
      urls.push(root + "/" + key)
    }
  }

  return urls
}

type ViewSetMapType = {
  context: ViewSet, //Instance of the viewset
  urls: string[], // Urls of the viewset
  viewset: (typeof ViewSet) //Class of the viewset
}

class Router {

  // Maps viewset to there registed path
  protected viewsetPathMap: Map < string, ViewSetMapType >

    //protected viewsetPathMap: Map < string, ViewSet >


    // Map viewset registered to that viewset supported urls

    //private viewsetUrls: Map < string, string[] > ;


    constructor() {
      this.viewsetPathMap = new Map()

      //this.viewsetUrls = new Map()
    }

  /**
   * Register a viewset 
   * 
   * */

  register(path: string, viewset: new() => ViewSet) {

    if (this.viewsetPathMap.has(path)) {
      // Todo: Log that there is a viewset already for this route
      return
    }
    try {

      let context = new viewset()
      
      let urls = extractUrls(viewset , path)

      this.viewsetPathMap.set(path, {
        context,
        urls,
        viewset
      })
      //this.viewsetUrls.set(path, urls)

    } catch (error) {
      //Todo Show error will parsing the viewset 
    }

  }

  get urls(): string[] {
    return Array.from(this.viewsetPathMap.keys())

  }

  getViewsetUrls(path: string): string[] {
    if (this.viewsetPathMap.has(path)) {
      return (this.viewsetPathMap.get(path) as any).urls
    }
    return []
  }

  handle(path: string): boolean {

    // returns path if matches a router else undefined
    let matchedPath = handleRequestViaRouter(path, this)
    //No viewset to handle this path
    if (!matchedPath) return false

    let viewset = this.viewsetPathMap.get(matchedPath)

    if (!viewset) return false

    let result = handleRequestViaVewSet(path, this.getViewsetUrls(matchedPath), viewset)
    
    //console.log(result)
    if(result){
      result(null,null)
    }

    return false
  }
}

export {
  Router
}


function handleRequestViaRouter(path: string, router: Router): string | undefined {

  console.log("Router looking for match...")

  for (const viewsetPath of router.urls) {
    let vPath = viewsetPath + "/"
    if (!path.startsWith(vPath)) continue

    //it matches viewset path
    return viewsetPath;
  }
}

// Returns the function of the viewset that handles the request

function handleRequestViaVewSet(path: string, viewsetUrls: string[], view: ViewSetMapType): Function | undefined {

  console.log("Viewset checking for match...")

  let urls = view.urls

  for (const url of urls) {
    // Warn strip of isMath was provided as true, which may break the path checking, 
    // Todo Change isMatch strip parameter from static true to server dynamic configuration 
    let match = PathUtil.isMatch(url, path, true)
    
    
    if(match) {
      let _prototype = (view.viewset as any).prototype as ViewSetType
      //console.log(_prototype)
      const searchPattern = /\w+$/
      
      let [handlerKey] = searchPattern.exec(url) as any
      
      let handler = _prototype.__actions__.get(handlerKey)
      //console.log({handlerKey, handler})
      if(handler){
        
        return function(request?:Request, response?:Response){
          
          (handler?.handler as Function).bind(view.context)(request,response, match?.id)
        }
        
      }
    } 
    
  }

  return
}
