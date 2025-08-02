import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-foreground mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <Card>
          <CardContent className="p-8 prose prose-lg max-w-none">
            <div className="space-y-6 text-foreground">
              <p className="text-lg">
                We know that you care how your information is used, and we appreciate your trust that we will use it carefully and sensibly. This notice describes our privacy policy. By visiting us, you are accepting the privacy policy described below.
              </p>

              <section>
                <h2 className="text-2xl font-semibold mb-4">1. What Personal Information Do We Collect?</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-medium mb-2">• Information You Provide</h3>
                    <p>
                      We receive and store information you enter. For example, when you search for or buy a product or service, or when you supply information such as your address, phone number or credit card. You can choose not to provide certain information, but then you might not be able to take advantage of some of our features. We use the information that you provide for such purposes as responding to your requests, customizing future shopping for you, improving our website, and communicating with you. In addition, if you choose, we may share your information with other companies who provide goods or services that you are interested in.
                    </p>
                    <p className="mt-2">
                      Please see the "opt-in/opt-out" selection in Section 3 of this policy.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium mb-2">• Cookies</h3>
                    <p>
                      Like many websites, we use "cookies". Cookies are small programs that we transfer to your hard drive that allow us to recognize you and to provide you with a customized shopping experience. If you do not want us to use cookies, you can easily disable them by going to the toolbar of your web browser, and clicking on the "help" button. Follow the instructions that will prevent the browser from accepting cookies, or set the browser to inform you when you receive a new cookie. In addition, you may visit this and other websites anonymously through the use of utilities provided by other private companies.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium mb-2">• Other Information</h3>
                    <p>
                      Every computer has an IP (Internet Protocol) address. IP addresses of computers used to visit this site are noted. In addition, we automatically collect other information such as email addresses, browser types, operating systems, and the URL addresses of sites clicked to and from this site.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium mb-2">• Information from Other Sources</h3>
                    <p>
                      We might receive information about you from other sources and add it to our account information. This may include updated delivery and address information from our shippers or other sources so that we can correct our records and deliver your next purchase or communication more easily.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. How Do We Use Your Information?</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-medium mb-2">• Customized Shopping</h3>
                    <p>
                      We use your information to better serve you by providing a customized shopping experience. As noted above, you may "opt-out" of this customization, or even visit and shop anonymously.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium mb-2">• Agents</h3>
                    <p>
                      We employ other companies and individuals to perform functions on our behalf. Examples include delivering packages, sending postal mail and e-mail, and processing credit card payments. They have access to personal information needed to perform their functions, but may not use it for other purposes.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium mb-2">• Special Offers</h3>
                    <p>
                      We may send you special offers from time to time, unless you choose to "opt-out" of receiving such offers. In addition, we may also send you special offers from other companies. Again, you may "opt-out". If we send you offers from other businesses, we do not share your personal information with them. The offers come directly through us. Please see the "opt-in/opt-out" selection at the end of this policy.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium mb-2">• Business Transfers</h3>
                    <p>
                      As we continue to develop our business, we might sell or buy stores or assets. In such transactions, customer information generally is one of the transferred business assets. Also, in the unlikely event that we are acquired, customer information will be one of the transferred assets.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium mb-2">• Law Enforcement</h3>
                    <p>
                      If we receive a lawful court order to release account or other personal information then we will comply with the law. We will also release information when necessary to protect the life, safety or property of others. This includes exchanging information with other companies and organizations for fraud protection and credit risk reduction.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. Your Choice: Opt-in or Opt-out</h2>
                <p className="mb-4">
                  It is your choice whether to receive emails or special offers from us or others. The following section provides you with this choice. Please note the default settings.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Please send me email or other mail informing me of special offers of your products or services.</li>
                  <li>Please do not send me email or other mail informing me of special offers of your products or services.</li>
                  <li>Please send me email or other mail informing me of special offers of related products or services from other companies.</li>
                  <li>Please do not send me email or other mail informing me of special offers of related products or services from other companies.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Children</h2>
                <p>
                  We do not sell products or services to children. If you are under 18, you may use this site only with involvement of a parent or guardian.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Other Websites</h2>
                <p>
                  Various Web sites may be linked to from this site. If you link to another site, your privacy depends on the policy of that site. We strongly urge you to check their privacy policy. Not all sites guarantee that they will not share your personally identifiable information with others. You may also wish to consult privacy guidelines such as those recommended by the Online Privacy Alliance (www.privacyalliance.org).
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Health Disclaimer</h2>
                <p>
                  This website is intended to provide general information about longevity and should not be construed as medical advice for any individual. No information contained on this website is intended to replace professional medical advice, diagnosis, or treatment.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
                <p>
                  If you would like to learn more on our website, you may contact us at{" "}
                  <a href="mailto:hello@healthylifescore.com" className="text-primary hover:underline">
                    hello@healthylifescore.com
                  </a>
                </p>
                <p className="mt-4 text-sm text-muted-foreground">
                  No portion of this website can be copied without written permission from the author.
                </p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;