'use client'

import React, { memo } from 'react'
import { Github, Twitter, Linkedin, Mail } from 'lucide-react'
import { useI18n } from '@/lib/i18n-simple'

const socials = [
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Mail, href: '#', label: 'Email' },
]

export default memo(function Footer() {
  const { t } = useI18n()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative py-12 px-4 border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-2xl font-display font-bold mb-4">Hackboot</h3>
            <p className="text-gray-400">{t.footer.description}</p>
          </div>

          {[
            { key: 'product', links: ['features', 'pricing', 'security', 'performance'] },
            { key: 'company', links: ['about', 'careers', 'press', 'partners'] },
            { key: 'resources', links: ['documentation', 'api', 'support', 'status'] },
          ].map(({ key, links }) => (
            <div key={key}>
              <h4 className="font-semibold mb-4">{t.footer.sections[key as keyof typeof t.footer.sections]}</h4>
              <ul className="space-y-2 text-gray-400">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="hover:text-white transition-colors">
                      {t.footer.links[link as keyof typeof t.footer.links]}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10">
          <div className="text-gray-400 mb-4 md:mb-0">
            {t.footer.copyright.replace('{{year}}', currentYear.toString())}
          </div>

          <div className="flex gap-4">
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                className="p-2 glass-effect rounded-full hover:bg-white/10 transition-all"
                aria-label={label}
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
})
