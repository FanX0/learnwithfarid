'use client'

import { useEffect, useState } from 'react'
import { ILearnWithRelations } from '@/types/learns'
import { fetchAllLearns } from '@/lib/learns/fetchAll'
import { deleteLearnsById } from '@/lib/learns/deleteById'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'sonner'
import { useDebounce } from 'use-debounce'

export default function LearnPage() {
    const [learns, setLearns] = useState<ILearnWithRelations[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [page, setPage] = useState(1)
    const [inputPage, setInputPage] = useState('1')
    const [limit] = useState(5)
    const [total, setTotal] = useState(0)

    const [search, setSearch] = useState('')
    const [filterUser, setFilterUser] = useState('')
    const [filterDate, setFilterDate] = useState('')
    const [filterCategory, setFilterCategory] = useState('') // NEW
    const [debouncedSearch] = useDebounce(search, 500)

    const [selectedIds, setSelectedIds] = useState<string[]>([])

    const totalPages = Math.ceil(total / limit)

    const fetchData = async () => {
        setLoading(true)
        setError(null)
        try {
            const { data, total } = await fetchAllLearns(
                page,
                limit,
                debouncedSearch,
                filterUser,
                filterDate,
                filterCategory
            )
            setLearns(data.filter(item => item.profiles && item.learns_categories))
            setTotal(total)
        } catch (err) {
            console.error(err)
            setError('Gagal memuat data.')
            toast.error('Gagal memuat data belajar.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
        setSelectedIds([])
    }, [page, debouncedSearch, filterUser, filterDate, filterCategory]) // ✅ Tambah filterCategory

    useEffect(() => {
        setInputPage(page.toString())
    }, [page])

    const handleDelete = async (id: string) => {
        if (!confirm('Yakin ingin menghapus data ini?')) return
        try {
            await deleteLearnsById(id)
            toast.success('Data berhasil dihapus.')
            fetchData()
        } catch (err) {
            console.error(err)
            toast.error('Gagal menghapus data.')
        }
    }

    const handleMassDelete = async () => {
        if (selectedIds.length === 0) return toast.error('Pilih minimal satu data')
        if (!confirm(`Hapus ${selectedIds.length} data terpilih?`)) return

        try {
            await Promise.all(selectedIds.map(id => deleteLearnsById(id)))
            toast.success(`${selectedIds.length} data berhasil dihapus`)
            fetchData()
        } catch {
            toast.error('Gagal menghapus beberapa data')
        }
    }

    const toggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
    }

    const toggleSelectAll = () => {
        if (selectedIds.length === learns.length) {
            setSelectedIds([])
        } else {
            setSelectedIds(learns.map(l => l.id))
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        if (/^\d*$/.test(val)) {
            setInputPage(val)
        }
    }

    const handleInputSubmit = () => {
        const num = Number(inputPage)
        if (num >= 1 && num <= totalPages) {
            setPage(num)
        } else {
            toast.error(`Masukkan angka antara 1–${totalPages}`)
            setInputPage(page.toString())
        }
    }

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Learn</h2>

            <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2">
                    <button
                        onClick={handleMassDelete}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                        Hapus Terpilih
                    </button>
                    <Link
                        href="/dashboard/learn/create"
                        className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                        + Create
                    </Link>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-4 flex-wrap">
                <input
                    type="text"
                    placeholder="Cari berdasarkan nama..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value)
                        setPage(1)
                    }}
                    className="border border-gray-300 rounded p-2 flex-1"
                />
                <input
                    type="text"
                    placeholder="Filter pembuat..."
                    value={filterUser}
                    onChange={(e) => {
                        setFilterUser(e.target.value)
                        setPage(1)
                    }}
                    className="border border-gray-300 rounded p-2 flex-1"
                />
                <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => {
                        setFilterDate(e.target.value)
                        setPage(1)
                    }}
                    className="border border-gray-300 rounded p-2"
                />
                <input
                    type="text"
                    placeholder="Filter kategori..."
                    value={filterCategory}
                    onChange={(e) => {
                        setFilterCategory(e.target.value)
                        setPage(1)
                    }}
                    className="border border-gray-300 rounded p-2 flex-1"
                />
                <button
                    onClick={() => {
                        setSearch('')
                        setFilterUser('')
                        setFilterDate('')
                        setFilterCategory('')
                        setPage(1)
                    }}
                    className="bg-gray-200 px-3 py-1 rounded"
                >
                    Reset Filter
                </button>
            </div>
            {(filterUser || filterDate || filterCategory || debouncedSearch) && (
                <p className="text-sm text-gray-500 mb-2">
                    Menampilkan hasil dengan filter aktif
                </p>
            )}

            {loading && <p>Memuat data...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && !error && (
                <>
                    <div className="overflow-x-auto">
                        <table className="table-auto border-collapse w-full text-sm">
                            <thead>
                            <tr className="bg-gray-100">
                                <th className="border px-2 py-1">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.length === learns.length && learns.length > 0}
                                        onChange={toggleSelectAll}
                                    />
                                </th>
                                <th className="border px-2 py-1">Name</th>
                                <th className="border px-2 py-1">Description</th>
                                <th className="border px-2 py-1">Image</th>
                                <th className="border px-2 py-1">Category</th>
                                <th className="border px-2 py-1">Created By</th>
                                <th className="border px-2 py-1">Created At</th>
                                <th className="border px-2 py-1">Updated At</th>
                                <th className="border px-2 py-1">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {learns.map((learn) => (
                                <tr key={learn.id}>
                                    <td className="border px-2 py-1 text-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(learn.id)}
                                            onChange={() => toggleSelect(learn.id)}
                                        />
                                    </td>
                                    <td className="border px-2 py-1">{learn.name ?? '-'}</td>
                                    <td className="border px-2 py-1">{learn.description ?? '-'}</td>
                                    <td className="border px-2 py-1">
                                        {learn.imageUrl ? (
                                            <Image
                                                src={learn.imageUrl}
                                                alt={learn.name || 'Learn Image'}
                                                width={80}
                                                height={60}
                                                className="object-cover rounded"
                                            />
                                        ) : (
                                            '-'
                                        )}
                                    </td>
                                    <td className="border px-2 py-1">{learn.learns_categories?.name ?? '-'}</td>
                                    <td className="border px-2 py-1">{learn.profiles?.name ?? '-'}</td>
                                    <td className="border px-2 py-1"> {learn.created_at ? new Date(learn.created_at).toLocaleDateString('id-ID') : '-'}</td>
                                    <td className="border px-2 py-1">{learn.updated_at ? new Date(learn.updated_at).toLocaleDateString('id-ID') : '-'}</td>
                                    <td className="border px-2 py-1 whitespace-nowrap">
                                        <Link
                                            href={`/dashboard/learn/edit/${learn.id}`}
                                            className="text-blue-600 hover:underline"
                                        >
                                            Edit
                                        </Link>
                                        {' | '}
                                        <button
                                            onClick={() => handleDelete(learn.id)}
                                            className="text-red-600 hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        {learns.length === 0 && (
                            <p className="text-center text-gray-500 mt-4">Belum ada data.</p>
                        )}
                    </div>

                    <div className="flex items-center gap-4 mt-4">
                        <button
                            onClick={() => setPage((p) => Math.max(p - 1, 1))}
                            disabled={page === 1}
                            className="px-3 py-1 border rounded disabled:opacity-50"
                        >
                            Previous
                        </button>

                        <input
                            type="text"
                            value={inputPage}
                            onChange={handleInputChange}
                            onBlur={handleInputSubmit}
                            onKeyDown={(e) => e.key === 'Enter' && handleInputSubmit()}
                            className="w-12 text-center border border-gray-300 p-1 rounded"
                        />
                        <span>/ {totalPages}</span>

                        <button
                            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                            disabled={page === totalPages}
                            className="px-3 py-1 border rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}
