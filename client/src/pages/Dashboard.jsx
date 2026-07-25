import React, { useState } from 'react'
import Navbar from '../components/ui/Navbar'
import { useUI } from '../hooks/useUI'
import { useAuth } from '../hooks/useAuth'
import { Sidebar } from '../components/ui/Sidebar'

const Dashboard = () => {
  const { device } = useUI();

  const [showSide, setShowSide] = useState(device === 'desktop');
  const [search, setSearch] = useState('');



  return (
    <>
      <Navbar search={search} setSearch={setSearch} setShowSide={setShowSide} />
      <Sidebar isOpen={showSide} onClose={() => setShowSide(false)}/>
    </>
  )
}

export default Dashboard