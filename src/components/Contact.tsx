
import React, { useState, useEffect, useRef } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FormState {
  name: string;
  email: string;
  message: string;
}

const Contact: React.FC = () => {
  const [formState, setFormState] = useState<FormState>({
    name: '',
    email: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const contactContentRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formState),
    });

    if (res.ok) {
      setSubmitting(false);
      setFormState({
        name: '',
        email: '',
        message: ''
      });
      
      toast({
        title: "Message sent!",
        description: "Thank you for reaching out. I'll get back to you soon.",
      });
    } else {
      console.log("Failed to send email", res.json());
      toast({
        title: "Message not sent!",
        description: "Something went wrong",
      });
    }
  };

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-slide-in-bottom');
          observer.unobserve(entry.target);
        }
      });
    }, options);

    if (contactContentRef.current) {
      observer.observe(contactContentRef.current);
    }

    return () => {
      if (contactContentRef.current) {
        observer.unobserve(contactContentRef.current);
      }
    };
  }, []);

  return (
    <section id="contact" className="py-20 bg-accent/50">
      <div className="section-container">
        <h2 className="section-title">Get In Touch</h2>
        <p className="section-subtitle">
          Have a project in mind or want to discuss a potential opportunity? I'd love to hear from you.
        </p>

        <div 
          ref={contactContentRef}
          className="max-w-5xl mx-auto glass-card p-8 md:p-10 opacity-0"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <MapPin className="text-primary mt-1 mr-4" size={20} />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-muted-foreground">West Bromwich, Birmingham</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="text-primary mt-1 mr-4" size={20} />
                  <div>
                    <p className="font-medium">Email</p>
                    <a 
                      href="mailto:animeshpandey.pro@gmail.com" 
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      animeshpandey.pro@gmail.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="text-primary mt-1 mr-4" size={20} />
                  <div>
                    <p className="font-medium">Phone</p>
                    <a 
                      href="tel:+447775658685" 
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      +44 7775 658685
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="mt-10">
                <h3 className="text-xl font-bold mb-4">Connect</h3>
                <div className="flex space-x-4">
                  <a 
                    href="https://www.linkedin.com/in/animesh-pandey-26546213a"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-secondary rounded-full hover:bg-primary hover:text-white transition-colors"
                    aria-label="LinkedIn"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                      <rect width="4" height="12" x="2" y="9"/>
                      <circle cx="4" cy="4" r="2"/>
                    </svg>
                  </a>
                  <a 
                    href="https://animeshpandey.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-secondary rounded-full hover:bg-primary hover:text-white transition-colors"
                    aria-label="Website"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-globe">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="2" x2="22" y1="12" y2="12"/>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-6">Send Me a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Your Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formState.name}
                    onChange={handleChange}
                    required
                    className="contact-input"
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Your Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formState.email}
                    onChange={handleChange}
                    required
                    className="contact-input"
                    placeholder="john@example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formState.message}
                    onChange={handleChange}
                    required
                    className="contact-input resize-none"
                    placeholder="Your message here..."
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium transition-all hover:bg-primary/90 hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
