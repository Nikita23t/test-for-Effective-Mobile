import Router from 'express'
import { AppealsControllers, } from '../controllers/appeals.controller';


const router = Router()
const appealsService = new AppealsControllers();

router.post("/", appealsService.createAppeal);
router.post("/work/:id", appealsService.setInProgress);
router.post("/complete/:id", appealsService.completeAppeal);
router.post("/cancel/:id", appealsService.cancelAppeals);
router.get("/", appealsService.getAppeals);
router.post("/cancel-in-progress", appealsService.cancelAllInProgress);

export default router;