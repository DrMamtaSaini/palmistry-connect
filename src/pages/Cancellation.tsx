
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Cancellation = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="content-container">
          <div className="max-w-4xl mx-auto">
            <h1 className="heading-lg mb-6">Cancellation & Refund Policy</h1>
            <p className="text-muted-foreground mb-8">Last updated: June 1, 2023</p>
            
            <div className="prose prose-lg max-w-none">
              <p>
                At PalmistryAI, we strive to ensure our customers are satisfied with their palm reading and compatibility matching 
                services. This Cancellation and Refund Policy outlines the terms and conditions for cancellations, refunds, and service changes.
              </p>
              
              <h2>Digital Services and Products</h2>
              <p>
                Our palm reading reports, compatibility analyses, and other digital services are delivered immediately upon purchase. 
                Due to the digital nature of these services and the fact that they cannot be returned, we generally do not offer refunds 
                for completed services.
              </p>
              
              <h2>Satisfaction Guarantee</h2>
              <p>
                However, we stand behind our services with a satisfaction guarantee. If you are not satisfied with the quality of your 
                palm reading or compatibility report, you may request a refund within 7 days of purchase by contacting our customer 
                support team with a detailed explanation of why the service did not meet your expectations.
              </p>
              <p>
                Each refund request will be evaluated on a case-by-case basis. Approved refunds will be processed within 14 business 
                days and credited back to the original payment method.
              </p>
              
              <h2>Subscription Services</h2>
              <p>
                For subscription-based services:
              </p>
              <ul>
                <li>You may cancel your subscription at any time through your account settings or by contacting customer support.</li>
                <li>Cancellation will take effect at the end of your current billing cycle.</li>
                <li>No partial refunds will be issued for unused portions of the current billing period.</li>
                <li>After cancellation, you will continue to have access to the subscription benefits until the end of your billing cycle.</li>
              </ul>
              
              <h2>Technical Issues</h2>
              <p>
                If you encounter technical issues that prevent you from accessing or using our services after payment, please contact 
                our customer support team immediately. We will work to resolve the issue or provide a full refund if the service cannot be delivered.
              </p>
              
              <h2>Cancellation Before Service Completion</h2>
              <p>
                If you have purchased a service that requires additional processing time (such as a premium in-depth analysis that is 
                not instantly generated), you may request a cancellation before the service is completed:
              </p>
              <ul>
                <li>Cancellations requested before processing begins will receive a full refund.</li>
                <li>Cancellations requested during processing may receive a partial refund based on the work already completed.</li>
              </ul>
              
              <h2>Chargebacks</h2>
              <p>
                We encourage customers to contact us directly to resolve any issues before initiating a chargeback with their payment provider. 
                Unauthorized chargebacks may result in the user being banned from future services.
              </p>
              
              <h2>Contact for Refunds</h2>
              <p>
                To request a refund or cancellation, please contact our customer support team at:
              </p>
              <p>
                Email: refunds@palmistryai.com<br />
                Subject Line: Refund Request - [Your Order Number]
              </p>
              <p>
                Please include the following information:
              </p>
              <ul>
                <li>Your full name</li>
                <li>Order number or transaction ID</li>
                <li>Date of purchase</li>
                <li>Reason for refund request</li>
                <li>Any relevant details or screenshots</li>
              </ul>
              
              <h2>Changes to This Policy</h2>
              <p>
                We reserve the right to modify this Cancellation and Refund Policy at any time. Changes will be effective immediately 
                upon posting to the website. Your continued use of our services following the posting of changes constitutes your 
                acceptance of such changes.
              </p>
              
              <h2>Contact Us</h2>
              <p>
                If you have any questions about this Cancellation and Refund Policy, please contact us at:
              </p>
              <p>
                Email: support@palmistryai.com<br />
                Address: 123 AI Avenue, Digital District, Tech City, TC 12345
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cancellation;
