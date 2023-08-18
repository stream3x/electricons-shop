import nc from 'next-connect';
import db from '../../../src/utils/db';
import Guest from '../../../models/Guest';

const handler = nc();

handler.get( async (req, res) => {
    await db.connect();
    const guest_orders = await Guest.find();
    const recentFiveGuestOrders = await Guest.find()
    .sort({ createdAt: -1 }) // Sort in descending order by createdAt
    .limit(5) // Limit to the last five documents
    .exec();

    const customers = guest_orders.map(guestOrder => {
        return {
          name: guestOrder.personalInfo.name,
          email: guestOrder.personalInfo.email,
          address: guestOrder.personalInfo.address ? guestOrder.personalInfo.address : '',
          city: guestOrder.personalInfo.city ? guestOrder.personalInfo.address : '',
          country: guestOrder.personalInfo.country ? guestOrder.personalInfo.country : '',
          postalcode: guestOrder.personalInfo.postalcode ? guestOrder.personalInfo.postalcode : '',
          company: guestOrder.personalInfo.company ? guestOrder.personalInfo.company : '',
          phone: guestOrder.personalInfo.phone ? guestOrder.personalInfo.phone : '',
          vatNumber: guestOrder.personalInfo.vatNumber ? guestOrder.personalInfo.vatNumber : '',
          newsletter: guestOrder.personalInfo.newsletter ? guestOrder.personalInfo.newsletter : '',
          createdAt: guestOrder.createdAt ? guestOrder.createdAt.toString() : '',
          birthday: guestOrder.personalInfo.birthday ? guestOrder.personalInfo.birthday : ''
        };
      });
  
      const uniqueCustomers = [];
      customers.filter(customer => {
        const duplicate = uniqueCustomers.findIndex(unique => unique.email === customer.email);
        if (duplicate <= -1) {
          uniqueCustomers.push(customer);
        }
      })

    res.send([{guest_orders: guest_orders}, {recentFiveGuestOrders: recentFiveGuestOrders}, {guest_users: uniqueCustomers}]);
});

export default handler;