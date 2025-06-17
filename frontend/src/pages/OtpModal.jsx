import React, { useState } from 'react'
import { verifyotp, resendotp } from '../endpoints/user_api'
import { toast } from 'sonner'


const OtpModal = ({ show, pendingUserData, onClose, onSuccess }) => {
    const [otp, setOtp] = useState('')
    const [loading, setLoading] = useState(false)
    const [resendLoading, setResendLoading] = useState(false)
    const [cooldown, setCooldown] = useState(0)

    if (!show) return null

    const handleVerify = async () => {
        setLoading(true)
        try {
            const res = await verifyotp({ ...pendingUserData, otp })
            const { success, message } = res.data || {}

            if (success) {
                onSuccess?.()
            } else {
                toast.success(message || 'OTP verification failed')
            }
        } catch (err) {
            const msg = err?.response?.data?.message || 'OTP verification failed'
            toast.error(msg)
        } finally {
            setLoading(false)
        }
    }

    const handleResendOtp = async () => {
        setResendLoading(true)
        try {
            const res = await resendotp(pendingUserData)
            const { success, message } = res?.data || {}
            if (success) {
                toast.success(message || 'OTP resent successfully')
                startCooldown()
            } else {
                toast.error('Failed to resend OTP')
            }
        } catch (err) {
            const msg = err?.response?.data?.message || 'Failed to resend OTP'
            toast.error(msg)
        } finally {
            setResendLoading(false)
        }
    }

    const startCooldown = () => {
        setCooldown(30)
        const interval = setInterval(() => {
            setCooldown(prev => {
                if (prev <= 1) {
                    clearInterval(interval)
                    return 0
                }
                return prev - 1
            })
        }, 1000)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-brightness-80 backdrop-blur-2xl ">   
            <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">Verify OTP</h2>
                <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />

                <div className="flex justify-between items-center text-sm">
                    <button
                        onClick={handleResendOtp}
                        disabled={resendLoading || cooldown > 0}
                        className={`text-blue-600 hover:underline disabled:text-gray-400`}
                    >
                        {resendLoading
                            ? 'Resending...'
                            : cooldown > 0
                                ? `Resend OTP in ${cooldown}s`
                                : 'Resend OTP'}
                    </button>
                </div>

                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleVerify}
                        disabled={loading}
                        className={`px-4 py-2 rounded-lg text-white ${loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-black hover:bg-stone-900'
                            }`}
                    >
                        {loading ? 'Verifying...' : 'Verify'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default OtpModal
