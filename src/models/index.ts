import { Fields, Field } from "./fields"
import {ConfigType} from "./../core"

abstract class FAAbstractModel {

  public abstract generate(config?: ConfigType): object | any[] | string | number
}

type FieldFunctionType = (config?: any) => string | any[] | number | object

type FieldsType = {
  [key: string]: string | number | any[] | Field | FieldFunctionType
}

class FAModel extends FAAbstractModel {

  protected fields: FieldsType = {}

  constructor(fields: FieldsType) {
    super()
    this.fields = fields
  }

  public generate(config?: ConfigType) {

    // Get the keys of the fields
    const keys = Object.keys(this.fields)

    const build: {
      [key: string]: any
    } = {}
    for (const key of keys) {
      const field = this.fields[key]

      if (typeof field === "string" || typeof field === "number") {
        build[key] = field
      } else if (typeof field === "function") {
        build[key] = (field as Function)(config)
      } else if (field instanceof Field) {
        build[key] = (field as Field).generate()
      }else if (field instanceof Array) {
        build[key] = field
      } else {
        build[key] = field
      }
    } 
    return build
  }
}

export {
  FAModel, FAAbstractModel
}
