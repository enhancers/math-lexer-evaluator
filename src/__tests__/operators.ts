import {
  ADDITION,
  BRACKET_LEFT,
  BRACKET_RIGHT,
  DIVISION,
  MULTIPLICATION,
  SUBTRACTION,
} from '../operators';

describe('Operators', () => {
  it('addition operator must be of type Operator and equal to: +', () => {
    expect(ADDITION).toEqual('+');
  });

  it('subtraction operator must be equal to: -', () => {
    expect(SUBTRACTION).toEqual('-');
  });

  it('multiplication operator must be equal to: *', () => {
    expect(MULTIPLICATION).toEqual('*');
  });

  it('division operator must be equal to: /', () => {
    expect(DIVISION).toEqual('/');
  });

  it('left bracket operator must be equal to: (', () => {
    expect(BRACKET_LEFT).toEqual('(');
  });

  it('right bracket operator must be equal to: )', () => {
    expect(BRACKET_RIGHT).toEqual(')');
  });
});
