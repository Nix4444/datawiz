import axios from "axios"

export async function useGet(question :string){

    const body = {
        question:question
    }
    const url = "http://localhost:3001/"
    const res = await axios.post(url,body,{
        headers: {
          'Content-Type': 'application/json'
        }})

     return res   
}

