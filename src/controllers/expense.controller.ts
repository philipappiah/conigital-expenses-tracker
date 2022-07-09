
import { Request, Response, NextFunction } from 'express'
import { ExpenseModel } from '../models/expenses.model'
import { CatchExpressError } from '../utils/errorHandlers';
import { ResponseHandlers } from '../utils/responseHandlers';
const fs = require('fs')
const path = require('path');

class ExpenseController {
 
    createExpense = CatchExpressError(async (req: Request, res: Response, next: NextFunction) => {
        
       
        
       // this.validateFields(req, res)
        const document = await ExpenseModel.create(req.body)

        res.status(201).send({
            message:'Expense successfully created',
            data:document
        })


    })


    getExpenses = CatchExpressError(async (req: Request, res: Response, next: NextFunction) => {

        // handle filtering, sorting, fieldLimiting and pagination based on the request

        const documents = new ResponseHandlers(ExpenseModel.find(), req.query).filter().sort().limitFields().paginate()
        const data = await documents.model



        res.status(200).send(data)

    })


    getExpense = CatchExpressError(async (req: Request, res: Response, next: NextFunction) => {

        const document = await ExpenseModel.findById(req.params.id)
        
        if (!document) {
            return (res.status(404).send({
                status: 'fail',
                message: `No document found with id: ${req.params.id}`
    
            }))
           
        }

        res.status(200).send({data:document})

    })


    updateExpense = CatchExpressError(async (req: Request, res: Response, next: NextFunction) => {

        const document = await ExpenseModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        
        if (!document) {
            return (res.status(404).send({
                status: 'fail',
                message: `No document found with id: ${req.params.id}`
    
            }))
           
        }

        res.status(204).send(document)

    })

    deleteExpense = CatchExpressError(async (req: Request, res: Response, next: NextFunction) => {


        const document = await ExpenseModel.findByIdAndDelete(req.params.id)

        if (!document) {
            return (res.status(404).send({
                status: 'fail',
                message: `No document found with id: ${req.params.id}`
    
            }))
           
        }

        res.status(204).send({})

    })


    getReport = CatchExpressError(async (req: Request, res: Response, next: NextFunction) => {
        const filename = `src/reports/${req.params.reportName}.csv`
       
            if (fs.existsSync(filename)) {
                res.sendFile(path.join(process.cwd(), `src/reports/${req.params.reportName}.csv`));
            }else{
                return (res.status(404).send({
                    status: 'fail',
                    message: `No report found with name: ${req.params.reportName}.csv`
        
                }))
            }
         

    })



   


}

export default ExpenseController