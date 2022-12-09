export const EnvConfiguration = () =>({
    environment: process.env.NODE_ENV || 'dev',
    mongodb_con: process.env.MONGODB_CON,
    port: process.env.PORT || 3000,
    defaultLimit: process.env.DEFAULT_LIMIT || 7
})