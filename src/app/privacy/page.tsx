import Header from '@/components/customer/Header'
import Footer from '@/components/customer/Footer'
import { Shield } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-pink-500" />
            <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
          </div>
          <p className="text-sm text-gray-500 mb-8">Last updated: September 2026</p>

          <div className="space-y-6 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">1. Information We Collect</h2>
              <p>We collect personal information you provide directly, including:</p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Full name, email address, and mobile number</li>
                <li>Delivery addresses</li>
                <li>Payment information (processed securely through Razorpay)</li>
                <li>Order history and preferences</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">2. How We Use Your Information</h2>
              <p>We use your information to:</p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Process and fulfill your orders</li>
                <li>Send order updates and delivery notifications</li>
                <li>Communicate with you about your account or orders</li>
                <li>Improve our products and services</li>
                <li>Ensure secure payment processing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">3. Data Security</h2>
              <p>We implement appropriate security measures to protect your personal information. Payment information is encrypted and processed through Razorpay&apos;s secure payment gateway. We do not store your credit/debit card details on our servers.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">4. Third-Party Sharing</h2>
              <p>We do not sell or rent your personal information to third parties. We may share your information with:</p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Payment processors (Razorpay) for transaction processing</li>
                <li>Delivery partners solely for order fulfillment</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">5. Cookies</h2>
              <p>Our website uses cookies to enhance your browsing experience, remember your preferences, and analyze site traffic. You can choose to disable cookies through your browser settings.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">6. Data Retention</h2>
              <p>We retain your personal information for as long as your account is active or as needed to provide services. Order data is retained for legal and business purposes.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">7. Your Rights</h2>
              <p>You have the right to access, update, or delete your personal information at any time through your account settings or by contacting our support team.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">8. Changes to This Policy</h2>
              <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.</p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
