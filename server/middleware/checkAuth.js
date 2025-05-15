import { getUser } from "../helpers/jwtHelper.js";

export function checkAuth(req, res, next) {
    const token = req.cookies?.userToken;
    // console.log('req.path', req.path)
    console.log('token', token);
    if (token) {
        const userData = getUser(token);
        if (!userData) {
            res.status(401).send({
                success: false,
                message: 'invalid or expired token'
            })
        } else {
            req.userData = userData;
            next();
        }
    } else {
            res.status(401).send({
                success: false,
                message: 'token not found'
            })
    }
}