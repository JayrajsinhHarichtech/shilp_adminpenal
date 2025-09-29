import React, { useEffect, useState } from 'react';
import API from '../../api/axios';

export default function GeminiPage(){
  const [tools, setTools] = useState([]);
  useEffect(()=>{
    API.get('/api/tools').then(res=>setTools(res.data)).catch(()=>{});
  },[]);

  return (
    <div className='p-6 pt-24'>
      <h1 className='text-2xl font-bold mb-4'>Gemini Tools</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {tools.map(t=> (
          <div key={t._id} className='bg-white p-4 rounded shadow'>
            <h3 className='font-semibold'>{t.title}</h3>
            <p className='text-sm'>{t.description}</p>
            <p className='text-xs text-gray-500'>Key: {t.key}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
