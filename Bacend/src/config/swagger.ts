import swaggerJSDoc, { Options } from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API RESTful con Node, Express, TypeScript y MongoDB',
      version: '1.0.0',
      description: 'RUTAS DE LA API PARA EL SWAGGER (Node + Express + TS + MongoDB)',
    },
    servers: [
      {
        url: 'http://localhost:3000/api', 
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {               
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],             
      },
    ],

  },
  //aqui solo hace falta explicar que apis y rutas se llaman: se puede poner una ruta concreta o todas las rutas de una carpeta
  //apis: ['./src/routes/*.ts'],
  apis: [
    './src/routes/usuarioRoutes.ts',
    './src/routes/eventoRoutes.ts'
  ],
};

const swaggerSpec = swaggerJSDoc(options);


export default swaggerSpec;
