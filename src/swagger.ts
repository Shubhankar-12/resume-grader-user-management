const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Api Docs",
      version: "1.0.0",
      description: "Your API description",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
        adminAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          name: "Admin-Token",
        },
        ownerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          name: "Owner-Token",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            isSuccess: {
              type: "boolean",
              description: "Indicates whether the request was successful.",
            },
            meta: {
              type: "object",
              properties: {
                total_documents: {
                  type: "integer",
                  description:
                    "Total number of documents included in the response.",
                },
                message: {
                  type: "string",
                  description:
                    "A message describing the result of the request.",
                },
                error: {
                  type: "string",
                  description:
                    "Any error message associated with the request, if applicable.",
                },
                data_type: {
                  type: "string",
                  description: "The data type of the response.",
                },
              },
            },
            statusCode: {
              type: "integer",
              description: "The HTTP status code of the response.",
            },
            errors: {
              type: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                      description: "The name of the error.",
                    },
                    code: {
                      type: "string",
                      description: "The error code.",
                    },
                    message: {
                      type: "string",
                      description: "A message describing the error.",
                    },
                    field: {
                      type: "string",
                      description:
                        "The field associated with the error, if applicable.",
                    },
                  },
                },
              },
              description:
                "An array of errors that occurred during the request, if applicable.",
            },
            body: {
              type: ["null", "object"],
              description: "The body of the response, if applicable.",
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
      {
        adminAuth: [],
      },
      {
        ownerAuth: [],
      },
    ],
    servers: [
      {
        url: "http://localhost:3010/api/v1/", // URL for your local server
        description: "Local server",
      },
      // {
      //   url: "https://beta.service.profoundproperties.com/employee/api/v1/", // URL for your local server
      //   description: "Live server",
      // },

      // Add more servers as needed
    ],
  },
  apis: [
    "./src/use_cases/*/*/documentation.ts",
    "./src/use_cases/client/*/*/documentation.ts",
  ], // Path to your API routes
};

export default swaggerOptions;
