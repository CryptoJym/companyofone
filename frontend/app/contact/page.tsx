import { ContactForm } from '@/components/forms/ContactForm';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Heading } from '@/components/ui/Heading';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Section className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Heading as="h1" size="4xl" className="mb-4">
                Contact Us
              </Heading>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Have questions about Company of One? Need help with your business? 
                We're here to help. Send us a message and we'll get back to you within 24 hours.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-start">
              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                    Get in Touch
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm font-semibold mt-1">
                        ✉
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Email</p>
                        <p className="text-gray-600">support@companyofone.ai</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm font-semibold mt-1">
                        📞
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Phone</p>
                        <p className="text-gray-600">+1 (555) 123-4567</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm font-semibold mt-1">
                        ⏰
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Business Hours</p>
                        <p className="text-gray-600">Mon-Fri: 9:00 AM - 6:00 PM EST</p>
                        <p className="text-gray-600">Weekends: Closed</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm font-semibold mt-1">
                        💬
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Response Time</p>
                        <p className="text-gray-600">Within 24 hours</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">
                    Need Immediate Help?
                  </h3>
                  <p className="text-blue-800 mb-4">
                    Looking for a personalized consultation? Book a free 30-minute 
                    strategy session with one of our business experts.
                  </p>
                  <a 
                    href="/#consultation" 
                    className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Book Free Consultation
                  </a>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Follow Us
                  </h3>
                  <div className="flex gap-4">
                    <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                      Twitter
                    </a>
                    <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                      LinkedIn
                    </a>
                    <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                      Instagram
                    </a>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Send us a Message
                </h2>
                <ContactForm 
                  onSuccess={(response) => {
                    console.log('Contact form submitted successfully:', response);
                    // Optional: Add analytics tracking or redirect
                  }}
                  onError={(error) => {
                    console.error('Contact form error:', error);
                    // Optional: Add error analytics tracking
                  }}
                />
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}

export const metadata = {
  title: 'Contact Us | Company of One',
  description: 'Get in touch with Company of One. We\'re here to help you scale your solopreneur business. Contact us for support, questions, or to book a free consultation.',
};