'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createLearnsCategories } from '@/lib/learnscategories/create'
import { InputField } from '@/components/InputField'

export default function CreateLearnsCategoryPage() {
    const router = useRouter()
    const [name, setName] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const validate = () => {
        if (!name.trim()) return 'Nama kategori wajib diisi.'
        if (name.trim().length < 2) return 'Nama kategori minimal terdiri dari 2 huruf.'
        return null
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const validationError = validate()
        if (validationError) {
            setError(validationError)
            toast.error(validationError)
            return
        }

        setLoading(true)
        setError(null)

        const formData = new FormData()
        formData.append('name', name.trim())

        try {
            const result = await createLearnsCategories(formData)
            if (result) {
                toast.success('Kategori berhasil dibuat!')
                setName('')
                router.push('/dashboard/learnscategories')
            }
        } catch (err) {
            console.error('Gagal membuat kategori:', err)
            setError('Terjadi kesalahan saat menyimpan data.')
            toast.error('Terjadi kesalahan saat menyimpan data.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Create Learn Category</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <InputField
                    id="name"
                    name="name"
                    label="Name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={error || undefined}
                />

                <button
                    type="submit"
                    disabled={loading}
                    className={`px-4 py-2 rounded text-white ${
                        loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                >
                    {loading ? 'Loading...' : 'Submit'}
                </button>
            </form>
        </div>
    )
}
