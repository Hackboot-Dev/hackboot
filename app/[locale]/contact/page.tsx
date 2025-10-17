'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react'
import { useI18n } from '@/lib/i18n-simple'
import HeaderFixed from '@/components/HeaderFixed'
import Footer from '@/components/Footer'

export default function ContactPage() {
  const { t } = useI18n()
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitStatus('success')
      setFormState({
        name: '',
        email: '',
        company: '',
        subject: '',
        message: ''
      })

      // Reset status after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle')
      }, 5000)
    }, 2000)
  }

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: t?.contact?.email || 'Email',
      value: 'hello@hackboot.com',
      link: 'mailto:hello@hackboot.com'
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: t?.contact?.phone || 'Phone',
      value: '+372 5555 5555',
      link: 'tel:+37255555555'
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: t?.contact?.address || 'Address',
      value: 'Paju 1a, 50603 Tartu, Estonia',
      link: 'https://maps.google.com/?q=Paju+1a,+50603+Tartu,+Estonia'
    }
  ]

  return (
    <>
      <HeaderFixed />

      <main className="min-h-screen pt-32 pb-20">
        {/* Background Effects */}
        <div className="fixed inset-0 z-0">
          <div className="absolute top-40 -left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-40 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float-delayed" />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.span
              className="inline-block px-4 py-2 glass-effect rounded-full text-sm font-medium mb-4"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="gradient-text">{t?.contact?.badge || 'Get in Touch'}</span>
            </motion.span>

            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              {t?.contact?.title || 'Contact Us'}
            </h1>

            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              {t?.contact?.subtitle || 'We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.'}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Contact Info Cards */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-1 space-y-6"
            >
              {contactInfo.map((item, index) => (
                <motion.a
                  key={item.title}
                  href={item.link}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  whileHover={{ x: 10, scale: 1.02 }}
                  className="block p-6 glass-effect rounded-2xl hover:bg-white/10 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-xl group-hover:scale-110 transition-transform">
                      <div className="text-purple-400">
                        {item.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                      <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                        {item.value}
                      </p>
                    </div>
                  </div>
                </motion.a>
              ))}

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="p-6 glass-effect rounded-2xl"
              >
                <h3 className="font-semibold text-white mb-4">
                  {t?.contact?.followUs || 'Follow Us'}
                </h3>
                <div className="flex gap-3">
                  {['LinkedIn', 'Twitter', 'GitHub'].map((social) => (
                    <motion.a
                      key={social}
                      href="#"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-12 h-12 flex items-center justify-center glass-effect rounded-lg hover:bg-white/10 transition-all"
                    >
                      <span className="text-xs font-medium gradient-text">{social[0]}</span>
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:col-span-2"
            >
              <form onSubmit={handleSubmit} className="glass-effect rounded-3xl p-8">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      {t?.contact?.form?.name || 'Name'} *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formState.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all text-white placeholder-gray-500"
                      placeholder="John Doe"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      {t?.contact?.form?.email || 'Email'} *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formState.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all text-white placeholder-gray-500"
                      placeholder="john@example.com"
                    />
                  </motion.div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                      {t?.contact?.form?.company || 'Company'}
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formState.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all text-white placeholder-gray-500"
                      placeholder="Acme Inc."
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                      {t?.contact?.form?.subject || 'Subject'} *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formState.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all text-white placeholder-gray-500"
                    >
                      <option value="" className="bg-black">{t?.contact?.form?.selectSubject || 'Select a subject'}</option>
                      <option value="general" className="bg-black">{t?.contact?.form?.general || 'General Inquiry'}</option>
                      <option value="support" className="bg-black">{t?.contact?.form?.support || 'Technical Support'}</option>
                      <option value="sales" className="bg-black">{t?.contact?.form?.sales || 'Sales'}</option>
                      <option value="partnership" className="bg-black">{t?.contact?.form?.partnership || 'Partnership'}</option>
                    </select>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="mb-6"
                >
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    {t?.contact?.form?.message || 'Message'} *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formState.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all text-white placeholder-gray-500 resize-none"
                    placeholder={t?.contact?.form?.messagePlaceholder || "Tell us about your project..."}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="flex items-center justify-between"
                >
                  <AnimatePresence mode="wait">
                    {submitStatus === 'success' && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex items-center gap-2 text-green-400"
                      >
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm">{t?.contact?.form?.successMessage || 'Message sent successfully!'}</span>
                      </motion.div>
                    )}
                    {submitStatus === 'error' && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex items-center gap-2 text-red-400"
                      >
                        <AlertCircle className="w-5 h-5" />
                        <span className="text-sm">{t?.contact?.form?.errorMessage || 'Something went wrong. Please try again.'}</span>
                      </motion.div>
                    )}
                    {submitStatus === 'idle' && (
                      <div className="text-sm text-gray-400">
                        * {t?.contact?.form?.required || 'Required fields'}
                      </div>
                    )}
                  </AnimatePresence>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium rounded-full hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        {t?.contact?.form?.sending || 'Sending...'}
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        {t?.contact?.form?.send || 'Send Message'}
                      </>
                    )}
                  </motion.button>
                </motion.div>
              </form>
            </motion.div>
          </div>

          {/* Map Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="mt-20"
          >
            <div className="glass-effect rounded-3xl p-2 overflow-hidden">
              <div className="relative h-96 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-indigo-900/20">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-white mb-2">Tartu, Estonia</h3>
                      <p className="text-gray-400">Paju 1a, 50603 Tartu</p>
                      <p className="text-gray-400 text-sm mt-1">Tartu Maakond, Estonia</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  )
}