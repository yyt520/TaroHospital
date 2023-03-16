import request from "../utils/request";
import Api from "../config/api";

export const uploadFile =(payload)=>{
  return request.uploadFile(Api.uploadFile,payload)
}
