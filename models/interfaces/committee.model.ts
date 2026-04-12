export interface Committee {
    id?: string;
    co_name: string;
    co_email_id: string;
    co_fromdate: Date;
    co_todate: Date;
    co_active: boolean;
    co_member: {
        [key: string]: CommitteeMember
    }
}
export interface CommitteeMember {
    id?: string;    
    ro_name: string;
    cm_sort: number;
    mb_email_id: string;
    mb_hashname: string;
    mb_firstname: string; 
    mb_lastname: string;
    mb_photo: string;
    ref_mb: string;
}