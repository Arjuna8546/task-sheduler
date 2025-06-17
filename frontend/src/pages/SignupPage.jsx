import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'sonner'
import { useState } from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { signup, verifyotp } from '../endpoints/user_api'
import OtpModal from './OtpModal'


function SignUpPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [showOtpModal, setShowOtpModal] = useState(false)
    const [pendingUserData, setPendingUserData] = useState(null)
    const [loading, setLoading] = useState(false)

    const togglePasswordVisibility = () => setShowPassword(prev => !prev)
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(prev => !prev)

    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Username is required'),
            email: Yup.string().email('Invalid email address').required('Email is required'),
            password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
                .required('Confirm password is required'),
        }),
        onSubmit: async (values) => {
            try {
                setLoading(true)
                const res = await signup(values)
                const { success, message } = res?.data || {}

                if (success) {
                    toast.success(message || 'OTP sent to email')
                    setPendingUserData(values)
                    setShowOtpModal(true)
                } else {
                    toast.error(message || 'Signup failed')
                }
            } catch (err) {
                const errors = err?.response?.data?.errors

                if (errors && typeof errors === 'object') {
                    Object.entries(errors).forEach(([field, messages]) => {
                        messages.forEach((msg) => {
                            toast.error(` ${msg}`)
                        })
                    })
                } else {
                    toast.error('An unexpected error occurred. Please try again.')
                }
            } finally {
                setLoading(false)
            }
        }
    })

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Create an Account</h2>
                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            name="username"
                            placeholder="Enter your username"
                            className={`mt-1 w-full px-4 py-2 border ${formik.touched.username && formik.errors.username ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-blue-500 focus:border-blue-500`}
                            value={formik.values.username}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.username && formik.errors.username && (
                            <p className="text-red-500 text-sm mt-1">{formik.errors.username}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            className={`mt-1 w-full px-4 py-2 border ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-blue-500 focus:border-blue-500`}
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.email && formik.errors.email && (
                            <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="Enter your password"
                                className={`mt-1 w-full px-4 py-2 border ${formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-blue-500 focus:border-blue-500 pr-10`}
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            <div
                                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-600"
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                            </div>
                        </div>
                        {formik.touched.password && formik.errors.password && (
                            <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                placeholder="Confirm your password"
                                className={`mt-1 w-full px-4 py-2 border ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-blue-500 focus:border-blue-500 pr-10`}
                                value={formik.values.confirmPassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            <div
                                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-600"
                                onClick={toggleConfirmPasswordVisibility}
                            >
                                {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                            </div>
                        </div>
                        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">{formik.errors.confirmPassword}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-black hover:bg-stone-900 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-60"
                        disabled={loading}
                    >
                        {loading ? 'Siging up...' : 'Sign up'}
                    </button>
                    <p className="text-sm text-center text-gray-500 mt-4">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-600 hover:underline">
                            Login
                        </Link>
                    </p>
                </form>
            </div>
            <OtpModal
                show={showOtpModal}
                pendingUserData={pendingUserData}
                onClose={() => setShowOtpModal(false)}
                onSuccess={() => {
                    toast.success("Account created successfully")
                    setShowOtpModal(false)
                    nav('/login', { replace: true })
                }}
            />
        </div>
    )
}

export default SignUpPage
