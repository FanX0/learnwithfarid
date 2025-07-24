interface IUser {
    id: string
    email: string
    created_at: string
    profile?: {
        name?: string
        role?: string
    }
}