type PluralForms = [string, string, string];

export function pluralize(count: number, forms: PluralForms): string {
    const abs = Math.abs(count);

    const lastTwo = abs % 100;
    if (lastTwo >= 11 && lastTwo <= 19) {
        return forms[2];
    }

    const last = abs % 10;
    if (last === 1) return forms[0];
    if (last >= 2 && last <= 4) return forms[1];

    return forms[2];
}
