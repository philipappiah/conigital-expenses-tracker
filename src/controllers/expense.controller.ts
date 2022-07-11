
import { Request, Response, NextFunction } from 'express'
import { ExpenseModel } from '../models/expense.model'
import { CatchExpressError } from '../utils/errorHandlers';
import { ResponseHandlers } from '../utils/responseHandler';


class ExpenseController {

    createExpense = CatchExpressError(async (req: Request, res: Response, next: NextFunction) => {
        
        const document = await ExpenseModel.create(req.body)

        res.status(201).send(document)


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
                message: 'No document found!'

            }))

        }

        res.status(200).send(document)

    })


    updateExpense = CatchExpressError(async (req: Request, res: Response, next: NextFunction) => {

        const document = await ExpenseModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!document) {
            return (res.status(404).send({
                status: 'fail',
                message: 'No document found'

            }))

        }

        res.status(200).send(document)

    })


    deleteExpense = CatchExpressError(async (req: Request, res: Response, next: NextFunction) => {

        const document = await ExpenseModel.findByIdAndDelete(req.params.id)

        if (!document) {
            return (res.status(404).send({
                status: 'fail',
                message: 'No document found!'

            }))

        }

        res.status(204).send(null)

    })




}

export default ExpenseController