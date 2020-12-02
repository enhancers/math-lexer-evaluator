"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const operators_1 = require("../operators");
describe('Operators', () => {
    it('addition operator must be of type Operator and equal to: +', () => {
        expect(operators_1.ADDITION).toEqual('+');
    });
    it('subtraction operator must be equal to: -', () => {
        expect(operators_1.SUBTRACTION).toEqual('-');
    });
    it('multiplication operator must be equal to: *', () => {
        expect(operators_1.MULTIPLICATION).toEqual('*');
    });
    it('division operator must be equal to: /', () => {
        expect(operators_1.DIVISION).toEqual('/');
    });
    it('left bracket operator must be equal to: (', () => {
        expect(operators_1.BRACKET_LEFT).toEqual('(');
    });
    it('right bracket operator must be equal to: )', () => {
        expect(operators_1.BRACKET_RIGHT).toEqual(')');
    });
});
