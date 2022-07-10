import { Router} from 'express'
import ReportController from '../controllers/report.controller'


const router = Router()
const expenseController = new ReportController()


router.get('/:reportName',expenseController.getReport )
router.get('/',expenseController.getReportsList )


export default router