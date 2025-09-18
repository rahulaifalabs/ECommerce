// PayPal shim - replaces paypal-rest-sdk to avoid external dependency.
// This provides a minimal compatibility layer that supports .payment.create
// and .payment.execute used in the original code. It returns simulated
// approval links that point back to the frontend return route so existing UI
// flows continue to work without contacting PayPal.
module.exports = {
  payment: {
    create: (create_payment_json, cb) => {
      try {
        const paymentId = "SIM_PAY_" + Date.now();
        const approvalURL = `http://localhost:5173/shop/paypal-return?paymentId=${paymentId}&token=${paymentId}`;
        const paymentInfo = {
          id: paymentId,
          links: [
            { rel: "approval_url", href: approvalURL },
            { rel: "self", href: approvalURL }
          ],
        };
        // simulate async behavior
        setTimeout(() => cb(null, paymentInfo), 10);
      } catch (err) {
        setTimeout(() => cb(err), 10);
      }
    },
    execute: (paymentId, payer, cb) => {
      // simulate a successful execution
      const result = { id: paymentId, state: "approved", payer };
      setTimeout(() => cb(null, result), 10);
    },
  },
  configure: () => {},
};