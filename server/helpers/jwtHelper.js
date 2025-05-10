import jwt from 'jsonwebtoken'

//eyJhbGciOiJIUzI1NiJ9.Sm9obg.a6Vv6WRaDkqPch9Fmz2osKe-zj-Ao5Hb83rHMCenZhI
export function setUser(userData){
    const secrete_key = process.env.JWT_SECRETE;
    return jwt.sign(userData,secrete_key);
}

export function getUser(token){
    const secrete_key = process.env.JWT_SECRETE;
    try {
        const userData = jwt.verify(token,secrete_key);
        return userData;
    } catch (error) {
        console.log('error', error);
    }
}