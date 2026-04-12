
export interface Role {
    id?: string;
    ro_name?: string
}


export interface Member {
    id?: string;
    uid?: string;
    mb_hashname: string;
    mb_firstname: string;
    mb_lastname: string;
    mb_formalname: string;
    mb_email_id: string;
	mb_birthdate: string;
    mb_photo: string;
    rc_name: string;
	mb_status: string;
    mb_contact_mobile: string;
    ro_name:string[];
    mb_run_count: number;
    mb_harecount: number;
    mb_scribecount: number;
    mb_iscomm_mbr: boolean;
}

