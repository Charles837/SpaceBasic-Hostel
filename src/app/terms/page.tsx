
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AppLogo } from "@/components/layout/app-logo";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8 flex flex-col items-center">
      <header className="w-full max-w-4xl mb-8 flex justify-between items-center">
        <AppLogo />
        <Button variant="outline" asChild>
          <Link href="/student/apply">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Application
          </Link>
        </Button>
      </header>
      <main className="w-full max-w-4xl">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-primary font-headline">Terms and Conditions</CardTitle>
            <CardDescription>Last updated: {new Date().toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 prose dark:prose-invert max-w-none">
            <p>
              Please read these terms and conditions carefully before using the SafoRoom Room Allocation System (the "Service")
              operated by Your Institution ("us", "we", or "our").
            </p>

            <h2 className="text-xl font-semibold text-primary">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of
              the terms, then you may not access the Service. All students applying for accommodation must accept these
              terms and conditions.
            </p>

            <h2 className="text-xl font-semibold text-primary">2. Room Allocation Process</h2>
            <p>
              The room allocation process is managed by the SafoRoom system. Allocations are based on the criteria
              configured by the administration, which may include academic year, special needs, application date, and
              other factors deemed relevant by the institution. Submission of an application does not guarantee
              a room allocation.
            </p>
            <p>
              We reserve the right to change room assignments based on administrative needs, maintenance requirements,
              or disciplinary actions, even after an initial allocation has been made.
            </p>

            <h2 className="text-xl font-semibold text-primary">3. Student Responsibilities</h2>
            <p>
              Students are responsible for providing accurate and truthful information in their applications. Any
              misrepresentation may lead to the cancellation of the application or allocated room, and potential
              disciplinary action.
            </p>
            <p>
              Students allocated a room are expected to adhere to all university housing policies, codes of conduct,
              and payment schedules. Failure to comply may result in eviction or other penalties.
            </p>

            <h2 className="text-xl font-semibold text-primary">4. Use of Personal Information</h2>
            <p>
              By using the Service, you consent to the collection and use of your personal information as described in
              our Privacy Policy (link to be added here). This information will be used for the purpose of room
              allocation, communication, and other related administrative tasks.
            </p>

            <h2 className="text-xl font-semibold text-primary">5. System Availability</h2>
            <p>
              We strive to ensure the Service is available at all times, but we do not guarantee uninterrupted access.
              Maintenance, system upgrades, or unforeseen technical issues may temporarily disrupt service. We will
              endeavor to provide advance notice of any planned downtime.
            </p>

            <h2 className="text-xl font-semibold text-primary">6. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by applicable law, Your Institution shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether
              incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses,
              resulting from (a) your access to or use of or inability to access or use the service; (b) any conduct
              or content of any third party on the service.
            </p>

            <h2 className="text-xl font-semibold text-primary">7. Amendments to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision
              is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What
              constitutes a material change will be determined at our sole discretion.
            </p>

            <h2 className="text-xl font-semibold text-primary">8. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact the housing administration office.
            </p>
          </CardContent>
        </Card>
      </main>
      <footer className="py-8 mt-8 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} SafoRoom. All rights reserved.</p>
      </footer>
    </div>
  );
}
