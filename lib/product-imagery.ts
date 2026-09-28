// Referências ilustrativas locais. Uma fotografia cadastrada sempre tem prioridade.
const illustrations: Record<string, string> = {
  "caixa mista (12 unidades)": "caixa-mista",
  "bolacha de coco com doce de leite": "coco-doce-leite",
  "bolacha de canela com aveia": "canela-aveia",
  "bolacha de limão siciliano": "limao",
  "bolacha de chocolate belga": "chocolate",
  "bolacha de manteiga clássica": "manteiga",
};
export function productImage(name: string, image?: string | null) {
  if (image) return image;
  const illustration = illustrations[name.trim().toLocaleLowerCase("pt-BR")];
  return illustration ? `/images/${illustration}.jpg` : null;
}
export function isIllustrativeImage(src?: string | null) {
  return (
    !!src &&
    Object.values(illustrations).some((name) => src === `/images/${name}.jpg`)
  );
}
