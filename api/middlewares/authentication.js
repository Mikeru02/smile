import jwt from 'jsonwebtoken';

export default function authentication(req, res, next) {
    const token = req.headers.token;

    if (!token) {
        res.json({
        'success': false,
        'message': 'Unauthenticated user',
        });
        return;
    }

    jwt.verify(token, process.env.API_SECRET_KEY, (err, decoded) => {
        if (err) {
        res.json({
            'success': false,
            'message': 'Invalid token',
        });
        return;
        }

        res.locals.username = decoded?.username;
        res.locals.authenticated = true;
        next();
    });

}