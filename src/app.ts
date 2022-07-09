import express, {Response, Request} from 'express'
import expenseRoutes from './routes/expense.routes'
import reportsRouters from './routes/report.routes'
import {swaggerDocs} from './swaggerdocs'
const swaggerUI = require('swagger-ui-express')
const swaggerJsdoc = require("swagger-jsdoc")


const app = express()

app.use(express.json())
const specs = swaggerJsdoc(swaggerDocs);

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs))


app.use('/api/v1/expenses', expenseRoutes)  
app.use('/api/v1/reports', reportsRouters)

app.get("/", (req:Request, res:Response) => res.json({message: `Conigital Expenses Tracker API V1. Visit 'http://localhost:4000/api-docs' to view open api docs and endpoints`}));

export default app;


