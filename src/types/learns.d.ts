export interface ILearn {
    id: string
    name: string
    description?: string
    image_path: string
    category_id: string
    user_id: string
    created_at: string
    updated_at: string
}

export interface ILearnWithRelations extends ILearn {
    imageUrl?: string | null
    learns_categories?: {
        name: string
    }
    profiles?: {
        name: string
    }
}
