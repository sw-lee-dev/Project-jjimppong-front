// interface: patch user request body DTO //
export default interface PatchSignInUserRequestDto {
  userNickname: string;
  userPassword: string;
  address: string;
  detailAddress: string | null;
  profileImage: string | null;
}