const assert = require('assert');

const validators = require('../validators')

describe('CountryValidator', () => {
  
  var validator = new validators.Country('pt-br');

  it('should find a valid country', () => {
    assert.strictEqual(validator.check('brasil'), true);
  });

  it('should not find a valid country', () => {
    assert.strictEqual(validator.check('uniao sovietica'), false);
  });

  it('should check valid a case insensitive value', () => {
    assert.strictEqual(validator.check('BraSil'));
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