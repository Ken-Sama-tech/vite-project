export const slugify = (string, {
    casing = 'lower',
    character = '-'
} = {}) => {
    if (!string) return;

    switch (casing) {
        case "lower":
            string = string.toLowerCase();
            break;
        case "upper":
            string = string.toUpperCase();
            break;
        default:
            return string
    }
    return string.replace(/[^a-zA-Z0-9 ]/g, '').replace(/ /g, character);
}