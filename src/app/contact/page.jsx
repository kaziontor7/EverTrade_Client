import Link from "next/link";

export const metadata = {
  title: "Contact Us | EverTrade",
  description: "Get in touch with the EverTrade team.",
};

export default function ContactPage() {
  return (
    <div className="flex-grow flex flex-col min-h-screen bg-gray-50 dark:bg-[#060e20] relative">
      <div className="absolute inset-0 grid-pattern pointer-events-none opacity-40"></div>
      
      <div className="max-w-[1200px] mx-auto w-full px-6 py-12 md:py-20 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-[#e2e8f0] mb-4 tracking-tight">
            Get in <span className="text-emerald-400">Touch</span>
          </h1>
          <p className="text-gray-600 dark:text-[#94a3b8] text-lg max-w-2xl mx-auto">
            Have a question, feedback, or need support? Our team is here to help you out.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="glass-card p-8 rounded-3xl border border-gray-200 dark:border-white/10">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-[#e2e8f0] mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-emerald-400">location_on</span>
                  </div>
                  <div>
                    <h4 className="text-gray-900 dark:text-[#e2e8f0] font-medium">Headquarters</h4>
                    <p className="text-gray-600 dark:text-[#94a3b8]">123 Trade Avenue, Tech District<br/>Dhaka, Bangladesh</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-blue-400">mail</span>
                  </div>
                  <div>
                    <h4 className="text-gray-900 dark:text-[#e2e8f0] font-medium">Email Us</h4>
                    <p className="text-gray-600 dark:text-[#94a3b8]">support@evertrade.com<br/>partnerships@evertrade.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-orange-400">call</span>
                  </div>
                  <div>
                    <h4 className="text-gray-900 dark:text-[#e2e8f0] font-medium">Call Us</h4>
                    <p className="text-gray-600 dark:text-[#94a3b8]">+880 1712-345678<br/>Mon-Fri, 9am - 6pm (GMT+6)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="glass-card p-8 rounded-3xl border border-gray-200 dark:border-white/10">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-[#e2e8f0] mb-6">Send a Message</h3>
            
            <form className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                  <input type="text" className="et-input" placeholder="John" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                  <input type="text" className="et-input" placeholder="Doe" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                <input type="email" className="et-input" placeholder="john@example.com" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject</label>
                <input type="text" className="et-input" placeholder="How can we help?" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
                <textarea className="et-input min-h-[120px] resize-none" placeholder="Write your message here..."></textarea>
              </div>

              <button type="button" className="btn-primary w-full shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                Send Message
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
