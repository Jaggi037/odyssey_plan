import axios from "axios"

export const send=axios.create({
    withCredentials:true //this ensure's that axio's is sending cookies along with the request
});

export const backendURL = 'http://localhost:8000'
export const mediaUploadURL = 'http://localhost:1080'
export const frontendURL = 'http://localhost:3000'


  