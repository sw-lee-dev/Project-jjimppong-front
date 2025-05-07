// interface: patch user request body DTO //
export default interface PatchSNSSignInUserRequestDto {
  userNickname: string;
  address: string;
  detailAddress: string | null;
  profileImage: string | null;
}