import {it,expect,describe} from 'vitest';
import { formatMoney } from './money';

describe('formatMoney',()=>{
   it('format 1999 cents as $19.99',()=>{
expect(formatMoney(1999)).toBe('$19.99')
});

it('format 1010 cents as $10.10',()=>{
expect(formatMoney(1010)).toBe('$10.10')
}); 
});
