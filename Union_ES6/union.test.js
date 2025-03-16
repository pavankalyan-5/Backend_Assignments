import union from "./union";

describe("union function", () => {
    test("should return the union of two arrays with unique primitives", () => {
        expect(union([1, 2, 3], [2, 3, 4])).toEqual([1, 2, 3, 4]);
    });

    test("should return the union while preserving order", () => {
        expect(union(["a", "b", "c"], ["c", "d", "e"])).toEqual(["a", "b", "c", "d", "e"]);
    });

    test("should correctly handle objects and remove duplicates", () => {
        const obj1 = { a: 1, b: 2 };
        const obj2 = { a: 1, b: 2 };
        const obj3 = { a: 3 };

        expect(union([obj1], [obj2, obj3])).toEqual([{ a: 1, b: 2 }, { a: 3 }]);
    });

    test("should correctly handle arrays and remove duplicates", () => {
        expect(union([[1, 2], [3, 4]], [[1, 2], [5, 6]])).toEqual([[1, 2], [3, 4], [5, 6]]);
    });

    test("should handle deeply nested objects and remove duplicates", () => {
        const obj1 = { a: { b: { c: 3 } } };
        const obj2 = { a: { b: { c: 3 } } };
        const obj3 = { a: { b: { d: 4 } } };

        expect(union([obj1], [obj2, obj3])).toEqual([{ a: { b: { c: 3 } } }, { a: { b: { d: 4 } } }]);
    });

    test("should return an empty array if both inputs are empty", () => {
        expect(union([], [])).toEqual([]);
    });

    test("should return the first array if the second is empty", () => {
        expect(union([1, 2, 3], [])).toEqual([1, 2, 3]);
    });

    test("should return the second array if the first is empty", () => {
        expect(union([], [1, 2, 3])).toEqual([1, 2, 3]);
    });

    test("should throw an error if the arguments are not arrays", () => {
        expect(() => union(null, [1, 2, 3])).toThrow(TypeError);
        expect(() => union(undefined, [1, 2, 3])).toThrow(TypeError);
        expect(() => union(123, [1, 2, 3])).toThrow(TypeError);
        expect(() => union("string", [1, 2, 3])).toThrow(TypeError);
        expect(() => union({}, [1, 2, 3])).toThrow(TypeError);
    });

    test("should throw an error if there are not exactly two arguments", () => {
        expect(() => union([1, 2, 3])).toThrow(TypeError);
        expect(() => union()).toThrow(TypeError);
        expect(() => union([1, 2], [3, 4], [5, 6])).toThrow(TypeError);
    });
});
