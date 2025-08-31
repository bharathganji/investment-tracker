"use client";

interface ButtonGroupProps<T extends string> {
  options: { value: T; label: string; className?: string }[];
  selectedValue: T;
  onSelect: (value: T) => void;
  className?: string;
}

export function ButtonGroup<T extends string>({
  options,
  selectedValue,
  onSelect,
  className = ""
}: ButtonGroupProps<T>) {
  return (
    <div className={`flex space-x-2 ${className}`}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`flex-1 rounded-md px-4 py-2 transition-colors ${
            selectedValue === option.value
              ? option.className ?? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-accent"
          }`}
          onClick={() => onSelect(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}