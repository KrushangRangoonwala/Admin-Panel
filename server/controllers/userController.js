import { setUser } from '../helpers/jwtHelper.js';
import User from '../models/userSchema.js'

export async function handleLogin(req, res) {
    console.log("req.body ", req.body);
    const { name, password } = req.body;
    let user;

    try {
        user = await User.findOne({ name, password });
        console.log('user DB ', user)
    } catch (error) {
        console.log('User.findOne error', error);
    }

    if (user) {
        // console.log('name', name);
        const token = setUser({ name: user.name, id: user._id });
        console.log('token', token)
        res.cookie('userToken', token);  // i set cookie using this, i cannot find  this cookie in client device
        res.status(200).send({
            success: true,
            message: 'Logged in successfully',
        });
    } else {
        res.status(404).send({
            success: false,
            message: 'Username or Password is Invalide.',
        });
    }

}

