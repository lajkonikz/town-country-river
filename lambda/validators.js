const BaseValidator = class BaseValidator {
  constructor() { }
  validate(value) {
    if (!this.validation_data) {
      this.validation_data = new Set(this.getData()[this.language]);
    }

    return this.validation_data.has(value);
  }
}

const CountryValidator = class CountryValidator extends BaseValidator {
    constructor(language) {
      super();
      this.language = language;
      this.category = 'country';
    }

    getData() {
      return {
        "pt-br": ["brasil", "argentina", "polonia"],
        "en-us": ["brazil", "argentina", "poland"]
      }
    }
};

const ColorValidator = class ColorValidator extends BaseValidator {
    constructor(language) {
        super();
        this.language = language;
        this.category = 'color';
    }

    getData() {
      return {
        "pt-br": ["vermelho", "verde", "azul"],
        "en-us": ["red", "green", "blue"]
      };
    }
};

module.exports = {
    Country: CountryValidator,
    Color: ColorValidator
};