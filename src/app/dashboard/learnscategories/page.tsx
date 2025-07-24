'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { fetchAllLearnsCategories } from '@/lib/learnscategories/fetchAll'
import { deleteLearnsCategoryById } from '@/lib/learnscategories/deleteById'
import { ILearnsCategories } from '@/types/learnscategories'

export default function LearnCategoryPage() {
    const [learns, setLearns] = useState<ILearnsCategories[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [page, setPage] = useState(1)
    const [inputPage, setInputPage] = useState('1')
    const [limit] = useState(5)
    const [total, setTotal] = useState(0)
    const totalPages = Math.ceil(total / limit)

    const [search, setSearch] = useState('')
    const [query, setQuery] = useState('')
    const [filterUser, setFilterUser] = useState('')
    const [filterDate, setFilterDate] = useState('')

    const [selectedIds, setSelectedIds] = useState<string[]>([])

    const fetchData = async () => {
        setLoading(true)
        setError(null)
        try {
            const { data, total } = await fetchAllLearnsCategories(page, limit, query, filterUser, filterDate)
            setLearns(data.filter(item => item.profiles))
            setTotal(total)
        } catch {
            setError('Gagal mengambil data')
            toast.error('Gagal mengambil data')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
        setSelectedIds([]) // reset pilihan saat halaman berubah
    }, [page, query, filterUser, filterDate])

    useEffect(() => {
        setInputPage(page.toString())
    }, [page])

    const handleDelete = async (id: string) => {
        if (!confirm('Yakin ingin menghapus data ini?')) return
        try {
            await deleteLearnsCategoryById(id)
            toast.success('Kategori dihapus')
            fetchData()
        } catch {
            toast.error('Gagal menghapus data')
        }
    }

    const handleMassDelete = async () => {
        if (selectedIds.length === 0) return toast.error('Pilih minimal satu data')
        if (!confirm(`Hapus ${selectedIds.length} data terpilih?`)) return

        try {
            await Promise.all(selectedIds.map(id => deleteLearnsCategoryById(id)))
            toast.success(`${selectedIds.length} kategori dihapus`)
            fetchData()
        } catch {
            toast.error('Gagal menghapus beberapa data')
        }
    }

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
    }

    const toggleSelectAll = () => {
        if (selectedIds.length === learns.length) {
            setSelectedIds([])
        } else {
            setSelectedIds(learns.map(l => l.id))
        }
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setPage(1)
        setQuery(search.trim())
    }

    const handlePageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (/^\d*$/.test(e.target.value)) setInputPage(e.target.value)
    }
    const handlePageSubmit = () => {
        const num = Number(inputPage)
        if (num >= 1 && num <= totalPages) setPage(num)
        else {
            toast.error(`Halaman harus antara 1–${totalPages}`)
            setInputPage(page.toString())
        }
    }

    return (
        <div className="p-4 space-y-4">
            {/* Filter Controls */}
            <form onSubmit={handleSearch} className="flex gap-2">
                <input
                    type="text"
                    placeholder="Cari nama..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="border p-2 rounded flex-1"
                />
                <input
                    type="text"
                    placeholder="Filter pembuat..."
                    value={filterUser}
                    onChange={e => setFilterUser(e.target.value)}
                    className="border p-2 rounded flex-1"
                />
                <input
                    type="date"
                    value={filterDate}
                    onChange={e => setFilterDate(e.target.value)}
                    className="border p-2 rounded"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 rounded"
                >
                    Filter
                </button>
            </form>

            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold">Learn Categories</h1>
                <div className="flex gap-2">
                    <button
                        onClick={handleMassDelete}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                        Hapus Terpilih
                    </button>
                    <Link
                        href="/dashboard/learnscategories/create"
                        className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                        + Create
                    </Link>
                </div>
            </div>

            <table className="w-full border-collapse">
                <thead>
                <tr>
                    <th className="border p-2">
                        <input
                            type="checkbox"
                            checked={selectedIds.length === learns.length && learns.length > 0}
                            onChange={toggleSelectAll}
                        />
                    </th>
                    <th className="border p-2">Name</th>
                    <th className="border p-2">Created At</th>
                    <th className="border p-2">Updated At</th>
                    <th className="border p-2">Created By</th>
                    <th className="border p-2">Actions</th>
                </tr>
                </thead>
                <tbody>
                {learns.map(l => (
                    <tr key={l.id} className="border-b">
                        <td className="p-2 text-center">
                            <input
                                type="checkbox"
                                checked={selectedIds.includes(l.id)}
                                onChange={() => toggleSelect(l.id)}
                            />
                        </td>
                        <td className="p-2">{l.name}</td>
                        <td className="p-2">{l.created_at.split('T')[0]}</td>
                        <td className="p-2">{l.updated_at?.split('T')[0] ?? '-'}</td>
                        <td className="p-2">{l.profiles?.name}</td>
                        <td className="p-2 space-x-2">
                            <Link href={`/dashboard/learnscategories/edit/${l.id}`} className="text-blue-600 hover:underline">
                                Edit
                            </Link>
                            <button onClick={() => handleDelete(l.id)} className="text-red-600 hover:underline">
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            <div className="flex items-center gap-2 mt-4">
                <button disabled={page === 1} onClick={() => setPage(p => Math.max(p - 1, 1))}>
                    Prev
                </button>
                <input
                    type="text"
                    value={inputPage}
                    onChange={handlePageInput}
                    onBlur={handlePageSubmit}
                    onKeyDown={e => e.key === 'Enter' && handlePageSubmit()}
                    className="w-12 text-center border rounded p-1"
                />
                <span>/ {totalPages}</span>
                <button disabled={page === totalPages} onClick={() => setPage(p => Math.min(p + 1, totalPages))}>
                    Next
                </button>
            </div>
        </div>
    )
}
