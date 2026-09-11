import Header from '@/components/customer/Header'
import Footer from '@/components/customer/Footer'
import { Truck } from 'lucide-react'

export default function DeliveryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <Truck className="w-8 h-8 text-pink-500" />
            <h1 className="text-3xl font-bold text-gray-900">Delivery Policy</h1>
          </div>
          <p className="text-sm text-gray-500 mb-8">Last updated: September 2026</p>

          <div className="space-y-6 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">1. Delivery Areas</h2>
              <p>We currently deliver to select areas within our city. Please enter your pin code at checkout to check if delivery is available to your location. We are continuously expanding our delivery network.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">2. Delivery Time Slots</h2>
              <p>Available delivery time slots are displayed during checkout. Standard delivery slots include morning (9 AM - 12 PM), afternoon (12 PM - 3 PM), and evening (4 PM - 8 PM). Exact delivery times may vary based on location and demand.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">3. Minimum Order & Advance Days</h2>
              <p>Orders must be placed at least 1 day in advance for standard delivery. Same-day delivery may be available for select products during non-peak hours (subject to additional charges).</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">4. Urgent / Same-Day Delivery</h2>
              <p>Urgent delivery is available for an additional charge. The urgent delivery fee and minimum advance time are shown during checkout. Urgent delivery is subject to product availability.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">5. Delivery Charges</h2>
              <p>Delivery charges are calculated based on your location and displayed at checkout. Free delivery may be available for orders above a certain amount, as configured in our system.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">6. Delivery Process</h2>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Our delivery partner will contact you before delivery</li>
                <li>Please ensure someone is available to receive the order</li>
                <li>If无人在家, the delivery partner will attempt to reach you by phone</li>
                <li>Maximum 2 delivery attempts will be made</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">7. Delivery Issues</h2>
              <p>If your order is delayed beyond the promised time window, please contact our support team. In case of failed delivery due to incorrect address or unavailability, re-delivery charges may apply.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">8. Order Tracking</h2>
              <p>You can track your order status in real-time from your account dashboard. Status updates include Confirmed, Accepted, Preparing, Baking, Ready, Out for Delivery, and Delivered.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">9. Special Occasions</h2>
              <p>For deliveries on special occasions (birthdays, anniversaries), we recommend placing orders at least 2-3 days in advance to ensure availability and timely delivery.</p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
