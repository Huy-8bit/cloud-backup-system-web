import { myAxious } from "../api";

export const getDeviceId = async (token) => {
  try {
    return await myAxious.post(
      `/drive/setDevice`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (err) {
    throw err;
  }
};

// export const getExecutable = async (token) => {
//   try {
//     return await myAxious.get(
//       `/drive/getClientExecutable`,
//       {
//         headers: {
//           Authorization: `${token}`,
//         },
//       }
//     );
//   } catch (err) {
//     throw err;
//   }
// };

export const sendFile = async (device_id, data, token) => {
  try {
    return await myAxious.post(
      `/drive/send-file/${device_id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        },
      }
    );
  } catch (err) {
    throw err;
  }
};
export const getFileStructure = async (device_id) => {
  try {
    return await myAxious.get(
      `/drive/request-directory-structure/${device_id}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
  } catch (err) {
    throw err;
  }
};
export const downloadFile = async (download_code) => {
  try {
    return await myAxious.get(`/drive/download-file/${download_code}`);
  } catch (err) {
    throw err;
  }
};
export const getFile = async (device_id, file_path, token) => {
  try {
    return await myAxious.post(
      `/drive/get-files/${device_id}`,
      file_path,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        },
      }
    );
  } catch (err) {
    throw err;
  }
};
export const createFolder = async (device_id, path, token) => {
  try {
    return await myAxious.post(
      `/drive/create-folder/${device_id}?folder_path=${path}`,{},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (err) {
    throw err;
  }
};
