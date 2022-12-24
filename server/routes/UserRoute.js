import { Router } from "express";
import authJWT from "../helpers/authJWT";
import IndexController from "../controller/IndexController";

const router = new Router()

router.get('/user/',IndexController.UserController.getAllUser)
router.get('/user/:id',authJWT.verify,IndexController.UserController.findUserById)
router.put('/user/:id',authJWT.verify,IndexController.UserController.updateUser)
router.delete('/user/:id',authJWT.verify,IndexController.UserController.deleteUser)
router.post('/signup',IndexController.UserController.createUser)
router.post('/signin', authJWT.authenticate,authJWT.login)
router.post("/refreshToken", authJWT.refreshToken);
router.delete("/logout", authJWT.verify,authJWT.logout);


export default router;