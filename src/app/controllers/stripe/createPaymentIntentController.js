import Stripe from 'stripe'
import * as Yup from 'yup'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const calculateOrderAmount = (items) => {
  const total = items.reduce((acc, cur) => acc + cur.price * cur.quantity, 0)
  return total + (total * 5) / 100
}

class CreatePaymentIntentController {
  async store(req, res) {
    try {
      const orderSchema = Yup.object({
        products: Yup.array()
          .required()
          .of(
            Yup.object({
              id: Yup.number().required(),
              quantity: Yup.number().required(),
              price: Yup.number().required(),
            }),
          ),
      })
      try {
        orderSchema.validateSync(req.body, { abortEarly: false })
      } catch (error) {
        return res.status(400).json({ error: error.errors })
      }
      const { products } = req.body
      const amount = calculateOrderAmount(products)

      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'brl',
        automatic_payment_methods: {
          enabled: true,
        },
      })

      res.json({
        clientSecret: paymentIntent.client_secret,
        dpmCheckerLink: `https://dashboard.stripe.com/settings/payment_methods/review?transaction_id=${paymentIntent.id}`,
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Internal server error!' })
    }
  }
}

export default new CreatePaymentIntentController()
