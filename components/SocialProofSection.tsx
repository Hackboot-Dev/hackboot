'use client'

import React from 'react'
import { Star, Quote } from 'lucide-react'
import { useI18n } from '@/lib/i18n-simple'

export default function SocialProofSection() {
  const { t } = useI18n()
  const socialProof = t.socialProof || {}
  const testimonials = socialProof.testimonials || []

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-6 py-2 glass-effect rounded-full border border-white/10 text-accent font-semibold mb-4">
            {socialProof.badge || 'Ils nous font confiance'}
          </span>
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-6">
            {socialProof.title || 'Rejoignez des milliers de joueurs satisfaits'}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {socialProof.subtitle || 'Découvrez ce que nos utilisateurs pensent de Hackboot'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.length > 0 ? (
            testimonials.map((testimonial: any, index: number) => (
              <div
                key={index}
                className="group relative"
              >
                <div className="glass-effect rounded-2xl p-6 h-full transition-all duration-300 hover:scale-105 hover:-translate-y-1">
                  <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br from-accent to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Quote className="w-6 h-6 text-white" />
                  </div>

                  <div className="flex items-center gap-1 mb-4 mt-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < (testimonial.rating || 5) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} />
                    ))}
                  </div>

                  <p className="text-gray-300 mb-6 leading-relaxed">
                    "{testimonial.text}"
                  </p>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                      {testimonial.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{testimonial.name}</div>
                      <div className="text-sm text-gray-400">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <>
              {[
                { name: 'Alex M.', role: 'Pro Player', text: 'Hackboot a complètement transformé mon expérience gaming. Performances exceptionnelles et latence minimale.' },
                { name: 'Sarah K.', role: 'Streamer', text: 'La meilleure solution cloud gaming que j\'ai testée. Support réactif et infrastructure ultra-stable.' },
                { name: 'Tom R.', role: 'Esports Team', text: 'Notre équipe utilise Hackboot depuis 6 mois. Zéro problème, performances au rendez-vous. Recommandé à 100%.' }
              ].map((testimonial, index) => (
                <div
                  key={index}
                  className="group relative"
                >
                  <div className="glass-effect rounded-2xl p-6 h-full transition-all duration-300 hover:scale-105 hover:-translate-y-1">
                    <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br from-accent to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Quote className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex items-center gap-1 mb-4 mt-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>

                    <p className="text-gray-300 mb-6 leading-relaxed">
                      "{testimonial.text}"
                    </p>

                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-white">{testimonial.name}</div>
                        <div className="text-sm text-gray-400">{testimonial.role}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-8 glass-effect px-8 py-4 rounded-2xl">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-1">4.9/5</div>
              <div className="text-sm text-gray-400">{socialProof.avgRating || 'Note moyenne'}</div>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-1">5000+</div>
              <div className="text-sm text-gray-400">{socialProof.totalReviews || 'Avis positifs'}</div>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-1">98%</div>
              <div className="text-sm text-gray-400">{socialProof.satisfaction || 'Satisfaction'}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
