'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react'
import { useI18n } from '@/lib/i18n-simple'
import SiteHeader from '@/components/SiteHeader'
import Footer from '@/components/Footer'

export default function ContactPage() {
  const { t } = useI18n()
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFormState((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)

    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitStatus('success')
      setFormState({ name: '', email: '', company: '', subject: '', message: '' })
      setTimeout(() => setSubmitStatus('idle'), 5000)
    }, 1500)
  }

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: t?.contact?.email || 'Email',
      value: 'hello@hackboot.com',
      link: 'mailto:hello@hackboot.com',
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: t?.contact?.phone || 'Phone',
      value: '+372 5555 5555',
      link: 'tel:+37255555555',
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: t?.contact?.address || 'Address',
      value: 'Paju 1a, 50603 Tartu, Estonia',
      link: 'https://maps.google.com/?q=Paju+1a,+50603+Tartu,+Estonia',
    },
  ]

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen pt-32 pb-20 bg-black text-white animate-fade-in">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-scale-in">
            <span className="inline-block px-4 py-2 glass-effect rounded-full text-sm font-medium mb-4 gradient-text">
              {t?.contact?.badge || 'Get in touch'}
            </span>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              {t?.contact?.title || 'Contactez-nous'}
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              {t?.contact?.subtitle || "Envoyez-nous un message et nous vous répondons rapidement."}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto animate-slide-up">
            <aside className="space-y-6 animate-fade-in">
              {contactInfo.map((item) => (
                <a
                  key={item.title}
                  href={item.link}
                  className="block p-6 glass-effect rounded-2xl border border-white/10 hover:border-purple-400/40 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/5 rounded-xl text-purple-400">{item.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                      <p className="text-gray-300">{item.value}</p>
                    </div>
                  </div>
                </a>
              ))}
            </aside>

            <section className="lg:col-span-2 animate-scale-in">
              <form onSubmit={handleSubmit} className="glass-effect rounded-3xl border border-white/10 p-8 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      {t?.contact?.form?.name || 'Nom'} *
                    </label>
                    <input
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-400 text-white"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      {t?.contact?.form?.email || 'Email'} *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formState.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-400 text-white"
                      placeholder="john@company.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                      {t?.contact?.form?.company || 'Entreprise'}
                    </label>
                    <input
                      id="company"
                      name="company"
                      value={formState.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-400 text-white"
                      placeholder="Hackboot"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                      {t?.contact?.form?.subject || 'Sujet'}
                    </label>
                    <input
                      id="subject"
                      name="subject"
                      value={formState.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-400 text-white"
                      placeholder={t?.contact?.form?.subjectPlaceholder || 'Projet, question, etc.'}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    {t?.contact?.form?.message || 'Message'} *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-400 text-white"
                    placeholder={t?.contact?.form?.messagePlaceholder || 'Décrivez votre besoin'}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-full text-sm font-semibold disabled:opacity-60"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? t?.contact?.form?.sending || 'Envoi en cours...' : t?.contact?.form?.submit || 'Envoyer'}
                </button>

                {submitStatus === 'success' && (
                  <div className="flex items-center gap-2 text-green-400 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    {t?.contact?.form?.success || 'Message envoyé avec succès !'}
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="flex items-center gap-2 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {t?.contact?.form?.error || "Une erreur est survenue, réessayez."}
                  </div>
                )}
              </form>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
