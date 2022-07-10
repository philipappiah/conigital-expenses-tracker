
import { Request, Response, NextFunction } from 'express'

import { CatchExpressError } from '../utils/errorHandlers';

const fs = require('fs')


class ScheduleController {

    reportsConfigFile = "src/config/reportsConfig.json"

    checkFileExist = (filePath:string, res:Response) => {

        if (!fs.existsSync(filePath)) {
            return res.status(404).end();
        }

    }

    createSchedule = CatchExpressError(async (req: Request, res: Response, next: NextFunction) => {


        const schedule = req.body.schedule
        if (!schedule) {
            return (res.status(422).send({
                status: 'fail',
                message: 'Validation Error. Missing required field `schedule`'

            }))
        }

        const filename = "src/config/reportsConfig.json"
        this.checkFileExist(filename, res)
        
        let content = JSON.parse(fs.readFileSync(filename, 'utf8'));


        if (!content.schedulesEnum.includes(schedule.toUpperCase())) {
            return (res.status(422).send({
                status: 'fail',
                message: 'Please provide an appropriate schedule: Available schedules are ` Minute, Hour, Day, Week, Month `'

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

    getSchedule = CatchExpressError(async (req: Request, res: Response, next: NextFunction) => {

        this.checkFileExist(this.reportsConfigFile, res)
        let content = JSON.parse(fs.readFileSync(this.reportsConfigFile, 'utf8'));
        let existingSchedule = content.schedulesEnum[content.selectedSchedule]
        res.status(200).send({
            schedule:existingSchedule
        })
        

    })

 


}

export default ScheduleController