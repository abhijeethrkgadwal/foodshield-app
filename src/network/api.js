import network from "./index";

export const getImageApi = async (name) => {
    try{
        const res = await network.get(`/fsimages/get/${name}`);
        return res.data.data;
    } catch(e){
        console.log(e)
    }

};

export const UploadImageApi = async (body) => {
  try{
  const res = await network.post("/fsimages/upload", body,{
    headers: {
    "Content-Type": "multipart/form-data"
  }});
  return res;
}catch (e){
  console.log(e)
}
};
