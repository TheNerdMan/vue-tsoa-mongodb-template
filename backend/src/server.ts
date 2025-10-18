import { app } from "./app";
import swaggerUi from 'swagger-ui-express';
import { SwaggerOptions, SwaggerUiOptions } from 'swagger-ui-express';

const port = process.env.PORT || 42001;

async function main() {
  var swaggerOptions: SwaggerOptions = {
    persistAuthorization: true,
  };
  var swaggerUiOptions: SwaggerUiOptions = {
    swaggerOptions: swaggerOptions,
    isExplorer: true,
  };

  var swaggerDocument = await import('../build/swagger.json');
  
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, swaggerUiOptions, swaggerOptions)
  );

  app.listen(port, (error: Error | undefined) =>
    error
      ? console.error(`Error starting server: ${error.message}`)
      : console.log(`Example app listening at http://localhost:${port}`)
  );
}
main();