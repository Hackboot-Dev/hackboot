'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion as m } from 'framer-motion';
import {
  User, Briefcase, FileText, MapPin, Phone, Mail,
  Calendar, DollarSign, Link as LinkIcon, MessageSquare,
  Upload, CheckCircle, AlertCircle, Loader2
} from 'lucide-react';

interface Translations {
  careers: {
    apply: {
      title: string;
      subtitle: string;
      description: string;
      form: {
        personalInfo: {
          title: string;
          firstName: string;
          firstNamePlaceholder: string;
          lastName: string;
          lastNamePlaceholder: string;
          email: string;
          emailPlaceholder: string;
          phone: string;
          phonePlaceholder: string;
          location: string;
          locationPlaceholder: string;
        };
        jobInfo: {
          title: string;
          position: string;
          positionPlaceholder: string;
          department: string;
          departmentPlaceholder: string;
          startDate: string;
          startDatePlaceholder: string;
        };
        application: {
          title: string;
          cv: string;
          cvHelp: string;
          motivation: string;
          motivationPlaceholder: string;
          salary: string;
          salaryPlaceholder: string;
          portfolio: string;
          portfolioPlaceholder: string;
        };
        additional: {
          title: string;
          remote: string;
          remoteOptions: {
            full: string;
            hybrid: string;
            office: string;
          };
          availability: string;
          availabilityPlaceholder: string;
          message: string;
          messagePlaceholder: string;
        };
        consent: {
          gdpr: string;
          newsletter: string;
        };
        submit: string;
        submitting: string;
        success: {
          title: string;
          message: string;
          cta: string;
        };
        errors: {
          required: string;
          email: string;
          fileSize: string;
          fileType: string;
          general: string;
        };
      };
    };
  };
}

