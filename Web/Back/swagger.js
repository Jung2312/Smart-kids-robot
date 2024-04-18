const swaggerUi = require("swagger-ui-express");
const swaggereJsdoc = require("swagger-jsdoc");

const options = {
  swaggerDefinition: {
    info: {
      title: "Public Data API",
      version: "1.0.0",
      description: "API",
    },
    host: "ip:8080",
    basePath: "/",
  },
  apis: ["./swagger/*.js"],
  // apis: ['./src/swagger/*.js']
};

const specs = swaggereJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};
