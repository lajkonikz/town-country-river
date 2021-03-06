const { fail } = require('assert');
const assert = require('assert');
const validators = require('../validators')

describe('BaseValidator', () => {
  it('should be able to instantiate BaseValidator', () => {
    assert.throws(() => new validators.Base(), {
      name: "TypeError"
    });
  });
});

describe('CountryValidator', () => {
  var validator = new validators.Country('pt-br');

  it('should find a valid country', () => {
    assert.strictEqual(validator.check('brasil'), true);
  });

  it('should not find a valid country', () => {
    assert.strictEqual(validator.check('uniao sovietica'), false);
  });

  it('should check valid a case insensitive value', () => {
    assert.strictEqual(validator.check('BraSil'), true);
  });

  it('should check invalid a case sensitive value', () => {
    const sensitiveValidator = new validators.Country('pt-br');
    sensitiveValidator.caseInsensitive = false;
    assert.strictEqual(sensitiveValidator.check('BraSil'), false);
  });

  it('should fail if language does not exist', () => {
    assert.throws(() => {
      new validators.Country('fr-fr');  
    }, {
      name: "Error",
      message: "Language not supported for this Category."
    });
  });
});

describe('ColorValidator', () => {
  var validator = new validators.Color('pt-br');

  it('should find a valid color', () => {
    assert.strictEqual(validator.check('preto'), true);
  });

  it('should fail if language is unset', () => {
    var failValidator = new validators.Color('pt-br');
    failValidator.validation_data = null;
    failValidator.language = null;

    assert.throws(() => failValidator.check('x'), {
      name: "Error"
    });
  })
});
