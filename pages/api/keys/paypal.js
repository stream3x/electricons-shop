import nextConect from 'next-connect';

const handler = nextConect();

handler.get(async (req, res) => {
    res.send(process.env.CLIENT_ID_PAYPAL || 'sandbox')
});

export default handler;