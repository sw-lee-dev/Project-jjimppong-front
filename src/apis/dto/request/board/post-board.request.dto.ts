export default interface PostBoardRequestDto {
  boardAddressCategory: string;
  boardDetailCategory: string;
  boardTitle: string;
  boardContent: string;
  boardAddress?: string | null;
  boardImage?: string | null;
}