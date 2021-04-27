import Index from "../../src/index";

describe('Hello World', () => {
    it ('expected hello world', () => {
        expect('Hello world').toMatch(new Index().toString())
    })
    it ('expected sum', () => {
        expect(10).toEqual(new Index().sum(5,5))
    })
})
