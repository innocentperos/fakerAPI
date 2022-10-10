import {faker} from "@faker-js/faker";

/**
 * Field is the simples type of data of a model, it represent the type of data the model is ecpected to provide
 * @method generate This is could by a model to get the type of data the field is extected to provide
 * */
 
abstract class Field{

  public abstract generate(): any
}

class NameField extends Field {
  
  private _type:string;
  constructor(_type:"FirstName"|"LastName"|"FullName"="FullName"){
    super()
    this._type = _type
  }
  public generate(){
    const name = faker.name 
    if(this._type === "FirstName") return name.firstName()
    if(this._type === "LastName") return name.lastName()
    
    return name.fullName()
  }
}
class EmailField extends Field{
  
  public domain:string|undefined;
  public constructor(domain?:string){
    super()
    this.domain = domain
  }
  public generate(){
    return faker.internet.email()
  }
}
class TextField extends Field {
  private count:number = 50;
  
  constructor(count:number= 50){
    super()
    this.count = count
  }
  
  public generate(){
    return faker.random.words(this.count)
  }
  
}
class PhoneNumberField extends Field{
  
  public generate(){
    
    return faker.phone.number()
  }
}
class AvatarField extends Field{
  
  public generate(){
    return faker.image.avatar()
  }
}
class IDField extends Field {
  
  public generate(){
    return faker.datatype.uuid()
  }
}
class GenderField extends Field{
  
  public generate(){
    return faker.name.gender()
  }
}
class SexTypeField extends Field{
  
  public generate(){
    return faker.name.sexType()
  }
}

const Fields = {
  NameField,
  EmailField,
  PhoneNumberField,
  TextField,
  IDField,
  GenderField,
  SexTypeField
}

export {Fields, Field};
