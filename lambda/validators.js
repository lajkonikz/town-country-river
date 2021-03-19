const BaseValidator = class BaseValidator {
    constructor() { }
    validate(value) {
      if (!this.validation_data) {
        this.validation_data = new Set(this.data[this.language]);
      }
  
      // return
      const exists = this.validation_data.has(value);
      
      console.log(`You are validating a ${this.language} ${this.category}`)
      console.log(this.validation_data);
      
      console.log(`It exists? ${exists}`)
      return exists
    }
  }
  
  const CountryValidator = class CountryValidator extends BaseValidator {
      constructor(language) {
          super();
          this.language = language;
          this.category = 'country';
          this.data = {
            "pt-br": ["brasil", "argentina", "polonia"],
            "en-us": ["brazil", "argentina", "poland"]
          };
      }
  };
  
  const ColorValidator = class ColorValidator extends BaseValidator {
      constructor(language) {
          super();
          this.language = language;
          this.category = 'color';
          // import from json
          this.data = {
            "pt-br": ["vermelho", "verde", "azul"],
            "en-us": ["red", "green", "blue"]
          }
          
      }
  };
  
  const validator = new CountryValidator("pt-br");
  validator.validate('azul');