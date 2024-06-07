import { json } from '@sveltejs/kit'
import axios from 'axios';

export async function GET({ url }){
  //let input = url.searchParams.get('input')
  //console.log("input", input)
  try {
    //const response = await axios.get(`http://127.0.0.1:5000/test?input=${input}`);
    const response = await axios.get(`http://127.0.0.1:5000`);
    const responseData = response.data
    //console.log("responseData", responseData)
    return json(responseData, {status: 200})
  } catch (error) {
    //console.log("error", error)
    return json(error, {status: 500})
  }
}