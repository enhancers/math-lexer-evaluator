import {lex, evaluate} from '../';

it('Calculation 1', () => {
  const lexedExpression = lex(
    'mainWashTime + #loadCapacityWash * 3 - 8',
    (variable) => {
      switch (variable) {
        case 'mainWashTime':
          return -1;
        case '#loadCapacityWash':
          return 2;
      }

      return NaN;
    },
  );

  const result = evaluate(lexedExpression);

  expect(typeof result).toBe('number');
  expect(result).not.toBeNaN();
  expect(result).toBe(-3);
});

it('Calculation 2', () => {
  const lexedExpression2 = lex('(1 + 2) * (-3 - 4) + 5 * 6', () => 0);
  const result2 = evaluate(lexedExpression2);

  expect(typeof result2).toBe('number');
  expect(result2).not.toBeNaN();
  expect(result2).toBe(9);
});

it('Calculation 3', () => {
  const lexedExpression3 = lex('2 / 2', () => 0);
  const result3 = evaluate(lexedExpression3);

  expect(typeof result3).toBe('number');
  expect(result3).not.toBeNaN();
  expect(result3).toBe(1);
});

it('Calculation 4', () => {
  const lexedExpression = lex('a + 2 * 3 - 8', (variable) => {
    if (variable === 'a') {
      return -0.5;
    }

    return NaN;
  });

  const result = evaluate(lexedExpression);

  expect(typeof result).toBe('number');
  expect(result).not.toBeNaN();
  expect(result).toBe(-2.5);
});

it('Calculation 5', () => {
  const lexedExpression = lex(
    '(rinseIterationTime+3)*(haier_SoakPrewashSelection-1)+rinseIterationTime',
    (variable) => {
      switch (variable) {
        case 'rinseIterationTime':
          return 2;
        case 'haier_SoakPrewashSelection':
          return 3;
      }

      return NaN;
    },
  );

  const result = evaluate(lexedExpression);

  expect(typeof result).toBe('number');
  expect(result).not.toBeNaN();
  expect(result).toBe(12);
});

it('Calculation 6', () => {
  const result = evaluate([0, 0, "+", 0, "+", 0, "+", 0, "+"]);

  expect(typeof result).toBe('number');
  expect(result).not.toBeNaN();
  expect(result).toBe(0);
});
