'use client'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { IUser } from '@/types/users'

export default function EditUserPage() {
    const { id: userId } = useParams() as { id: string }
    const router = useRouter()

    const [user, setUser] = useState<IUser | null>(null)
    const [name, setName] = useState('')
    const [role, setRole] = useState('')
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        if (!userId) return
        const fetchUser = async () => {
            try {
                const res = await fetch(`/api/users?id=${userId}`)
                const json = await res.json()
                if (!res.ok) throw new Error(json.error)
                setUser(json.user)
                setName(json.user.profile?.name || '')
                setRole(json.user.profile?.role || '')
            } catch (err: any) {
                alert(err.message || 'Gagal memuat user')
            } finally {
                setLoading(false)
            }
        }
        fetchUser()
    }, [userId])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            const res = await fetch('/api/users', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: userId, updates: { name, role } }),
            })
            const json = await res.json()
            if (!res.ok) throw new Error(json.error)
            alert('Update berhasil!')
            router.push('/dashboard/users')
        } catch (err: any) {
            alert(err.message || 'Gagal update user')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return <p>Loading…</p>
    if (!user) return <p>User tidak ditemukan.</p>

    return (
        <div className="p-4 max-w-md mx-auto">
            <h1 className="text-2xl font-semibold mb-4">Edit User</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium">Email</label>
                    <input
                        type="text"
                        value={user.email}
                        disabled
                        className="mt-1 block w-full bg-gray-100 cursor-not-allowed"
                    />
                </div>
                <div>
                    <label className="block font-medium">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="mt-1 block w-full"
                    />
                </div>
                <div>
                    <label className="block font-medium">Role</label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                        className="mt-1 block w-full"
                    >
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                        <option value="super_admin">super_admin</option>
                    </select>
                </div>
                <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                >
                    {submitting ? 'Updating...' : 'Update User'}
                </button>
            </form>
        </div>
    )
}
