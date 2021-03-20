const fs = require('fs');

/**
 * @abstract
 * @classdesc Class for abstracting common validation behaviour.
 */
class BaseValidator {
  /**
   * @constructor Constructor only should be used by subclasses.
   */
  constructor(language) { 
    if (new.target === BaseValidator) {
      throw new TypeError("Cannot construct BaseValidator instances directly");
    }
    this.language = language;
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
 * @mixin localStorageDataMixin
 */
const localStorageDataMixin = {
  getData() {
    let result = {}
    fs.readdirSync('./i18n/').forEach(file => {
      const regex = new RegExp(`^${this.category}_(\\w{2}-\\w{2}).json`, "g");
      const matches = regex.exec(file);
      
      if (matches !== null) {
        let content = fs.readFileSync(`./i18n/${file}`, 'utf8');
        const currentLanguage = matches[1];
        const values = JSON.parse(content);
        Object.assign(result, {[currentLanguage]: values});
      }
    });
    return result;
  }
};

/**
 * @class Creates a CountryValidator
 * @augments BaseValidator
 */
class CountryValidator extends BaseValidator {
  constructor(language) {
    super(language);
    this.category = 'country';
    super.initialize();
  }
};
Object.assign(CountryValidator.prototype, localStorageDataMixin);

/**
 * @class Creates a ColorValidator
 * @augments BaseValidator
 */
class ColorValidator extends BaseValidator {
  constructor(language) {
    super(language)
    this.category = 'color';
    super.initialize();
  }
};
Object.assign(ColorValidator.prototype, localStorageDataMixin);


module.exports = {
  Base: BaseValidator,
  Country: CountryValidator,
  Color: ColorValidator
};