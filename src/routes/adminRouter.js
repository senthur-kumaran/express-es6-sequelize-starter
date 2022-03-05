import express from 'express';
import Auth from '../middleware/Auth';
import CanAccess from '../middleware/CanAccess';
import Constants from '../utils/constants';
import AdminController from '../controllers/AdminController';

const router = express.Router();

router.get('/users', Auth, CanAccess(Constants.PERMISSION_VIEW_ALL_USERS), AdminController.users);
router.get('/dashboard', Auth, CanAccess(Constants.PERMISSION_VIEW_ADMIN_DASHBOARD), AdminController.dashboard);

export default router;
