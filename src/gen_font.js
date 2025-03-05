

function checkFormat(str) {
    if (typeof str !== 'string') {
        throw new Error('str must be a string');
    }
    return str;
}
export const genFont = (table, schema) => {
    const { pgTable, serial, text } = schema;
    return pgTable(table, {
        id: serial("id").primaryKey(),
        username: text("username").notNull(),
        avatar: text("avatar"),
    });
}