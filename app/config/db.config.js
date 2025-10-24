module.exports ={
HOST: "ep-morning-dawn-a8ns1tt0-pooler.eastus2.azure.neon.tech",
USER: "neondb_owner",
PASSWORD: "npg_xHUC7rTwcq4d",
DB: "neondb",
dialect: "postgres",
pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
