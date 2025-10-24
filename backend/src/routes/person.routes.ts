import { Router } from 'express';
import { PersonController } from '../controllers/person.controller';

const router = Router();

router.get('/', PersonController.getAll);
router.get('/:id', PersonController.getById);
router.post('/', PersonController.create);
router.put('/:id', PersonController.update);
router.delete('/:id', PersonController.delete);

export default router;
