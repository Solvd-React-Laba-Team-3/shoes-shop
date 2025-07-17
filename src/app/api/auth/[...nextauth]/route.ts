import NextAuth from 'next-auth/next';
import { authOptions } from '@/constants/authConfig';
import { NextApiRequest, NextApiResponse } from 'next';

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
  return await NextAuth(req, res, authOptions);
};

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
  return await NextAuth(req, res, authOptions);
};

export { GET, POST };
