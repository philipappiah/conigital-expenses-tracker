
import { Request, Response, NextFunction } from 'express'

import { CatchExpressError } from '../utils/errorHandlers';

const fs = require('fs')
const path = require('path');


class ReportController {



    reportsPath = path.join(process.cwd(), `src/reports`)

    constructor() {
        if (!fs.existsSync(this.reportsPath)) {
            fs.mkdirSync(this.reportsPath) // create reports dir if it does not exist
        }
    }



    getReportsList = CatchExpressError(async (req: Request, res: Response, next: NextFunction) => {

        if (fs.statSync(this.reportsPath).isDirectory()) {
            const reportsInDir = fs.readdirSync(this.reportsPath);
            //send the list of files in the reports directory
            return res.status(200).send(reportsInDir);
        }

    })


    getReport = CatchExpressError(async (req: Request, res: Response, next: NextFunction) => {


        const filename = `${this.reportsPath}/${req.params.reportName}`

        if (fs.existsSync(filename)) {
            res.sendFile(filename);
        } else {
            return (res.status(404).send({
                status: 'fail',
                message: 'No file found'

            }))
        }


    })


}

export default ReportController