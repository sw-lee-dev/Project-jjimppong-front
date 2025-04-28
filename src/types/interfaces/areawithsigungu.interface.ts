import Sigungu from "./sigungu.interface";

export default interface AreaWithSigungu {
    areaCode: number;
    areaName: string;
    sigunguList: Sigungu[];
  }