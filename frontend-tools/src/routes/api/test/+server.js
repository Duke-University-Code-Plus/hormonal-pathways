import { json } from '@sveltejs/kit'
import axios from 'axios';

export async function GET({ url }){
  try {

    const GIn = url.searchParams.get('GIn', 0.1);
    const XminIn = url.searchParams.get('XminIn', 1);
    const delSmaxIn = url.searchParams.get('delSmaxIn', 1);
    const delCmaxIn = url.searchParams.get('delCmaxIn', 1);
    const tauIn = url.searchParams.get('tauIn', 5);
    const KIn = url.searchParams.get('KIn', 1);
    const alphaIn = url.searchParams.get('alphaIn', 2);
    const betaIn = url.searchParams.get('betaIn', 2);
    const muIn = url.searchParams.get('muIn', 0.0001);
    const NIn = url.searchParams.get('NIn', 100);
    const foodShort = url.searchParams.get('foodShort', 0.5);
    const foodShortbegin = url.searchParams.get('foodShortbegin', 8);
    const foodShortend = url.searchParams.get('foodShortend', 20);

    const response = await axios.get(`http://127.0.0.1:5000?GIn=${GIn}&XminIn=${XminIn}&delSmaxIn=${delSmaxIn}&delCmaxIn=${delCmaxIn}&tauIn=${tauIn}&KIn=${KIn}&alphaIn=${alphaIn}&betaIn=${betaIn}&muIn=${muIn}&NIn=${NIn}&foodShort=${foodShort}&foodShortbegin=${foodShortbegin}&foodShortend=${foodShortend}`);
    
    const responseData = response.data
    return json(responseData, {status: 200})

  } catch (error) {
    return json(error, {status: 500})
  }
}