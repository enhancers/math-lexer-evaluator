"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
describe('Lexer', () => {
    it('must throw a mismatched parentheses error if a left bracket is not matched with a right bracket', () => {
        expect(() => {
            index_1.lex('(1 + 2', () => {
                return 0;
            });
        }).toThrow('Mismatched parentheses');
    });
    it('must throw a mismatched parentheses error if a left bracket is not matched with a left bracket', () => {
        expect(() => {
            index_1.lex('(1 + 2) + 3)', () => {
                return 0;
            });
        }).toThrow('Mismatched parentheses');
    });
});
