const assert = require('assert');

const validators = require('../validators')

describe('Validators', () => {
  
  it('should find a Country', () => {
    var validator = new validators.Country('pt-br');
    assert.strictEqual(validator.validate('brasil'), true);
  });

  it('should not find a Color', () => {
    var validator = new validators.Color('pt-br');
    assert.strictEqual(validator.validate('jose'), false);
  });
});