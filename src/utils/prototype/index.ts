declare global {
  interface Console {
    json(input: any, fn?: any, format?: string | number | undefined): void;
    line(): void;
  }
  interface Window {
    fastLoader(input: string): void;
  }
}

const circularStructure = () => {
  const seen = new WeakSet();
  return (key: any, value: any) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return `[circular structure]`;
      }
      seen.add(value);
    }
    if (typeof value === "function") {
      return `[function]`;
    }
    return value;
  };
};

// prettier-ignore
console.json = function (input: any, fn: any = undefined, format: string | number | undefined = 2): void {
  try {
    // fn = fn || circularStructure();
    const json_t = JSON.stringify(input, fn, format);
    console.log(json_t);
  } catch (e: any) {
    console.error(`console.json(input: any): ${e.message}`);
  }
};

// prettier-ignore
console.line = function (): void {
  const line = ' ----  ----  ----  ----  ----  ----  ----  ----  ---- ';
  console.log(line);
};

export { };
