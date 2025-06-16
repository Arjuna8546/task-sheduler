import { useFormik } from 'formik'
import * as Yup from 'yup'
import { login } from '../endpoints/user_api'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setUser } from '../store/slices/UserSlice'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

function LoginPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const dispatch = useDispatch()
    const nav = useNavigate()

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev)
    }
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Email is required'),
            password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
        }),
        onSubmit: async (values) => {
            try {
                setLoading(true)
                const res = await login(values)
                const { success, message, userDetails } = res?.data || {}
                dispatch(setUser(userDetails))
                if (success) {
                    toast.success(message || 'Login successful')
                    nav('/', { replace: true })
                } else {
                    toast.error(message || 'Login failed')
                }
            } catch (err) {
                const errorMessage =
                    err?.response?.data?.message ||
                    'An unexpected error occurred. Please try again.'
                toast.error(errorMessage)
            } finally {
                setLoading(false)
            }
        }
    })

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Login</h2>
                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            className={`mt-1 w-full px-4 py-2 border ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-300'
                                } rounded-lg focus:ring-blue-500 focus:border-blue-500`}
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
                                className={`mt-1 w-full px-4 py-2 border ${formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-gray-300'
                                    } rounded-lg focus:ring-stone-900 focus:border-stone-800 pr-10`}
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

                    <button
                        type="submit"
                        className="w-full bg-black hover:bg-stone-900 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-60"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                    <p className="text-sm text-center text-gray-500 mt-4">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-blue-600 hover:underline">
                            Register
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default LoginPage


