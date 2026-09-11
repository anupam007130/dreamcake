import Header from '@/components/customer/Header'
import Footer from '@/components/customer/Footer'
import { FileText } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-8 h-8 text-pink-500" />
            <h1 className="text-3xl font-bold text-gray-900">Terms & Conditions</h1>
          </div>
          <p className="text-sm text-gray-500 mb-8">Last updated: September 2026</p>

          <div className="space-y-6 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">1. Acceptance of Terms</h2>
              <p>By accessing and using Dream Cake website and services, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our services.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">2. Products & Orders</h2>
              <p>All cakes and products are subject to availability. We reserve the right to modify or discontinue any product without prior notice. Images on the website are for reference only; actual products may vary slightly in design and color.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">3. Pricing</h2>
              <p>All prices are in Indian Rupees (INR) and inclusive of applicable taxes unless stated otherwise. We reserve the right to change prices at any time without prior notice.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">4. Order Cancellation</h2>
              <p>Orders can be cancelled up to 24 hours before the scheduled delivery time. Orders cancelled within 24 hours of delivery may be subject to a cancellation fee. Orders that are already out for delivery cannot be cancelled.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">5. Delivery</h2>
              <p>We aim to deliver orders within the selected time window. However, delivery times are estimates and may be affected by factors beyond our control including weather, traffic, and high demand periods. Additional charges may apply for urgent or same-day deliveries.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">6. Payment</h2>
              <p>We accept payments via Razorpay (UPI, Cards, Net Banking) and Cash on Delivery (COD). For COD orders, a partial advance may be required at the time of ordering. Full payment must be made at the time of delivery for COD orders.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">7. User Accounts</h2>
              <p>You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate and complete information when creating an account. We reserve the right to suspend or terminate accounts that violate these terms.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">8. Limitation of Liability</h2>
              <p>Dream Cake shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services. Our total liability shall not exceed the amount paid for the specific order in question.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">9. Changes to Terms</h2>
              <p>We reserve the right to update these terms at any time. Changes will be effective immediately upon posting on the website. Continued use of our services after changes constitutes acceptance of the new terms.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">10. Contact</h2>
              <p>For any questions about these Terms & Conditions, please contact us through our website or email us at our support address.</p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
