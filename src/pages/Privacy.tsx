
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="content-container">
          <div className="max-w-4xl mx-auto">
            <h1 className="heading-lg mb-6">Privacy Policy</h1>
            <p className="text-muted-foreground mb-8">Last updated: June 1, 2023</p>
            
            <div className="prose prose-lg max-w-none">
              <p>
                At PalmistryAI, we take your privacy seriously. This Privacy Policy explains how we collect, 
                use, disclose, and safeguard your information when you visit our website or use our AI-powered 
                palm reading and compatibility matching services.
              </p>
              
              <h2>Information We Collect</h2>
              <p>
                We collect information that you provide directly to us, including:
              </p>
              <ul>
                <li>Personal information such as your name, email address, and payment information</li>
                <li>Images of your palms that you upload for analysis</li>
                <li>Information about your relationships if you use our compatibility matching service</li>
                <li>Communications you send directly to us</li>
              </ul>
              
              <p>
                We also automatically collect certain information about your device and how you interact with our services, including:
              </p>
              <ul>
                <li>Usage information, such as the features you use and the time spent on our services</li>
                <li>Device information, such as your hardware model, operating system, and browser type</li>
                <li>IP address and cookies for analytics and service improvement</li>
              </ul>
              
              <h2>How We Use Your Information</h2>
              <p>
                We use the information we collect to:
              </p>
              <ul>
                <li>Provide, maintain, and improve our services</li>
                <li>Process and complete transactions</li>
                <li>Generate personalized palm reading reports and compatibility analyses</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Send you technical notices, updates, security alerts, and administrative messages</li>
                <li>Communicate with you about products, services, offers, and events</li>
                <li>Monitor and analyze trends, usage, and activities in connection with our services</li>
                <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
                <li>Train and improve our AI models for better palm analysis</li>
              </ul>
              
              <h2>How We Share Your Information</h2>
              <p>
                We do not sell, trade, or otherwise transfer your personally identifiable information to outside 
                parties except in the following circumstances:
              </p>
              <ul>
                <li>With vendors, consultants, and other service providers who need access to such information to carry out work on our behalf</li>
                <li>In response to a request for information if we believe disclosure is in accordance with any applicable law, regulation, or legal process</li>
                <li>If we believe your actions are inconsistent with our user agreements or policies</li>
                <li>To protect the rights, property, and safety of PalmistryAI or others</li>
                <li>In connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business by another company</li>
                <li>With your consent or at your direction</li>
              </ul>
              
              <h2>Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect the security of your personal information. 
                However, please be aware that no method of transmission over the Internet or method of electronic storage is 100% secure.
              </p>
              
              <h2>Your Rights and Choices</h2>
              <p>
                You may update, correct, or delete your account information at any time by logging into your account or emailing us. 
                You may also request access to the personal data we hold about you and request that we delete your personal information.
              </p>
              
              <h2>Children's Privacy</h2>
              <p>
                Our services are not directed to children under 13, and we do not knowingly collect personal information from children under 13.
              </p>
              
              <h2>Changes to This Privacy Policy</h2>
              <p>
                We may change this Privacy Policy from time to time. If we make changes, we will notify you by revising the date at the top 
                of the policy and, in some cases, we may provide you with additional notice.
              </p>
              
              <h2>Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p>
                Email: privacy@palmistryai.com<br />
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

export default Privacy;
