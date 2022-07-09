import {Router} from 'express'
import ExpenseController from '../controllers/expense.controller'


const router = Router()
const expenseController = new ExpenseController()

router.post('/',expenseController.createExpense)
router.get('/', expenseController.getExpenses)
router.get('/:id', expenseController.getExpense)
router.patch('/:id', expenseController.updateExpense)
router.delete('/:id', expenseController.deleteExpense)
router.get('/reports/:reportName',expenseController.getReport )
export default router