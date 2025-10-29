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
                  question: 'Est-ce que Hackboot est légal ?',
                  answer: 'Oui, Hackboot opère sous juridiction estonienne où le développement et l\'utilisation de modifications de jeux sont entièrement légaux. Nous respectons strictement toutes les lois en vigueur et sommes une entreprise enregistrée et licenciée en Estonie (VMCloud Group OÜ).'
                },
                {
                  question: 'Quels jeux sont supportés ?',
                  answer: 'Nous supportons plus de 10 jeux populaires incluant Valorant, Apex Legends, Overwatch 2, Fortnite, Call of Duty Warzone, CS2, Rainbow Six Siege, PUBG et Rust. De nouveaux titres sont ajoutés régulièrement.'
                },
                {
                  question: 'Comment fonctionne la sécurité ?',
                  answer: 'Nous utilisons une protection multi-couches kernel-level avec HWID spoofer intégré. Notre technologie est indétectable avec 0% de détection sur toutes les plateformes. Chiffrement E2E et monitoring 24/7 pour garantir votre sécurité.'
                },
                {
                  question: 'Puis-je annuler mon abonnement à tout moment ?',
                  answer: 'Oui, vous pouvez annuler votre abonnement à tout moment sans frais cachés ni engagement. Votre accès reste actif jusqu\'à la fin de la période payée.'
                },
                {
                  question: 'Quel matériel est nécessaire ?',
                  answer: 'Aucun matériel spécifique requis ! Hackboot fonctionne entièrement dans le cloud. Vous avez juste besoin d\'une connexion internet stable (minimum 10 Mbps) et d\'un navigateur moderne.'
                },
                {
                  question: 'Comment fonctionne le support client ?',
                  answer: 'Notre support est disponible 24/7 via Discord, email et WhatsApp. Temps de réponse moyen sous 5 minutes. Pour les clients premium, un account manager dédié est disponible.'
                },
                {
                  question: 'Y a-t-il une période d\'essai ?',
                  answer: 'Nous proposons différentes formules adaptées à tous les besoins. Vous pouvez commencer avec notre Pack Essentiel à partir de 27,90€/mois pour tester nos services avant de passer à une formule supérieure.'
                },
                {
                  question: 'Quelles sont les performances attendues ?',
                  answer: 'Nos serveurs équipés de RTX 4090 et i9-13900K offrent des performances exceptionnelles : 240+ FPS en 1080p, latence <5ms, et 99.9% d\'uptime garanti. Les performances varient selon votre formule choisie.'
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
