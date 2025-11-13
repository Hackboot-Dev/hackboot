'use client'

import React, { memo } from 'react'
import Link from 'next/link'
import { Github, Twitter, Linkedin, Mail } from 'lucide-react'
import { useI18n } from '@/lib/i18n-simple'

const socials = [
  { icon: Github, href: 'https://github.com/hackboot', label: 'GitHub' },
  { icon: Twitter, href: 'https://twitter.com/hackboot', label: 'Twitter' },
  { icon: Linkedin, href: 'https://linkedin.com/company/hackboot', label: 'LinkedIn' },
  { icon: Mail, href: 'mailto:contact@hackboot.gg', label: 'Email' },
]

export default memo(function Footer() {
  const { t, locale } = useI18n()
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    product: {
      features: `/${locale}/#features`,
      pricing: `/${locale}/premium`,
      security: `/${locale}/about#security`,
      performance: `/${locale}/about#performance`,
    },
    company: {
      about: `/${locale}/about`,
      careers: `/${locale}/careers`,
    },
    resources: {
      documentation: `/${locale}/documentation`,
      api: `/${locale}/api`,
      support: `/${locale}/support`,
      status: `/${locale}/status`,
    },
    legal: {
      privacy: `/${locale}/legal/privacy`,
      terms: `/${locale}/legal/terms`,
      cookies: `/${locale}/legal/cookies`,
      compliance: `/${locale}/legal/compliance`,
    },
  }

  const sections = [
    { key: 'product', links: ['features', 'pricing', 'security', 'performance'] },
    { key: 'company', links: ['about', 'careers'] },
    { key: 'resources', links: ['documentation', 'api', 'support', 'status'] },
    { key: 'legal', links: ['privacy', 'terms', 'cookies', 'compliance'] },
  ]

  return (
    <footer className="relative py-12 px-4 border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          <div>
            <h3 className="text-2xl font-display font-bold mb-4">Hackboot</h3>
            <p className="text-gray-400">{t.footer.description}</p>
          </div>

          {sections.map(({ key, links }) => (
            <div key={key}>
              <h4 className="font-semibold mb-4">{t.footer.sections[key as keyof typeof t.footer.sections]}</h4>
              <ul className="space-y-2 text-gray-400">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href={footerLinks[key as keyof typeof footerLinks][link as keyof typeof footerLinks.product]}
                      className="hover:text-white transition-colors"
                    >
                      {t.footer.links[link as keyof typeof t.footer.links]}
                    </Link>
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
                target="_blank"
                rel="noopener noreferrer"
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
