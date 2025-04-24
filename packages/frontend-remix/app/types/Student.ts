export type Student = {
    id: string; // UUID
    name_first: string;
    name_last: string;
    email: string;
    phone?: string;
    company?: string;
    notes?: string;
    created_at: string; //  ISO 
    updated_at: string; // ISO
};