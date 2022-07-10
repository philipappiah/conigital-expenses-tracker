
import { Request, Response, NextFunction } from 'express'

import { CatchExpressError } from '../utils/errorHandlers';

const fs = require('fs')
const path = require('path');


class ReportController {

    reportsConfigFile = "src/config/reportsConfig.json"

    checkFileExist = (filePath:string, res:Response) => {

        if (!fs.existsSync(filePath)) {
            return res.status(404).end();
        }

    }

  

    getReportsList = CatchExpressError(async (req: Request, res: Response, next: NextFunction) => {


        const reportsPath = path.join(process.cwd(), `src/reports`)
       
        this.checkFileExist(reportsPath, res);

        if (fs.statSync(reportsPath).isDirectory()) {
            const reportsInDir = fs.readdirSync(reportsPath);
            //send the list of files in the reports directory
            return res.status(200).send(reportsInDir);
        }




    })


    getReport = CatchExpressError(async (req: Request, res: Response, next: NextFunction) => {
        const filename = `src/reports/${req.params.reportName}`

        if (fs.existsSync(filename)) {
            res.sendFile(path.join(process.cwd(), `src/reports/${req.params.reportName}`));
        } else {
            return (res.status(404).send({
                status: 'fail',
                message: 'No file found'

            }))
        }


    })


}

export default ReportController