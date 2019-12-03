# Promise原理讲解 / Promise A+ 规范

如果没有明确的指定类型，那么 TypeScript 会依照类型推论（Type Inference）的规则推断出一个类型。

举个🌰, 被推论为了 string

```typescript
let numSting = "seven";
numSting = 7;

// index.ts(2,1): error TS2322: Type 'number' is not assignable to type 'string'.
```

如果定义的时候没有赋值，不管之后有没有赋值，都会被推断成 `any` 类型而完全不被类型检查

```typescript
let num;
num = "seven";
num = 7;
```
