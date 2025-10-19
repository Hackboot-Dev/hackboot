'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle } from 'lucide-react'

interface TimelineStep {
  id: string
  title: string
  description: string
}

interface InteractiveTimelineProps {
  steps: TimelineStep[]
}

export default function InteractiveTimeline({ steps }: InteractiveTimelineProps) {
  const [activeStep, setActiveStep] = useState(0)

  return (
    <div className="space-y-8">
      {/* Timeline Bar */}
      <div className="relative">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center flex-1">
              <motion.button
                onClick={() => setActiveStep(index)}
                className={`relative z-10 w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
                  index <= activeStep
                    ? 'border-purple-500 bg-gradient-to-br from-purple-500 to-cyan-600'
                    : 'border-white/20 bg-black/50'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {index < activeStep ? (
                  <CheckCircle className="w-6 h-6 text-white" />
                ) : (
                  <span className="text-white font-bold">{index + 1}</span>
                )}
              </motion.button>

              <div className="mt-3 text-center">
                <div
                  className={`text-sm font-bold ${
                    index === activeStep ? 'text-purple-400' : 'text-gray-500'
                  }`}
                >
                  {step.title}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress Line */}
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-white/10 -z-10">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-cyan-600"
            initial={{ width: '0%' }}
            animate={{
              width: `${(activeStep / (steps.length - 1)) * 100}%`,
            }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="glass-effect rounded-2xl p-8 border border-white/10"
        >
          <h3 className="text-2xl font-black text-white mb-4">
            {steps[activeStep].title}
          </h3>
          <p className="text-gray-300 leading-relaxed">
            {steps[activeStep].description}
          </p>

          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
              disabled={activeStep === 0}
              className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-medium"
            >
              Précédent
            </button>
            <button
              onClick={() =>
                setActiveStep(Math.min(steps.length - 1, activeStep + 1))
              }
              disabled={activeStep === steps.length - 1}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-600 hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-medium"
            >
              Suivant
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
