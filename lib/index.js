"use strict";
// @ts-nocheck
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluate = exports.lex = void 0;
const operators_1 = require("./operators");
const Rules = {
    [operators_1.ADDITION]: {
        precedence: 1,
        associativity: operators_1.ASSOCIATIVITY_LEFT,
    },
    [operators_1.SUBTRACTION]: {
        precedence: 1,
        associativity: operators_1.ASSOCIATIVITY_LEFT,
    },
    [operators_1.MULTIPLICATION]: {
        precedence: 2,
        associativity: operators_1.ASSOCIATIVITY_LEFT,
    },
    [operators_1.DIVISION]: {
        precedence: 2,
        associativity: operators_1.ASSOCIATIVITY_LEFT,
    },
    [operators_1.BRACKET_LEFT]: {
        precedence: 1,
        associativity: operators_1.ASSOCIATIVITY_LEFT,
    },
    [operators_1.BRACKET_RIGHT]: {
        precedence: 1,
        associativity: operators_1.ASSOCIATIVITY_LEFT,
    },
};
function removeSpaces(input) {
    return input.replace(/\s/g, '');
}
function isNumber(input) {
    return Number.isInteger(Number.parseInt(input));
}
function isNaN(input) {
    return Number.isNaN(input);
}
function peek(index, input) {
    return input[index + 1];
}
function lex(input, cb) {
    input = removeSpaces(input);
    const variables = input.match(/#?([A-Za-z]?)+[0-9]?[a-zA-Z]+[0-9]?/g);
    let operators = [];
    let tokens = [];
    let numberBuffer = [];
    let index = 0;
    if (variables && variables.length) {
        for (let i = 0; i < variables.length; i++) {
            const variable = variables[i];
            const number = cb(variable);
            if (!isNumber(number) || isNaN(number)) {
                throw new RangeError('Value is NaN');
            }
            input = input.replace(variable, number);
        }
    }
    while (index < input.length) {
        const token = input[index];
        console.log('[token]', token);
        // there is a minus sign at the first index
        // or the token is a minus sign and the previous token i an operator or a left bracket
        if (token === operators_1.SUBTRACTION &&
            (index === 0 ||
                [
                    operators_1.ADDITION,
                    operators_1.SUBTRACTION,
                    operators_1.MULTIPLICATION,
                    operators_1.DIVISION,
                    operators_1.BRACKET_LEFT,
                ].includes(input[index - 1]))) {
            numberBuffer = [token];
            index += 1;
            continue;
        }
        // If the token is a number
        if (isNumber(token) || token === '.') {
            numberBuffer.push(token);
            const peeked = peek(index, input);
            if (!isNumber(peeked) && peeked !== '.') {
                tokens.push(Number.parseFloat(numberBuffer.join('')));
                console.log('push number to tokens', numberBuffer, tokens);
                numberBuffer = [];
            }
        }
        // if the token is an operator push it onto the operators stack
        if (Object.keys(Rules).includes(token) &&
            token !== operators_1.BRACKET_LEFT &&
            token !== operators_1.BRACKET_RIGHT) {
            while (
            // there is an operator at the top of the operator stack
            operators.length &&
                // the operator at the top of the operator stack has greater precedence
                (Rules[operators[operators.length - 1]].precedence >
                    Rules[token].precedence ||
                    // the operator at the top of the operator stack has equal precedence and the token is left associative
                    (Rules[operators[operators.length - 1]].precedence ===
                        Rules[token].precedence &&
                        Rules[token].associativity === 'left')) &&
                // the operator at the top of the operator stack is not a left parenthesis
                operators[operators.length - 1] !== operators_1.BRACKET_LEFT) {
                tokens.push(operators.pop());
            }
            operators.push(token);
        }
        // if the token is a left parenthesis
        if (token === operators_1.BRACKET_LEFT) {
            // push into operators stack
            operators.push(token);
        }
        // if the token is a right parenthesis
        if (token === operators_1.BRACKET_RIGHT) {
            while (operators.length) {
                const operator = operators.pop();
                // if the stack runs out without finding a left parenthesis, then there are mismatched parentheses.
                if (operators.length === 0 && operator !== operators_1.BRACKET_LEFT) {
                    throw new SyntaxError('Mismatched parentheses');
                }
                if (operator === operators_1.BRACKET_LEFT) {
                    break;
                }
                tokens.push(operator);
            }
        }
        index += 1;
    }
    // if operator stack not null, pop everything to output queue
    while (operators.length) {
        const operator = operators.pop();
        // if the operator token on the top of the stack is a parenthesis, then there are mismatched parentheses.
        if (!!operator && [operators_1.BRACKET_LEFT, operators_1.BRACKET_RIGHT].includes(operator)) {
            throw new SyntaxError('Mismatched parentheses');
        }
        // pop the operator from the operator stack onto the output queue.
        tokens.push(operator);
    }
    return tokens;
}
exports.lex = lex;
function evaluate(tokens) {
    let stack = [];
    for (let i = 0; i < tokens.length; i++) {
        if (!isNaN(tokens[i]) && isFinite(tokens[i])) {
            stack.push(tokens[i]);
        }
        else {
            let a = stack.pop();
            let b = stack.pop();
            switch (tokens[i]) {
                case operators_1.ADDITION:
                    stack.push(parseFloat(a) + parseFloat(b));
                    break;
                case operators_1.SUBTRACTION:
                    stack.push(parseFloat(b) - parseFloat(a));
                    break;
                case operators_1.MULTIPLICATION:
                    stack.push(parseFloat(a) * parseFloat(b));
                    break;
                case operators_1.DIVISION:
                    stack.push(parseFloat(b) / parseFloat(a));
                    break;
            }
        }
    }
    console.log('stack', stack);
    if (stack.length > 1 || typeof stack[0] !== 'number') {
        throw new Error('Parsing error!');
    }
    else {
        return stack[0];
    }
}
exports.evaluate = evaluate;
