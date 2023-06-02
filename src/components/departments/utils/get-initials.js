export const getInitials = (name = '') =>
    name
        .replace(/\s+/, ' ')
        .split(' ')
        .slice(0, 1)
        .map((v) => v && v[0].toUpperCase())
        .join('');
