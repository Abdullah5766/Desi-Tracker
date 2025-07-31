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
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useAuthStore } from '../stores/authStore'
import Modal from '../components/common/Modal'
import LoadingSpinner from '../components/common/LoadingSpinner'
import heroImage from '../assets/abdimg-removebg-preview.png'

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

const slideInLeft = {
  initial: { opacity: 0, x: -60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
}

const slideInRight = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
}

const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: "easeOut" }
}

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
      <motion.nav 
        className="bg-gray-800 border-b border-gray-700"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <ChefHat className="h-8 w-8 text-purple-400" />
              <span className="text-2xl font-bold text-gradient">DesiTracker</span>
            </motion.div>
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
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
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-20 pb-24 px-4 sm:px-6 lg:px-8 relative">
        {/* Bottom shadow gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-800 via-gray-900/50 to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <motion.div 
              className="text-center lg:text-left"
              variants={slideInLeft}
              initial="initial"
              animate="animate"
            >
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Track Your{' '}
                <span className="text-gradient">Desi Lifestyle</span>
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-300 mb-8 max-w-2xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                The first fitness app designed specifically for Pakistani and Desi households. 
                Track calories, nutrition, and fitness goals with foods you actually eat.
              </motion.p>
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                <motion.button
                  onClick={handleGetStarted}
                  className="btn-primary text-lg px-8 py-3 flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Get Started</span>
                  <ArrowRight size={20} />
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Right Column - Hero Image */}
            <motion.div 
              className="relative order-first lg:order-last flex justify-center items-start"
              variants={slideInRight}
              initial="initial"
              animate="animate"
            >
              <motion.img
                src={heroImage} 
                alt="DesiTracker App Preview"
                className="w-full h-auto object-contain max-h-[70vh] max-w-full"
                style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))' }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.4 }}
                whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            className="text-3xl font-bold text-center text-white mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            Built for <span className="text-gradient">Desi Families</span>
          </motion.h2>
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
          >
            <FeatureCard
              icon={<ChefHat className="h-8 w-8 text-purple-400" />}
              title="Desi Food Database"
              description="Comprehensive database of Pakistani and South Asian foods with accurate nutrition data"
            />
            <FeatureCard
              icon={<Target className="h-8 w-8 text-purple-400" />}
              title="Smart Calorie Calculator"
              description="Calculate your daily calorie needs using the proven and most efficient method"
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
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <h2 className="text-3xl font-bold text-white mb-6">
                Why <span className="text-gradient">DesiTracker?</span>
              </h2>
              <motion.div 
                className="space-y-4"
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, margin: "-50px" }}
              >
                <BenefitItem text="Track Desi foods accurately" />
                <BenefitItem text="Portion sizes that match real Pakistani servings" />
                <BenefitItem text="Calculate calories for weight loss, maintenance, or gain" />
                <BenefitItem text="Track your weekly and monthly progress" />
                <BenefitItem text="Suggested Meal Plans" />
              </motion.div>
              <motion.button
                onClick={handleGetStarted}
                className="btn-primary mt-8 text-lg px-8 py-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true, margin: "-100px" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Tracking Today
              </motion.button>
            </motion.div>
            <motion.div 
              className="bg-gray-800 rounded-lg p-8 border border-gray-700"
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <h3 className="text-xl font-semibold text-white mb-4">Sample Foods</h3>
              <motion.div 
                className="space-y-3"
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, margin: "-50px" }}
              >
                <FoodSample name="Roti" calories="265 cal per 100g" />
                <FoodSample name="Naan" calories="275 cal per 100g" />
                <FoodSample name="Goat Meat(Raan)" calories="122 cal per 100g" />
                <FoodSample name="Desi Ghee" calories="124 cal per tbsp (14g)" />
                <FoodSample name="Goat Ribs" calories="180 cal per 100g" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-purple">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            className="text-3xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            Ready to Start Your Fitness Journey?
          </motion.h2>
          <motion.p 
            className="text-xl text-purple-100 mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            Join thousands of Desi families already tracking their health goals with DesiTracker.
          </motion.p>
          <motion.button
            onClick={handleGetStarted}
            className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true, margin: "-100px" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started Free
          </motion.button>
        </div>
      </section>

      {/* Footer */}
      <motion.footer 
        className="bg-gray-800 border-t border-gray-700 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            className="flex items-center justify-center space-x-2 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <ChefHat className="h-6 w-6 text-purple-400" />
            <span className="text-xl font-bold text-gradient">DesiTracker</span>
          </motion.div>
          <motion.p 
            className="text-gray-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Built with ❤️ for the Desi community
          </motion.p>
        </div>
      </motion.footer>

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
  <motion.div 
    className="text-center p-6 rounded-lg bg-gray-700 border border-gray-600"
    variants={fadeInUp}
    whileHover={{ 
      scale: 1.05,
      transition: { duration: 0.2 }
    }}
  >
    <motion.div 
      className="flex justify-center mb-4"
      initial={{ scale: 0 }}
      whileInView={{ scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      viewport={{ once: true }}
    >
      {icon}
    </motion.div>
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </motion.div>
)

const BenefitItem = ({ text }) => (
  <motion.div 
    className="flex items-start space-x-3"
    variants={fadeInUp}
  >
    <motion.div
      initial={{ scale: 0 }}
      whileInView={{ scale: 1 }}
      transition={{ duration: 0.3 }}
      viewport={{ once: true }}
    >
      <CheckCircle className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
    </motion.div>
    <span className="text-gray-300">{text}</span>
  </motion.div>
)

const FoodSample = ({ name, calories }) => (
  <motion.div 
    className="flex justify-between items-center py-2 border-b border-gray-600 last:border-b-0"
    variants={fadeInUp}
    whileHover={{ 
      x: 5,
      transition: { duration: 0.2 }
    }}
  >
    <span className="text-gray-300">{name}</span>
    <span className="text-purple-400 font-medium">{calories}</span>
  </motion.div>
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