// /pages/api/users/index.ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        const users = [{
            id: '1',
            name: 'John Doe',
            email: 'john@doe.com',
            role: 'admin'
        }, {
            id: '2',
            name: 'Jane Doe',
            email: 'jane@doe.com',
            role: 'user'
        }]
        return res.status(200).json(users)
      case 'POST':
        const newUser = [{
            id: '1',
            name: 'John Doe',
            email: 'john@doe.com',
            role: 'admin'
        }]
        return res.status(201).json(newUser)
      default:
        res.setHeader('Allow', ['GET','POST'])
        return res.status(405).end()
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message })
  }
}
