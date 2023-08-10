import { NextRequest, NextResponse }  from "next/server";

export const config = {
  runtime: 'edge',
}

const handler = async (req: NextRequest, res: NextResponse) => {
  const message = {title: `Hello from ${req.url}`};
  return res.json(message);
};

export default handler;