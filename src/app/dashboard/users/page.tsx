'use client'

import { useEffect, useState } from 'react'
import Link from "next/link";

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch('/api/users')
                const json = await res.json()

                if (!res.ok) throw new Error(json.error || 'Unknown error')

                setUsers(json.users)
            } catch (err) {
                console.error('Gagal fetch users:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchUsers()
    }, [])

    const handleDelete = async (id: string) => {
        if (!confirm('Hapus pengguna ini?')) return
        const res = await fetch('/api/users', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        })
        const json = await res.json()
        if (!res.ok) return console.error('Delete error:', json.error)
        setUsers(prev => prev.filter(u => u.id !== id))
    }

    if (loading) return <div>Loading...</div>

    return (
        <div>
            <h1>Halaman Users</h1>
            <Link href="/dashboard/users/create">+ Create</Link>
            <table>
               <thead>
               <tr>
                   <th>Email</th>
                   <th>Nama</th>
                   <th>Role</th>
               </tr>
               </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user.id}>
                        <td>{user.email}</td>
                        <td>{user.profile?.name}</td>
                        <td>{user.profile?.role}</td>
                        <td>
                            <Link href={`/dashboard/users/edit/${user.id}`}>
                                Edit
                            </Link>
                            {' | '}
                            <button onClick={() => handleDelete(user.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

        </div>
    )
}
