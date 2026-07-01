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
          <h1 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white mb-4 tracking-tighter">
            Get in <span className="text-zinc-500">Touch</span>
          </h1>
          <p className="text-zinc-500 font-medium text-lg max-w-2xl mx-auto">
            Have a question, feedback, or need support? Our team is here to help you out.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-zinc-50 dark:bg-zinc-900/30 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800/50">
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-zinc-900 dark:text-white">location_on</span>
                  </div>
                  <div>
                    <h4 className="text-zinc-900 dark:text-white font-bold">Headquarters</h4>
                    <p className="text-zinc-500">123 Trade Avenue, Tech District<br/>Dhaka, Bangladesh</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-zinc-900 dark:text-white">mail</span>
                  </div>
                  <div>
                    <h4 className="text-zinc-900 dark:text-white font-bold">Email Us</h4>
                    <p className="text-zinc-500">support@evertrade.com<br/>partnerships@evertrade.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-zinc-900 dark:text-white">call</span>
                  </div>
                  <div>
                    <h4 className="text-zinc-900 dark:text-white font-bold">Call Us</h4>
                    <p className="text-zinc-500">+880 1712-345678<br/>Mon-Fri, 9am - 6pm (GMT+6)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-zinc-50 dark:bg-zinc-900/30 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800/50">
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">Send a Message</h3>
            
            <form className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-zinc-900 dark:text-white mb-2">First Name</label>
                  <input type="text" className="w-full bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 focus-within:border-zinc-900 dark:focus-within:border-white transition-colors rounded-lg py-3 px-3" placeholder="John" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-900 dark:text-white mb-2">Last Name</label>
                  <input type="text" className="w-full bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 focus-within:border-zinc-900 dark:focus-within:border-white transition-colors rounded-lg py-3 px-3" placeholder="Doe" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-900 dark:text-white mb-2">Email Address</label>
                <input type="email" className="w-full bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 focus-within:border-zinc-900 dark:focus-within:border-white transition-colors rounded-lg py-3 px-3" placeholder="john@example.com" />
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-900 dark:text-white mb-2">Subject</label>
                <input type="text" className="w-full bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 focus-within:border-zinc-900 dark:focus-within:border-white transition-colors rounded-lg py-3 px-3" placeholder="How can we help?" />
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-900 dark:text-white mb-2">Message</label>
                <textarea className="w-full bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 focus-within:border-zinc-900 dark:focus-within:border-white transition-colors rounded-lg py-3 px-3 min-h-[120px] resize-none" placeholder="Write your message here..."></textarea>
              </div>

              <button type="button" className="w-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-bold py-4 rounded-xl transition-colors">
                Send Message
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
