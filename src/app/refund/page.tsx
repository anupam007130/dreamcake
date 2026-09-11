import Header from '@/components/customer/Header'
import Footer from '@/components/customer/Footer'
import { RotateCcw } from 'lucide-react'

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <RotateCcw className="w-8 h-8 text-pink-500" />
            <h1 className="text-3xl font-bold text-gray-900">Refund Policy</h1>
          </div>
          <p className="text-sm text-gray-500 mb-8">Last updated: September 2026</p>

          <div className="space-y-6 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">1. Order Cancellation & Refund</h2>
              <p>If you cancel your order before it is prepared, you will receive a full refund. If the order is cancelled after preparation has started, a cancellation fee of 25% may apply.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">2. Damaged or Defective Products</h2>
              <p>If you receive a damaged or defective cake, please contact us within 2 hours of delivery with photographic evidence. We will either offer a full replacement or a complete refund based on the situation.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">3. Incorrect Orders</h2>
              <p>If you receive an order that is different from what you placed, please notify us immediately. We will arrange for the correct item to be delivered or provide a full refund.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">4. Delivery Issues</h2>
              <p>If your order is not delivered within the promised time window due to our fault, you are eligible for a refund of the delivery charges. In case of significant delay, partial or full refund may be provided at our discretion.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">5. Online Payment Refunds</h2>
              <p>Refunds for online payments are processed within 5-7 business days to the original payment method. For Razorpay transactions, refunds are initiated through the Razorpay dashboard.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">6. COD Refunds</h2>
              <p>For Cash on Delivery orders, refunds will be processed via bank transfer or UPI. Please provide your bank account or UPI details to our support team for processing.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">7. Non-Refundable Cases</h2>
              <p>Refunds will not be applicable in the following cases:</p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Taste preferences or subjective quality complaints</li>
                <li>Orders delivered on time and in good condition</li>
                <li>Requests made after 24 hours of delivery</li>
                <li>Customized cakes (unless damaged or defective)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">8. How to Request a Refund</h2>
              <p>To request a refund, contact our support team with your order ID and reason for the refund. Our team will review your request and respond within 24 hours.</p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
