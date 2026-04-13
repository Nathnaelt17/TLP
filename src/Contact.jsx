import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function Contact() {
  return (
    <section id="contact" className="bg-slate-900 py-24 text-white">
      <div className="mx-auto max-w-4xl px-6">
        <Card className="overflow-hidden rounded-[1.75rem] border border-slate-800 bg-slate-950/95 shadow-xl">
          <CardContent className="p-10 text-center">
            <CardHeader className="space-y-4">
              <CardTitle>Contact Us</CardTitle>
              <CardDescription>
                Reach out with questions, booking requests, or travel planning
                support.
              </CardDescription>
            </CardHeader>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default Contact
