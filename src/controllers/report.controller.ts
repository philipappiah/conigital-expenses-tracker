
import { Request, Response, NextFunction } from 'express'
import { ExpenseModel } from '../models/expense.model'
import { CatchExpressError } from '../utils/errorHandlers';
import { ResponseHandlers } from '../utils/responseHandler';
const fs = require('fs')
const path = require('path');

class ReportController {

    createReportSchedule = CatchExpressError(async (req: Request, res: Response, next: NextFunction) => {


        const schedule = req.body.schedule
        if (!schedule) {
            return (res.status(404).send({
                status: 'fail',
                message: 'missing required field `schedule`'

            }))
        }

        const filename = "src/config/reportsConfig.json"
        let content = JSON.parse(fs.readFileSync(filename, 'utf8'));

        if (!content.schedulesEnum.includes(schedule.toUpperCase())) {
            return (res.status(404).send({
                status: 'fail',
                message: 'Please provide an appropriate schedule: Accepted schedules are ` Minute, Hour, Day, Week, Month `'

            }))

        }
        content.selectedSchedule = content.schedulesObject[schedule.toUpperCase()]

        //write file
        fs.writeFileSync(filename, JSON.stringify(content));
        res.status(201).send({
            status: 'success',
            message: `Report schedule time successfully set to 1 ${schedule}. You can view the reports after every 1 ${schedule} `,
        })



    })

    getReportsList = CatchExpressError(async (req: Request, res: Response, next: NextFunction) => {


        const reportsPath = path.join(process.cwd(), `src/reports`)
        console.log(reportsPath)

        if (!fs.existsSync(reportsPath)) {
            return res.status(404).end();
        }

        if (fs.statSync(reportsPath).isDirectory()) {
            const reportsInDir = fs.readdirSync(reportsPath);
            //send the list of files in the reports directory
            return res.send(reportsInDir);
        }




    })


    getReport = CatchExpressError(async (req: Request, res: Response, next: NextFunction) => {
        const filename = `src/reports/${req.params.reportName}`

        if (fs.existsSync(filename)) {
            res.sendFile(path.join(process.cwd(), `src/reports/${req.params.reportName}`));
        } else {
            return (res.status(404).send({
                status: 'fail',
                message: `No file found with name: ${req.params.reportName}`

            }))
        }


    })


}

export default ReportController