import { useState } from 'react'
import { 
  Target, 
  TrendingUp, 
  Users, 
  ChefHat,
  ArrowRight,
  Star,
  CheckCircle
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore } from '../stores/authStore'
import Modal from '../components/common/Modal'
import LoadingSpinner from '../components/common/LoadingSpinner'

const LandingPage = () => {
  const { login, register, isLoading } = useAuthStore()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false)

  const handleGetStarted = () => {
    setIsSignupModalOpen(true)
  }

  const handleLogin = () => {
    setIsLoginModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <ChefHat className="h-8 w-8 text-purple-400" />
              <span className="text-2xl font-bold text-gradient">DesiTracker</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogin}
                className="btn-outline text-sm"
              >
                Sign In
              </button>
              <button
                onClick={handleGetStarted}
                className="btn-primary text-sm"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Track Your{' '}
            <span className="text-gradient">Desi Lifestyle</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            The first fitness app designed specifically for Pakistani and Desi households. 
            Track calories, nutrition, and fitness goals with foods you actually eat.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleGetStarted}
              className="btn-primary text-lg px-8 py-3 flex items-center space-x-2"
            >
              <span>Get Started</span>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Built for <span className="text-gradient">Desi Families</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<ChefHat className="h-8 w-8 text-purple-400" />}
              title="Desi Food Database"
              description="Comprehensive database of Pakistani and South Asian foods with accurate nutrition data"
            />
            <FeatureCard
              icon={<Target className="h-8 w-8 text-purple-400" />}
              title="Smart Calorie Calculator"
              description="Calculate your daily calorie needs using the proven Mifflin-St Jeor formula"
            />
            <FeatureCard
              icon={<TrendingUp className="h-8 w-8 text-purple-400" />}
              title="Progress Tracking"
              description="Monitor your daily intake, macros, and progress towards your fitness goals"
            />
            <FeatureCard
              icon={<Users className="h-8 w-8 text-purple-400" />}
              title="Family-Friendly"
              description="Designed with Pakistani households in mind, from portion sizes to meal planning"
            />
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">
                Why <span className="text-gradient">DesiTracker?</span>
              </h2>
              <div className="space-y-4">
                <BenefitItem text="Track biryani, karahi, dal, and other Desi foods accurately" />
                <BenefitItem text="Portion sizes that match real Pakistani servings" />
                <BenefitItem text="Calculate calories for weight loss, maintenance, or gain" />
                <BenefitItem text="Simple, beautiful interface designed for daily use" />
                <BenefitItem text="Free to use with no hidden fees" />
              </div>
              <button
                onClick={handleGetStarted}
                className="btn-primary mt-8 text-lg px-8 py-3"
              >
                Start Tracking Today
              </button>
            </div>
            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4">Sample Foods</h3>
              <div className="space-y-3">
                <FoodSample name="Chicken Biryani" calories="290 cal per plate" />
                <FoodSample name="Dal Chawal" calories="185 cal per bowl" />
                <FoodSample name="Karahi Chicken" calories="195 cal per serving" />
                <FoodSample name="Aloo Paratha" calories="320 cal per paratha" />
                <FoodSample name="Seekh Kebab" calories="285 cal per 2 pieces" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-purple">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Start Your Fitness Journey?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join thousands of Desi families already tracking their health goals with DesiTracker.
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
          >
            Get Started Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <ChefHat className="h-6 w-6 text-purple-400" />
            <span className="text-xl font-bold text-gradient">DesiTracker</span>
          </div>
          <p className="text-gray-400">
            Built with ❤️ for the Desi community
          </p>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSignupClick={() => {
          setIsLoginModalOpen(false)
          setIsSignupModalOpen(true)
        }}
      />

      {/* Signup Modal */}
      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
        onLoginClick={() => {
          setIsSignupModalOpen(false)
          setIsLoginModalOpen(true)
        }}
      />
    </div>
  )
}

const FeatureCard = ({ icon, title, description }) => (
  <div className="text-center p-6 rounded-lg bg-gray-700 border border-gray-600">
    <div className="flex justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </div>
)

const BenefitItem = ({ text }) => (
  <div className="flex items-start space-x-3">
    <CheckCircle className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
    <span className="text-gray-300">{text}</span>
  </div>
)

const FoodSample = ({ name, calories }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-600 last:border-b-0">
    <span className="text-gray-300">{name}</span>
    <span className="text-purple-400 font-medium">{calories}</span>
  </div>
)

const LoginModal = ({ isOpen, onClose, onSignupClick }) => {
  const { login, isLoading } = useAuthStore()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await login(formData.email, formData.password)
    if (result.success) {
      onClose()
      setFormData({ email: '', password: '' })
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sign In to DesiTracker">
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full flex items-center justify-center space-x-2"
          >
            {isLoading ? <LoadingSpinner size="sm" /> : <span>Sign In</span>}
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <button
              onClick={onSignupClick}
              className="text-purple-400 hover:text-purple-300 font-medium"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </Modal>
  )
}

const SignupModal = ({ isOpen, onClose, onLoginClick }) => {
  const { register, isLoading } = useAuthStore()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    const result = await register(formData.username, formData.email, formData.password)
    if (result.success) {
      onClose()
      setFormData({ username: '', email: '', password: '', confirmPassword: '' })
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Join DesiTracker">
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="input"
              placeholder="Choose a username"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input"
              placeholder="Choose a password"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input"
              placeholder="Confirm your password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full flex items-center justify-center space-x-2"
          >
            {isLoading ? <LoadingSpinner size="sm" /> : <span>Create Account</span>}
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Already have an account?{' '}
            <button
              onClick={onLoginClick}
              className="text-purple-400 hover:text-purple-300 font-medium"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </Modal>
  )
}

export default LandingPage