
export default interface Board {
    boardNumber: number;
    boardWriteDate: string;
    boardTitle: string;
    boardContent: string;
    boardAddressCategory: string;
    boardDetailCategory: string;
    boardAddress: string;
    boardViewCount: number;
    boardImage: string;

}

export default interface DetailBoard {
    boardNumber: number;
    boardContent: string;
    boardTitle: string;
    boardAddressCategory: string;
    boardDetailCategory: string;
    boardWriteDate: string;
    boardScore: number;
    boardViewCount: number;
    boardAddress: string;
    boardImage: string;
    userId: string;
    userNickname: string;
    userLevel: number;
}


// response json형태와 필드명 동일하게!
export default interface RecommandBoard {
    boardNumber : number;
    boardWriteDate: string;
    boardAddressCategory : string;
    boardDetailCategory : string;
    boardTitle: string;
    boardViewCount : number;
    boardScore : number;
    boardImage : string;
    userNickname : string;
    goodCount : number;
}

export default interface FilteredBoard {
    boardNumber : number;
    boardWriteDate: string;
    boardAddressCategory : string;
    boardDetailCategory : string;
    boardTitle: string;
    boardViewCount : number;
    boardScore : number;
    boardImage : string;
    userNickname : string;
    userLevel : number;
    goodCount : number;
    commentCount : number;
}
