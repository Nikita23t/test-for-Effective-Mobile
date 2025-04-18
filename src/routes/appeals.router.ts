import Router from "express";
import { AppealsControllers } from "../controllers/appeals.controller";
import { validate } from "../middlewares/validate";
import { AppealSchemas } from "../schemas/appeals.schema";

const router = Router();
const appealsController = new AppealsControllers();

router.post("/", validate(AppealSchemas.create), appealsController.createAppeal);
router.post("/work/:id", validate(AppealSchemas.idParam, "params"), appealsController.setInProgress);
router.post("/complete/:id",
    validate(AppealSchemas.idParam, "params"),
    validate(AppealSchemas.complete),
    appealsController.completeAppeal
);
router.post("/cancel/:id",
    validate(AppealSchemas.idParam, "params"),
    validate(AppealSchemas.cancel),
    appealsController.cancelAppeals
);
router.get("/", validate(AppealSchemas.query, "query"), appealsController.getAppeals);
router.post("/cancel-in-progress", appealsController.cancelAllInProgress);

export default router;
