'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'


export default function LogoutButton() {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)

    const handleSignOut = async () => {
        setLoading(true)
        const { error } = await supabase.auth.signOut()

        if (error) {
            console.error('Gagal logout:', error.message)
        } else {
            router.refresh()
            router.push('/login')
        }

        setLoading(false)
    }

    return (
        <button onClick={handleSignOut} disabled={loading}>
            {loading ? 'Logging out...' : 'Sign Out'}
        </button>
    )
}
