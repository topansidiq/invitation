import express from "express";
import GuestController from "../pattern/controller/GuestController.js";

const router = express.Router();

router.get('/', GuestController.index);
router.get('/:id', GuestController.show);
router.post('/', GuestController.store);
router.put('/:id', GuestController.update);
router.delete('/:id', GuestController.destroy);
router.delete('/', GuestController.drop);

export default router;