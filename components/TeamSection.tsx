'use client'

import { motion } from 'framer-motion'
import { useI18n } from '@/lib/i18n'
import { useState } from 'react'

export default function TeamSection() {
  const { t } = useI18n()
  const [hoveredMember, setHoveredMember] = useState<number | null>(null)

  const teamMembers = t.about.team.members || []

  return (
    <section className="relative py-32 px-4 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 via-black to-purple-900/10" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400
                       bg-clip-text text-transparent">
            {t.about.team.title}
          </h2>
          <p className="text-xl text-gray-300">
            {t.about.team.subtitle}
          </p>
        </motion.div>

        {/* Team Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-4 gap-6 mb-16"
        >
          {t.about.team.stats.map((stat: any, index: number) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-gradient-to-br from-gray-900/80 to-gray-800/80
                       rounded-2xl border border-gray-700 backdrop-blur-xl text-center"
            >
              <div className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400
                           bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Team Members Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onHoverStart={() => setHoveredMember(index)}
              onHoverEnd={() => setHoveredMember(null)}
              whileHover={{ y: -10 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10
                            rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500" />

              <div className="relative p-8 bg-gradient-to-br from-gray-900/90 to-gray-800/90
                            rounded-3xl border border-gray-700 group-hover:border-indigo-500
                            backdrop-blur-xl transition-all duration-500">
                {/* Avatar */}
                <div className="mb-6 relative">
                  <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 p-1">
                    <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                      <span className="text-3xl">{member.avatar}</span>
                    </div>
                  </div>
                  {hoveredMember === index && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2
                               w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                    />
                  )}
                </div>

                {/* Info */}
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-indigo-400 mb-4">{member.role}</p>
                  <p className="text-gray-400 text-sm mb-4">{member.description}</p>

                  {/* Skills */}
                  {member.skills && (
                    <div className="flex flex-wrap gap-2 justify-center">
                      {member.skills.map((skill: string, skillIndex: number) => (
                        <span
                          key={skillIndex}
                          className="px-3 py-1 bg-gradient-to-r from-gray-800 to-gray-700
                                   rounded-full text-xs text-gray-300 border border-gray-600"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Social Links */}
                  {member.social && (
                    <div className="flex justify-center gap-3 mt-4">
                      {member.social.map((social: any, socialIndex: number) => (
                        <motion.a
                          key={socialIndex}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.2 }}
                          className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-800 to-gray-700
                                   flex items-center justify-center text-gray-400 hover:text-white
                                   hover:from-indigo-500 hover:to-purple-500 transition-all"
                        >
                          <span className="text-sm">{social.icon}</span>
                        </motion.a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Join Team CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="p-12 bg-gradient-to-br from-indigo-900/20 to-purple-900/20
                       rounded-3xl border border-indigo-500/20 backdrop-blur-xl">
            <h3 className="text-3xl font-bold mb-4">{t.about.team.join.title}</h3>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              {t.about.team.join.description}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500
                       rounded-full font-semibold text-white hover:shadow-2xl
                       hover:shadow-indigo-500/25 transition-all duration-300"
            >
              {t.about.team.join.button}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}