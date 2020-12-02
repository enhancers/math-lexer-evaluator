"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
it('Calculation 1', () => {
    const lexedExpression = index_1.lex('mainWashTime + #loadCapacityWash * 3 - 8', (variable) => {
        switch (variable) {
            case 'mainWashTime':
                return -1;
            case '#loadCapacityWash':
                return 2;
        }
        return NaN;
    });
    const result = index_1.evaluate(lexedExpression);
    expect(typeof result).toBe('number');
    expect(result).not.toBeNaN();
    expect(result).toBe(-3);
});
it('Calculation 2', () => {
    const lexedExpression2 = index_1.lex('(1 + 2) * (-3 - 4) + 5 * 6', () => 0);
    const result2 = index_1.evaluate(lexedExpression2);
    expect(typeof result2).toBe('number');
    expect(result2).not.toBeNaN();
    expect(result2).toBe(9);
});
it('Calculation 3', () => {
    const lexedExpression3 = index_1.lex('2 / 2', () => 0);
    const result3 = index_1.evaluate(lexedExpression3);
    expect(typeof result3).toBe('number');
    expect(result3).not.toBeNaN();
    expect(result3).toBe(1);
});
it('Calculation 4', () => {
    const lexedExpression = index_1.lex('a + 2 * 3 - 8', (variable) => {
        if (variable === 'a') {
            return -0.5;
        }
        return NaN;
    });
    const result = index_1.evaluate(lexedExpression);
    expect(typeof result).toBe('number');
    expect(result).not.toBeNaN();
    expect(result).toBe(-2.5);
});
it('Calculation 5', () => {
    const lexedExpression = index_1.lex('(rinseIterationTime+3)*(rinseIterations-1)+rinseIterationTime', (variable) => {
        switch (variable) {
            case 'rinseIterationTime':
                return 2;
            case 'rinseIterations':
                return 3;
        }
        return NaN;
    });
    const result = index_1.evaluate(lexedExpression);
    expect(typeof result).toBe('number');
    expect(result).not.toBeNaN();
    expect(result).toBe(12);
});
