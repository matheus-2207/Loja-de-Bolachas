import { Icon } from "@/components/icon";
export function Quantity({
  value,
  max,
  min = 0,
  name,
  onChange,
}: {
  value: number;
  max: number;
  min?: number;
  name: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="quantity" role="group" aria-label={`Quantidade de ${name}`}>
      <button
        type="button"
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
        aria-label={`Diminuir ${name}`}
      >
        <Icon name="minus" width="16" height="16" />
      </button>
      <output aria-live="polite" aria-label={`Quantidade de ${name}`}>
        {value}
      </output>
      <button
        type="button"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
        aria-label={`Aumentar ${name}`}
      >
        <Icon name="plus" width="16" height="16" />
      </button>
    </div>
  );
}
