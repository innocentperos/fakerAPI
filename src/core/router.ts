import { ViewSet, ViewSetType } from "./viewset"


function extractUrls(view: ViewSet, root: string = "") {
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

class Router {

  // Maps viewset to there registed path
  protected viewsetPathMap: Map < string, ViewSet >

    // Map viewset registered to that viewset supported urls

    private viewsetUrls: Map < string, string[] > ;


  constructor() {
    this.viewsetPathMap = new Map()
    this.viewsetUrls = new Map()
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

      let instance = new viewset()
      let urls = extractUrls(viewset, path)
      
      this.viewsetPathMap.set(path, instance)
      this.viewsetUrls.set(path, urls)

    } catch (error) {
      //Todo Show error will parsing the viewset 
    }

  }

  get urls(): string[] {
    return Array.from(this.viewsetPathMap.keys())

  }
  
  getViewsetUrls(path:string): string[]{
    if (this.viewsetUrls.has(path)){
      return this.viewsetUrls.get(path) as string[]
    }
    return []
  }
}

export {
  Router
}
