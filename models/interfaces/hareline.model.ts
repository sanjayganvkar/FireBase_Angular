export interface Hareline {
    id?: string;
    hl_runno : string;
    hl_name: string;
    hl_datetime: string;
    hl_gps: { lat: number, long: number },
    hl_runsite: string;
    hl_scribe: string[];   // List of mb_hashnames
    hl_hare: string[];     // List of mb_hashnames
    hl_runtype: string;
    hl_runfee: number;
    hl_guestfee: number;
    hl_comment: number;
    hl_publish: boolean;
    hl_rating: {
        [key: string]: HarelineRating
    };
    hl_stat: { length: string, hours: string }
    hl_runimages: string[];
}

export interface HarelineRating {
    id?: string;
    mb_hashname: string;                 // Rated by
	hr_rateddate: string;
    hr_comment: string;
    hc_name: string;                     // Hareline Category Name
	hr_userrating: {
        [key: string]: HarelineRatingItems
    }
    ref_mb: string;
    mb_photo: string;
}

export interface HarelineRatingItems {
    id?: string;
    hr_ritem: string;
    hr_rvalue: number;
}