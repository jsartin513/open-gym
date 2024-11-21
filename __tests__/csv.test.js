const assert = require('assert');
import { parseCSV } from '../utils/csv.js';

test('valid CSV input', () => {
    const input = 'name,age\nAlice,30\nBob,25';
    const expected = [{ name: 'Alice', age: '30' }, { name: 'Bob', age: '25' }];
    assert.deepStrictEqual(parseCSV(input), expected);
});

test('empty CSV input', () => {
    const input = '';
    const expected = [];
    assert.deepStrictEqual(parseCSV(input), expected);
});