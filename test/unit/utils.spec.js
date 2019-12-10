// karma
const _ = require('./src/utils/Utils');

describe('单元测试', function () {
    // 每个it表示一个测试用例
    it('基础单元测试', function () {
        expect(first([1, 2, 3])).toBe(1);
        expect(last([1, 2, 3])).toBe(3);
        expect(first()).toBe(null);
        expect(last()).toBe(null);
    })
})