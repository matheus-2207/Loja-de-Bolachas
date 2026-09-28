const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const ts = require("typescript");
function load(file) {
  const code = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;
  const module = { exports: {} };
  new Function("require", "module", "exports", code)(
    (name) => (name === "@/lib/store" ? load("lib/store.ts") : require(name)),
    module,
    module.exports,
  );
  return module.exports;
}
const { validateOrderInput, validateOrderPrices } = load(
  "lib/order-validation.ts",
);
const valid = () => ({
  nomeCliente: "Cliente de teste",
  emailCliente: "teste@example.com",
  telefone: "41999999999",
  cep: "80000-000",
  logradouro: "Rua de teste",
  numero: "1",
  bairro: "Centro",
  itens: [{ produtoId: "sample", quantidade: 2, preco: 19.9 }],
  frete: 8,
  total: 47.8,
});
const products = [
  {
    id: "sample",
    nome: "Produto de teste",
    preco: 19.9,
    estoque: 3,
    ativo: true,
  },
];
test("pedido válido usa valores canônicos em centavos", () => {
  const input = valid();
  assert.doesNotThrow(() => validateOrderInput(input));
  assert.deepEqual(validateOrderPrices(input, products), {
    total: 47.8,
    frete: 8,
  });
});
test("quantidades inválidas não chegam à transação", () => {
  for (const quantidade of [0, -1, 0.5, NaN, Infinity]) {
    const input = valid();
    input.itens[0].quantidade = quantidade;
    assert.throws(() => validateOrderInput(input));
  }
});
test("itens duplicados são rejeitados", () => {
  const input = valid();
  input.itens.push(input.itens[0]);
  assert.throws(() => validateOrderInput(input), /repetidos/);
});
test("estoque alterado não gera pedido", () =>
  assert.throws(
    () => validateOrderPrices(valid(), [{ ...products[0], estoque: 1 }]),
    /estoque/,
  ));
test("preço antigo no carrinho exige revisão", () =>
  assert.throws(
    () => validateOrderPrices(valid(), [{ ...products[0], preco: 22.9 }]),
    /preço/,
  ));
test("produto removido ou inativo é rejeitado", () => {
  assert.throws(() => validateOrderPrices(valid(), []), /disponível/);
  assert.throws(
    () => validateOrderPrices(valid(), [{ ...products[0], ativo: false }]),
    /disponível/,
  );
});
test("total e frete adulterados são rejeitados", () => {
  assert.throws(
    () => validateOrderPrices({ ...valid(), total: 1 }, products),
    /valores/,
  );
  assert.throws(
    () => validateOrderPrices({ ...valid(), frete: 0 }, products),
    /valores/,
  );
  assert.throws(
    () => validateOrderPrices({ ...valid(), total: NaN }, products),
    /valores/,
  );
});
test("CEP e campos obrigatórios inválidos são rejeitados", () => {
  for (const change of [
    { cep: "123" },
    { emailCliente: "incorreto" },
    { nomeCliente: " " },
    { telefone: "12" },
  ])
    assert.throws(() => validateOrderInput({ ...valid(), ...change }));
});
