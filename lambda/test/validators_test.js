const assert = require('assert');

const validators = require('../validators')

describe('Validators', () => {
  
  var validator = new validators.Country('pt-br');

  it('should find a Country', () => {
    assert.strictEqual(validator.validate('brasil'), true);
  });

  it('should not find a Country', () => {
    assert.strictEqual(validator.validate('uniao sovietica'), false);
  });

  it('should not find a Color', () => {
    assert.strictEqual(validator.validate('jose'), false);
  });
});