

import { CSV } from './csvWriter';
import { ExpenseModel } from '../models/expenses.model'
const cron = require('node-cron');
const schedules = require('../config/reportsConfig.json')



export const scheduleReporting = () =>{

    cron.schedule(schedules.period, async () => {
        console.log(`generating reports every ${schedules.timeLabel}`);
        const csv = new CSV(ExpenseModel)
        await csv.generateAllCSV()  // create report 1
        await csv.generateCategoryCSV() // create report 2

        //clean database after report generation
        // try {
        //     await ExpenseModel.deleteMany();
           
        //     console.log('Data successfully deleted!');
        //   } catch (err) {
        //     console.log(err);
        //   }
      });
}