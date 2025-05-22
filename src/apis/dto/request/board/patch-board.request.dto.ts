export default interface PatchBoardRequestDto {
  boardNumber: number;
  boardAddressCategory: string;
  boardDetailCategory: string;
  boardTitle: string;
  boardContent: string;
  boardAddress?: string | null;
  boardWriteDate: string;
  boardViewCount: number;
  boardScore: number;
  boardImage?: string | null;
  textFileUrl?: string | null;
}