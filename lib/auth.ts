import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'hardcoded_jwt_secret_for_development';

interface DecodedToken {
  id: string;
  role: string;
  iat: number;
  exp: number;
}

export const verifyAuth = async (req: Request) => {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { success: false, error: 'Not authorized to access this route, no token' };
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    return { success: true, decoded };
  } catch (error) {
    return { success: false, error: 'Not authorized to access this route, token failed' };
  }
};
