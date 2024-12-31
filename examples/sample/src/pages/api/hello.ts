import type { NextApiRequest, NextApiResponse } from 'next'
 
type ResponseData = {
  message: string
}
 
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if ("name" in req.query) {
    return res.status(200).json({ message: req.query.name as string })
  }
  res.status(200).json({ message: 'Hello from Next.js!' })
}