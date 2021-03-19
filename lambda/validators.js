/**
 * @abstract
 * @classdesc Class for abstracting common validation behaviour.
 */
class BaseValidator {
  /**
   * @constructor Constructor only should be used by subclasses.
   */
  constructor() { 
    if (new.target === BaseValidator) {
      throw new TypeError("Cannot construct BaseValidator instances directly");
    }
    this.caseInsensitive = true;
  }

  /**
   * Responsible for grabbing all required data.
   * Method only can be called after setting the language.
   */
  initialize() {
    if (this.language === undefined) {
      throw new Error("Method initialize() should be called only after setting the language.");
    }

    // Grabs data only if not set.
    if (this.validation_data) return;

    const data = this.getData();
    this.validation_data = new Set(data[this.language]);
    this.available_languages = new Set(Object.keys(data));

    if (!this.available_languages.has(this.language)) {
      throw new Error("Language not supported for this Category.");
    }
  }

  /**
   * Checks if value is valid or not. 
   * @param {String} value  Value to be validated
   * @returns {Boolean}     Boolean 
   */
  check(value) {
    // In case of validation is empty, try to re-fill it.
    if (!this.validation_data) {
      this.initialize();
    }

    // Handle case.
    if (this.caseInsensitive) {
      value = value.toLowerCase();
    }

    // Returns a bool if value is in set.
    return this.validation_data.has(value);
  }
}


/**
 * @class Creates a CountryValidator
 * @augments BaseValidator
 */
class CountryValidator extends BaseValidator {
    constructor(language) {
      super();
      this.language = language;
      this.category = 'country';
      super.initialize();
    }

    /**
     * Grab data
     * @returns Array with valid values
     */
    getData() {
      return {
        "pt-br": ["brasil", "argentina", "polonia"],
        "en-us": ["brazil", "argentina", "poland"]
      }
    }
};


/**
 * @class Creates a ColorValidator
 * @augments BaseValidator
 */
class ColorValidator extends BaseValidator {
    constructor(language) {
      super()
      this.language = language;
      this.category = 'color';
      super.initialize();
    }

    /**
     * Grab data
     * @returns Array with valid values
     */
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