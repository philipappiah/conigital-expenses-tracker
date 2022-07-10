

import { CSV } from './csvWriter';
import { ExpenseModel } from '../models/expense.model'
const cron = require('node-cron');
const schedulesConfig = require('../config/reportsConfig.json')




export const scheduleReporting = () =>{

    cron.schedule(schedulesConfig.schedules[schedulesConfig.selectedSchedule] || "0 0 0 1 * *" , async () => {
        // if there's an error getting the schedule, the default schedule should be 1 month
        console.log("generating reports per schedule");

        const checkData = await ExpenseModel.find()
        if(checkData.length){
        // only create the reports if data exist in the database
        const csv = new CSV(ExpenseModel)
      
        await csv.generateAllCSV()  // create report 1
        await csv.generateCategoryCSV() // create report 2


       // clean database after report generation
        try {
            await ExpenseModel.deleteMany();
       
            console.log('Database cleared after report generation');
        } catch (err) {
         console.log(err);
         }
        }
      });
    
}