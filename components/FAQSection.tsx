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
                  question: 'Comment fonctionne la sécurité et la protection anti-détection ?',
                  answer: 'Nos systèmes utilisent des technologies de protection avancées incluant le chiffrement bout-en-bout, l\'isolation des processus et des méthodes de contournement sophistiquées. Nous mettons à jour nos protections en continu pour rester compatibles avec les dernières versions des anti-cheats. Chaque session est sécurisée et anonymisée.'
                },
                {
                  question: 'Puis-je annuler mon abonnement à tout moment ?',
                  answer: 'Oui, vous pouvez annuler votre abonnement à tout moment sans engagement ni frais cachés. Votre accès reste actif jusqu\'à la fin de la période déjà payée. L\'annulation se fait en quelques clics depuis votre espace client.'
                },
                {
                  question: 'Quel matériel est nécessaire pour utiliser Hackboot ?',
                  answer: 'Une connexion internet stable (minimum 20 Mbps recommandé) est indispensable. Côté matériel, une configuration PC de bureau classique suffit : processeur Intel i5/Ryzen 5 (ou équivalent), 8 Go de RAM, carte graphique GTX 1060 / RX 580 ou supérieure. Nos services sont optimisés pour fonctionner sur du matériel standard.'
                },
                {
                  question: 'Comment fonctionne le support client ?',
                  answer: 'Le support client est accessible via notre page Contact. Il est principalement réservé aux abonnés actifs avec un temps de réponse prioritaire. Les non-abonnés peuvent également nous contacter, mais avec un délai de réponse moins réactif. Rendez-vous sur la page Contact pour nous joindre.'
                },
                {
                  question: 'Y a-t-il une période d\'essai gratuite ?',
                  answer: 'Non, nous ne proposons pas de période d\'essai gratuite. Cependant, nos formules d\'abonnement sont flexibles et vous pouvez annuler à tout moment. Nous recommandons de commencer avec une formule adaptée à vos besoins pour tester nos services.'
                },
                {
                  question: 'Comment installer et commencer à utiliser Hackboot ?',
                  answer: 'Après souscription, vous recevrez un accès à votre espace client avec toutes les instructions détaillées. L\'installation est simple et guidée étape par étape. Vous aurez accès à nos tutoriels, documentation et support pour vous accompagner dans vos premiers pas.'
                },
                {
                  question: 'Puis-je utiliser mon abonnement sur plusieurs PC ?',
                  answer: 'Cela dépend de votre formule d\'abonnement. Certains packs permettent l\'utilisation sur plusieurs machines, tandis que d\'autres sont liés à une configuration matérielle spécifique. Consultez les détails de chaque formule ou contactez-nous pour plus d\'informations.'
                },
                {
                  question: 'Que se passe-t-il en cas de mise à jour du jeu ou de l\'anti-cheat ?',
                  answer: 'Notre équipe surveille en permanence les mises à jour des jeux et anti-cheats. Nous déployons des correctifs et mises à jour dans les plus brefs délais pour maintenir la compatibilité. Les abonnés sont informés automatiquement des mises à jour disponibles via l\'espace client.'
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
