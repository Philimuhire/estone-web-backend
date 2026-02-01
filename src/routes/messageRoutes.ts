import { Router } from 'express';
import {
  getMessages,
  getMessage,
  updateMessageStatus,
  deleteMessage,
} from '../controllers/messageController';
import { protect } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { idParamValidator, messageStatusValidator } from '../utils/validators';

const router = Router();

// All routes are protected
router.use(protect);

router.get('/', getMessages);
router.get('/:id', idParamValidator, validate, getMessage);
router.patch('/:id', idParamValidator, messageStatusValidator, validate, updateMessageStatus);
router.delete('/:id', idParamValidator, validate, deleteMessage);

export default router;
