'use client'

import React, { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'
import { useI18n } from '@/lib/i18n-simple'

export default function FAQSection() {
  const { t } = useI18n()
  const faq = t.faq || {}
  const questions = faq.questions || []
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/30 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-6 py-2 glass-effect rounded-full border border-white/10 text-accent font-semibold mb-4">
            {faq.badge || 'Questions fréquentes'}
          </span>
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-6">
            {faq.title || 'Vous avez des questions ?'}
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {faq.subtitle || 'Trouvez rapidement les réponses aux questions les plus courantes'}
          </p>
        </div>

        <div className="space-y-4">
          {questions.length > 0 ? (
            questions.map((item: any, index: number) => (
              <div
                key={index}
                className="glass-effect rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg"
              >
                <button
                  onClick={() => toggleQuestion(index)}
                  className="w-full p-6 flex items-start justify-between gap-4 text-left transition-colors duration-300 hover:bg-white/5"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center flex-shrink-0">
                      <HelpCircle className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {item.question}
                      </h3>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-6 h-6 text-accent transition-transform duration-300 flex-shrink-0 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <div
                  className={`grid transition-all duration-300 ${
                    openIndex === index ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div className="px-6 pb-6 pl-20">
                      <p className="text-gray-300 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <>
              {[
                {
                  question: 'Quels sont les jeux disponibles sur Hackboot ?',
                  answer: 'Hackboot supporte plus de 10 jeux populaires incluant des FPS compétitifs, des jeux de tir tactiques et des battle royales. Vous pouvez consulter la liste complète des jeux supportés sur notre page Games. Chaque jeu dispose de fonctionnalités optimisées et régulièrement mises à jour.'
                },
                {
                  question: 'Quelles sont les différentes formules d\'abonnement Premium ?',
                  answer: 'Nous proposons trois formules Premium : Basic (accès standard aux features essentielles), Pro (fonctionnalités avancées + support prioritaire) et Elite (accès complet + développement custom). Les prix et détails sont disponibles sur notre page Premium. Tous les abonnements sont sans engagement.'
                },
                {
                  question: 'Comment puis-je contacter le support technique ?',
                  answer: 'Notre support est accessible 24/7 via la page Contact du site. Les abonnés Premium bénéficient d\'un temps de réponse prioritaire et d\'une assistance dédiée. Vous pouvez également utiliser le chatbot intégré au site pour obtenir des réponses instantanées aux questions courantes.'
                },
                {
                  question: 'Quelles sont les fonctionnalités principales de Hackboot ?',
                  answer: 'Hackboot offre des systèmes de sécurité avancés, une infrastructure cloud ultra-rapide (<5ms de latence), des mises à jour automatiques en temps réel, un support client disponible 24/7, et une interface optimisée pour les performances. Consultez notre page Services pour plus de détails sur chaque fonctionnalité.'
                },
                {
                  question: 'Est-ce que Hackboot garantit la sécurité de mes données ?',
                  answer: 'Oui, la sécurité est notre priorité absolue. Nous utilisons un chiffrement de niveau militaire, une protection DDoS avancée, des systèmes anti-détection sophistiqués et une authentification multi-facteurs. Toutes vos données sont protégées et anonymisées. Plus d\'infos sur notre page About.'
                },
                {
                  question: 'Comment se déroule l\'inscription sur Hackboot ?',
                  answer: 'L\'inscription est simple et rapide : créez votre compte via la page Login, choisissez votre formule Premium sur la page dédiée, et accédez instantanément à votre espace membre. Le processus est entièrement guidé et sécurisé. Aucune information bancaire n\'est stockée sur nos serveurs.'
                },
                {
                  question: 'Quelle est la latence moyenne du service ?',
                  answer: 'Hackboot garantit une latence moyenne inférieure à 5ms grâce à notre infrastructure cloud distribuée mondialement. Nous disposons de serveurs dans plusieurs régions pour assurer des performances optimales quel que soit votre emplacement géographique.'
                },
                {
                  question: 'Les mises à jour sont-elles automatiques ?',
                  answer: 'Oui, toutes les mises à jour sont automatiques et déployées en temps réel sans interruption de service. Notre système de mise à jour intelligente garantit une compatibilité permanente avec les dernières versions des jeux et des systèmes de sécurité, avec un uptime garanti de 99.9%.'
                }
              ].map((item, index) => (
                <div
                  key={index}
                  className="glass-effect rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg"
                >
                  <button
                    onClick={() => toggleQuestion(index)}
                    className="w-full p-6 flex items-start justify-between gap-4 text-left transition-colors duration-300 hover:bg-white/5"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center flex-shrink-0">
                        <HelpCircle className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {item.question}
                        </h3>
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-6 h-6 text-accent transition-transform duration-300 flex-shrink-0 ${
                        openIndex === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <div
                    className={`grid transition-all duration-300 ${
                      openIndex === index ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    }`}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <div className="px-6 pb-6 pl-20">
                        <p className="text-gray-300 leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-400 mb-4">
            {faq.moreQuestions || 'Vous avez d\'autres questions ?'}
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-accent to-purple-600 text-white font-bold rounded-full hover:scale-105 transition-transform shadow-lg shadow-accent/30">
            {faq.contactButton || 'Contactez notre support'}
          </button>
        </div>
      </div>
    </section>
  )
}