export default function ApplyPage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    position: '',
    department: '',
    startDate: '',
    motivation: '',
    salary: '',
    portfolio: '',
    remote: 'full',
    availability: '',
    message: '',
    gdpr: false,
    newsletter: false,
  });

  const [translations, setTranslations] = useState<Translations | null>(null);

  useState(() => {
    import(`@/public/locales/${params.locale}/common.json`)
      .then((module) => setTranslations(module.default))
      .catch(() => {
        import('@/public/locales/fr/common.json')
          .then((module) => setTranslations(module.default));
      });
  });

  if (!translations) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  const t = translations.careers.apply;

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError(t.form.errors.fileType);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(t.form.errors.fileSize);
      return;
    }

    setCvFile(file);
    setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.gdpr) {
      setError(t.form.errors.required);
      setLoading(false);
      return;
    }

    if (!cvFile) {
      setError(t.form.errors.required);
      setLoading(false);
      return;
    }

    try {
      const reader = new FileReader();
      reader.readAsDataURL(cvFile);

      reader.onload = async () => {
        const cvBase64 = reader.result as string;

        const response = await fetch('/api/careers/apply', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            cv: cvBase64,
            cvFileName: cvFile.name,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to submit application');
        }

        setSuccess(true);
        setLoading(false);
      };

      reader.onerror = () => {
        setError(t.form.errors.general);
        setLoading(false);
      };
    } catch (err) {
      setError(t.form.errors.general);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <m.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full text-center"
        >
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-4">{t.form.success.title}</h1>
          <p className="text-xl text-gray-400 mb-8">{t.form.success.message}</p>
          <button
            onClick={() => router.push(`/${params.locale}/careers`)}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-violet-600 rounded-lg font-semibold hover:from-purple-700 hover:to-violet-700 transition-all"
          >
            {t.form.success.cta}
          </button>
        </m.div>
      </div>
    );
  }

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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Info */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <User className="w-6 h-6 text-purple-400" />
              {t.form.personalInfo.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t.form.personalInfo.firstName} *
                </label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder={t.form.personalInfo.firstNamePlaceholder}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t.form.personalInfo.lastName} *
                </label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder={t.form.personalInfo.lastNamePlaceholder}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {t.form.personalInfo.email} *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={t.form.personalInfo.emailPlaceholder}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {t.form.personalInfo.phone}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder={t.form.personalInfo.phonePlaceholder}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {t.form.personalInfo.location}
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder={t.form.personalInfo.locationPlaceholder}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>
          </m.div>

          {/* Job Info */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Briefcase className="w-6 h-6 text-purple-400" />
              {t.form.jobInfo.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t.form.jobInfo.position} *
                </label>
                <input
                  type="text"
                  name="position"
                  required
                  value={formData.position}
                  onChange={handleInputChange}
                  placeholder={t.form.jobInfo.positionPlaceholder}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t.form.jobInfo.department}
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  placeholder={t.form.jobInfo.departmentPlaceholder}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {t.form.jobInfo.startDate}
                </label>
                <input
                  type="text"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  placeholder={t.form.jobInfo.startDatePlaceholder}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>
          </m.div>

          {/* Application */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <FileText className="w-6 h-6 text-purple-400" />
              {t.form.application.title}
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  {t.form.application.cv} *
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white file:cursor-pointer hover:file:bg-purple-700"
                />
                <p className="text-xs text-gray-500 mt-2">{t.form.application.cvHelp}</p>
                {cvFile && (
                  <p className="text-sm text-green-400 mt-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    {cvFile.name}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t.form.application.motivation} *
                </label>
                <textarea
                  name="motivation"
                  required
                  rows={6}
                  value={formData.motivation}
                  onChange={handleInputChange}
                  placeholder={t.form.application.motivationPlaceholder}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition-colors resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  {t.form.application.salary} *
                </label>
                <input
                  type="text"
                  name="salary"
                  required
                  value={formData.salary}
                  onChange={handleInputChange}
                  placeholder={t.form.application.salaryPlaceholder}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <LinkIcon className="w-4 h-4" />
                  {t.form.application.portfolio}
                </label>
                <input
                  type="url"
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleInputChange}
                  placeholder={t.form.application.portfolioPlaceholder}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>
          </m.div>

          {/* Additional */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-purple-400" />
              {t.form.additional.title}
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3">
                  {t.form.additional.remote}
                </label>
                <div className="flex flex-wrap gap-4">
                  {['full', 'hybrid', 'office'].map((option) => (
                    <label key={option} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="remote"
                        value={option}
                        checked={formData.remote === option}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                      />
                      <span>{t.form.additional.remoteOptions[option as keyof typeof t.form.additional.remoteOptions]}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t.form.additional.availability}
                </label>
                <input
                  type="text"
                  name="availability"
                  value={formData.availability}
                  onChange={handleInputChange}
                  placeholder={t.form.additional.availabilityPlaceholder}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t.form.additional.message}
                </label>
                <textarea
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder={t.form.additional.messagePlaceholder}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition-colors resize-none"
                />
              </div>
            </div>
          </m.div>

          {/* Consent */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="gdpr"
                checked={formData.gdpr}
                onChange={handleInputChange}
                className="w-5 h-5 mt-1 text-purple-600 rounded focus:ring-purple-500"
              />
              <span className="text-sm text-gray-300">{t.form.consent.gdpr}</span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="newsletter"
                checked={formData.newsletter}
                onChange={handleInputChange}
                className="w-5 h-5 mt-1 text-purple-600 rounded focus:ring-purple-500"
              />
              <span className="text-sm text-gray-300">{t.form.consent.newsletter}</span>
            </label>
          </m.div>

          {/* Error */}
          {error && (
            <m.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </m.div>
          )}

          {/* Submit */}
          <m.button
            type="submit"
            disabled={loading}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-violet-600 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-violet-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {t.form.submitting}
              </>
            ) : (
              t.form.submit
            )}
          </m.button>
        </form>
      </div>
    </div>
  );
}
