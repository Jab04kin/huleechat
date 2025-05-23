import {useEffect} from 'react'
import {useNavigate, useSearchParams} from 'react-router-dom'
import {supabase} from '../../lib/supabase'

export default function VerifyEmail() {
  const [params] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const verify = async () => {
      const token = params.get('token')
      if (token) {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'email'
        })

        if (!error) navigate('/profile')
      }
    }
    verify()
  }, [params, navigate])

  return <div>Verifying email...</div>
}