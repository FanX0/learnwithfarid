export interface ILearnsCategories {
    id: number;
    name: string;
    created_at: string;
    updated_at?: string | null
    profiles?: {
        name: string
    }
}