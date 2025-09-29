import React, { useEffect, useState } from 'react';
import API from '../../api/axios';

export default function ProjectTreePage(){
  const [projects, setProjects] = useState([]);
  useEffect(()=>{
    API.get('/api/projects').then(res=>setProjects(res.data)).catch(()=>{});
  },[]);

  // create a simple tree grouping by category
  const grouped = projects.reduce((acc,p)=>{
    (acc[p.category] = acc[p.category]||[]).push(p);
    return acc;
  },{});

  return (
    <div className='p-6 pt-24'>
      <h1 className='text-2xl font-bold mb-4'>Project Tree</h1>
      <div className='space-y-4'>
        {Object.keys(grouped).map(cat=> (
          <div key={cat} className='bg-white p-4 rounded shadow'>
            <h3 className='font-semibold'>{cat}</h3>
            <ul className='list-disc ml-6 mt-2'>
              {grouped[cat].map(p=> <li key={p._id}>{p.title}</li>)}
            </ul>
          </div>
        ))}
        {projects.length===0 && <div className='text-gray-500'>No projects found</div>}
      </div>
    </div>
  );
}
