'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function CreateUserPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [role, setRole] = useState('user')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, name, role, password })
            })
            const json = await res.json()
            if (!res.ok) throw new Error(json.error)
            alert('User berhasil dibuat!')
            router.push('/dashboard/users')
        } catch (err: any) {
            alert(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-4 max-w-md mx-auto">
            <h1 className="text-2xl font-semibold mb-4">Buat User Baru</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <label>Email<input required type="email" value={email} onChange={e => setEmail(e.target.value)} /></label>
                <label>Nama<input required value={name} onChange={e => setName(e.target.value)} /></label>
                <label>Role
                    <select value={role} onChange={e => setRole(e.target.value)}>
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                        <option value="super_admin">super_admin</option>
                    </select>
                </label>
                <label>Password (opsional)<input type="text" value={password} onChange={e => setPassword(e.target.value)} /></label>
                <button type="submit" disabled={loading}>{loading ? 'Membuat...' : 'Buat User'}</button>
            </form>
        </div>
    )
}
