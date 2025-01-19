
import { useLoaderData } from '@remix-run/react';
import axios from 'axios';

 const useApi = (url:string) => {
	return axios.create({
	  baseURL: url,
	});
  };

  export  default useApi;