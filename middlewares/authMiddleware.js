 import jwt from 'jsonwebtoken';

function auth(role) {
   return function (req, res, next) {
     const authHeader = req.headers.authorization;

     if (!authHeader || !authHeader.startsWith('Bearer ')) {
       return res.status(401).json({ error: 'Authorization header missing or malformed' });
     }

     const token = authHeader.split(' ')[1];

     try {
       const user = jwt.verify(token, process.env.JWT_SECRET);
      
       if (role && user.role !== role) {
         return res.status(403).json({ error: 'Access denied for this role' });
       }

       req.user = user;
       next();
     } catch (err) {
       console.error('JWT Verification Error:', err.message);
       return res.status(401).json({ error: 'Invalid or expired token' });
     }
   };
 }

 export default auth;



