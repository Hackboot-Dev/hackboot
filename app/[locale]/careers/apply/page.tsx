'use client';

import { useState, useEffect } from 'react';
import { motion as m } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import ApplicationForm from '@/components/careers/ApplicationForm';

interface Translations {
  careers: {
    apply: {
      title: string;
      subtitle: string;
      description: string;
    };
  };
}

export default function ApplyPage({ params }: { params: { locale: string } }) {
  const [translations, setTranslations] = useState<Translations | null>(null);

  useEffect(() => {
    import(`@/public/locales/${params.locale}/common.json`)
      .then((module) => setTranslations(module.default))
      .catch(() => {
        import('@/public/locales/fr/common.json')
          .then((module) => setTranslations(module.default));
      });
  }, [params.locale]);

  if (!translations) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  const t = translations.careers.apply;

  return (
    <div className="min-h-screen bg-black text-white py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-violet-600 bg-clip-text text-transparent">
            {t.title}
          </h1>
          <p className="text-xl text-purple-400 mb-4">{t.subtitle}</p>
          <p className="text-gray-400 max-w-2xl mx-auto">{t.description}</p>
        </m.div>

        {/* Form Component */}
        <ApplicationForm
          locale={params.locale}
          isSpontaneous={true}
        />
      </div>
    </div>
  );
}
