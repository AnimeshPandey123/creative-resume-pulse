'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { contactData } from '@/data/landingData';

interface FormState {
  name: string;
  email: string;
  message: string;
}

const Contact: React.FC = () => {
  const [formState, setFormState] = useState<FormState>({
    name: '',
    email: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const contactContentRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
        message: '',
      });

      toast({
        title: 'Message sent!',
        description: "Thank you for reaching out. I'll get back to you soon.",
      });
    } else {
      toast({
        title: 'Message not sent!',
        description: 'Something went wrong',
      });
    }
  };

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-slide-in-bottom');
          observer.unobserve(entry.target);
        }
      });
    }, options);

    const currentRef = contactContentRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <section
      id="contact"
      className="py-20 bg-accent/50"
      role="region"
      aria-labelledby="contact-heading"
    >
      <div className="section-container">
        <header className="text-center mb-12">
          <h2 id="contact-heading" className="section-title">
            {contactData.title}
          </h2>
          <p className="section-subtitle">{contactData.subtitle}</p>
        </header>

        <div
          ref={contactContentRef}
          className="max-w-5xl mx-auto glass-card p-8 md:p-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <aside>
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>

              <address className="space-y-6 not-italic">
                <div className="flex items-start">
                  <MapPin className="text-primary mt-1 mr-4" size={20} />
                  <div>
                    <p className="font-medium">
                      {contactData.info.location.label}
                    </p>
                    <p className="text-muted-foreground">
                      {contactData.info.location.value}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="text-primary mt-1 mr-4" size={20} />
                  <div>
                    <p className="font-medium">
                      {contactData.info.email.label}
                    </p>
                    <a
                      href={`mailto:${contactData.info.email.value}`}
                      className="text-muted-foreground hover:text-primary transition-colors"
                      aria-label="Send email to Animesh Pandey"
                    >
                      {contactData.info.email.value}
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="text-primary mt-1 mr-4" size={20} />
                  <div>
                    <p className="font-medium">
                      {contactData.info.phone.label}
                    </p>
                    <a
                      href={`tel:${contactData.info.phone.value}`}
                      className="text-muted-foreground hover:text-primary transition-colors"
                      aria-label="Call Animesh Pandey"
                    >
                      {contactData.info.phone.value}
                    </a>
                  </div>
                </div>
              </address>

              <section className="mt-10">
                <h4 className="text-xl font-bold mb-4">Connect</h4>
                <nav className="flex space-x-4" aria-label="Social media links">
                  {contactData.social.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-secondary rounded-full hover:bg-primary hover:text-white transition-colors"
                      aria-label={`Visit ${social.name} profile`}
                    >
                      {social.icon === 'linkedin' && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-linkedin"
                        >
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                          <rect width="4" height="12" x="2" y="9" />
                          <circle cx="4" cy="4" r="2" />
                        </svg>
                      )}
                      {social.icon === 'globe' && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-globe"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <line x1="2" x2="22" y1="12" y2="12" />
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        </svg>
                      )}
                    </a>
                  ))}
                </nav>
              </section>
            </aside>

            <main>
              <h3 className="text-2xl font-bold mb-6">Send Me a Message</h3>

              <form
                onSubmit={handleSubmit}
                className="space-y-6"
                aria-label="Contact form"
              >
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-2"
                  >
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
                    aria-describedby="name-help"
                  />
                  <div id="name-help" className="sr-only">
                    Please enter your full name
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2"
                  >
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
                    aria-describedby="email-help"
                  />
                  <div id="email-help" className="sr-only">
                    Please enter a valid email address
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium mb-2"
                  >
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
                    aria-describedby="message-help"
                  ></textarea>
                  <div id="message-help" className="sr-only">
                    Please enter your message
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium transition-all hover:bg-primary/90 hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                  aria-describedby="submit-status"
                >
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
                <div id="submit-status" className="sr-only" aria-live="polite">
                  {submitting
                    ? 'Sending your message...'
                    : 'Ready to send message'}
                </div>
              </form>
            </main>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
