import { NextResponse } from 'next/server'
import { fetchAllUsers } from '@/lib/users/fetchAll'
import { fetchUserById } from '@/lib/users/fetchById'
import { updateUserById } from '@/lib/users/updateById'
import { deleteUserById } from '@/lib/users/deleteById'
import { createUser } from '@/lib/users/create'

// Ganti ini dengan logic validasi session / JWT
const CURRENT_USER_ID = 'addc0fba-4d9f-466e-86c8-b93107220f53'

export async function GET(request: Request) {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    try {
        if (id) {
            // ✅ Jika ada param `id`, return single user
            const user = await fetchUserById(CURRENT_USER_ID, id)
            return NextResponse.json({ user })
        } else {
            // ✅ Tanpa `id`, return semua user
            const users = await fetchAllUsers(CURRENT_USER_ID)
            return NextResponse.json({ users })
        }
    } catch (error: any) {
        console.error('[API_USERS_GET] ERROR:', error)
        return NextResponse.json(
            { error: error.message || 'Gagal mengambil users', stack: error.stack },
            { status: 500 }
        )
    }
}

export async function POST(req: Request) {
    const { email, name, role, password } = await req.json()
    try {
        const newUser = await createUser(CURRENT_USER_ID, email, name, role, password)
        return NextResponse.json({ user: newUser })
    } catch (e: any) {
        console.error('[API_USERS_POST]', e)
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    const { id: targetUserId, updates } = await request.json()
    try {
        const updatedProfile = await updateUserById(CURRENT_USER_ID, targetUserId, updates)
        return NextResponse.json({ success: true, updatedProfile })
    } catch (error: any) {
        console.error('[API_USERS_PUT] ERROR:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    const { id: targetUserId } = await request.json()
    try {
        await deleteUserById(CURRENT_USER_ID, targetUserId)
        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('[API_USERS_DELETE] ERROR:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
