import { json } from '@sveltejs/kit'
import axios from 'axios';

export async function GET({ url }){
  try {

    // 'api/test?GIn=${GIn}&XminIn=${XminIn}&delSmaxIn=${delSmaxIn}&delCmaxIn=${delCmaxIn}');

    const GIn = url.searchParams.get('GIn');
    const XminIn = url.searchParams.get('XminIn');
    const delSmaxIn = url.searchParams.get('delSmaxIn');
    const delCmaxIn = url.searchParams.get('delCmaxIn');

    const response = await axios.get(`http://127.0.0.1:5000?GIn=${GIn}&XminIn=${XminIn}&delSmaxIn=${delSmaxIn}&delCmaxIn=${delCmaxIn}`);
    
    const responseData = response.data
    return json(responseData, {status: 200})

  } catch (error) {
    return json(error, {status: 500})
  }
}