
require('dotenv').config();

const BASE_URL = process.env.BASE_URL || 'http://localhost'
const PORT = process.env.PORT || 4000

export const swaggerDocs = {
    definition: {
      openapi: "3.0.0",
     
      info: {
        title: "Conigital Open Api",
        version: "v1",
        
        description:
          "API endpoints for Conigital Expenses Calculator",
        license: {
          name: "MIT",
          url: "https://spdx.org/licenses/MIT.html",
        },
        
      },
      servers: [
        {
          url: `${BASE_URL}:${PORT}/api/v1`,
        },
      ],
      
    },
    apis: ["./apis.yaml"]
    
  };