import plansData from '@/data/subscriptions.json'

export interface SubscriptionPlan {
  id: string
  name: string
  price: number
  currency: string
  billing: string
  description: string
  features: string[]
  popular?: boolean
}

interface SubscriptionData {
  plans: SubscriptionPlan[]
}

const typedPlans = plansData as SubscriptionData

export const getSubscriptionPlans = (): SubscriptionPlan[] => {
  return typedPlans.plans
}

export const getPlanById = (id: string): SubscriptionPlan | undefined => {
  return typedPlans.plans.find((plan) => plan.id === id)
}
