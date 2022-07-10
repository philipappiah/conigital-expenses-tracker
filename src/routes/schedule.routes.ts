import { Router} from 'express'
import ScheduleController from '../controllers/schedule.controller'


const router = Router()
const scheduleController = new ScheduleController()

router.post('/',scheduleController.createSchedule )
router.get('/',scheduleController.getSchedule )



export default router