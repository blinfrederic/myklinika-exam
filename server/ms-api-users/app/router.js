import Router from 'express';
import * as controllers from './controllers.js';
import * as loginControllers from './loginControllers.js';
import authMiddleware from './authMiddleware.js';

const router = Router()



router.use(authMiddleware);
router.get('/verifyemail/:email/:token', controllers.verifyEmail);
router.post('/users', controllers.createUser);
router.get('/users', controllers.getAllUsers);
router.get('/users/:id', controllers.getUserById);
router.patch('/users/:id', controllers.updateUserById);
router.put('/users/:id', controllers.updatePasswordUserById);
router.delete('/users/:id', controllers.deleteUserById);
router.post('/users/login', loginControllers.loginUser);
router.post('/resetPassword/', controllers.resetPassword);
router.post('/resetFormPassword/', controllers.resetFormPassword);


export default router;