import React, { useState } from 'react'
import Navbar from '../components/ui/Navbar'
import { useUI } from '../hooks/useUI'
import { useAuth } from '../hooks/useAuth'
import { Sidebar } from '../components/ui/Sidebar'
import { NotesGrid } from '../components/notes/NotesGrid'

const Dashboard = () => {
  const { device } = useUI();

  const [showSide, setShowSide] = useState(device === 'desktop');
  const [search, setSearch] = useState('');



  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Navbar search={search} setSearch={setSearch} setShowSide={setShowSide} />
      <div style={{ display: 'flex', flexGrow: 1, minHeight: 0 }}>
        <Sidebar isOpen={showSide} onClose={() => setShowSide(false)} />
        <NotesGrid notes={notes} />
      </div>
    </div>

  )
}

export default Dashboard

const notes = [
  {
    id: "1",
    title: "Shopping List",
    content: "Milk, Eggs, Bread, Chicken, Rice, Coffee",
    category: "Personal",
    archived: false,
    deleted: false,
    pinned: true,
    updatedAt: "Today"
  },
  {
    id: "2",
    title: "DSA Revision",
    content: "Binary Search, Sliding Window, DFS, Union Find",
    category: "Study",
    archived: false,
    deleted: false,
    pinned: true,
    updatedAt: "Yesterday"
  },
  {
    id: "3",
    title: "Resume Improvements",
    content: "Add Notes App project, update GitHub, improve project descriptions",
    category: "Career",
    archived: false,
    deleted: false,
    pinned: false,
    updatedAt: "2 days ago"
  },
  {
    id: "4",
    title: "React TODO",
    content: "Finish dashboard, CRUD operations, search functionality, deploy app",
    category: "Development",
    archived: false,
    deleted: false,
    pinned: false,
    updatedAt: "Jul 25"
  },
  {
    id: "5",
    title: "Interview Questions",
    content: "Difference between JWT and Sessions, Explain React Context, Event Loop",
    category: "Career",
    archived: false,
    deleted: false,
    pinned: false,
    updatedAt: "Jul 22"
  },
  {
    id: "6",
    title: "Project Ideas",
    content: "AI Interview Platform, Expense Tracker, URL Shortener",
    category: "Ideas",
    archived: false,
    deleted: false,
    pinned: false,
    updatedAt: "Jul 20"
  },
  {
    id: "7",
    title: "Books to Read",
    content: "Clean Code, Designing Data-Intensive Applications, Atomic Habits",
    category: "Personal",
    archived: false,
    deleted: false,
    pinned: false,
    updatedAt: "Jul 18"
  },
  {
    id: "8",
    title: "Weekend Goals",
    content: "LeetCode Contest, Finish Notes App Dashboard, Push to GitHub",
    category: "Planning",
    archived: false,
    deleted: false,
    pinned: false,
    updatedAt: "Jul 17"
  },
  {
    id: "7",
    title: "Books to Read",
    content: "Clean Code, Designing Data-Intensive Applications, Atomic Habits",
    category: "Personal",
    archived: false,
    deleted: false,
    pinned: false,
    updatedAt: "Jul 18"
  },
  {
    id: "8",
    title: "Weekend Goals",
    content: "LeetCode Contest, Finish Notes App Dashboard, Push to GitHub",
    category: "Planning",
    archived: false,
    deleted: false,
    pinned: false,
    updatedAt: "Jul 17"
  },
  {
    id: "7",
    title: "Books to Read",
    content: "Clean Code, Designing Data-Intensive Applications, Atomic Habits",
    category: "Personal",
    archived: false,
    deleted: false,
    pinned: false,
    updatedAt: "Jul 18"
  },
  {
    id: "8",
    title: "Weekend Goals",
    content: "LeetCode Contest, Finish Notes App Dashboard, Push to GitHub",
    category: "Planning",
    archived: false,
    deleted: false,
    pinned: false,
    updatedAt: "Jul 17"
  },
  {
    id: "7",
    title: "Books to Read",
    content: "Clean Code, Designing Data-Intensive Applications, Atomic Habits",
    category: "Personal",
    archived: false,
    deleted: false,
    pinned: false,
    updatedAt: "Jul 18"
  },
  {
    id: "8",
    title: "Weekend Goals",
    content: "LeetCode Contest, Finish Notes App Dashboard, Push to GitHub",
    category: "Planning",
    archived: false,
    deleted: false,
    pinned: false,
    updatedAt: "Jul 17"
  },
  {
    id: "7",
    title: "Books to Read",
    content: "Clean Code, Designing Data-Intensive Applications, Atomic Habits",
    category: "Personal",
    archived: false,
    deleted: false,
    pinned: false,
    updatedAt: "Jul 18"
  },
  {
    id: "8",
    title: "Weekend Goals",
    content: "LeetCode Contest, Finish Notes App Dashboard, Push to GitHub",
    category: "Planning",
    archived: false,
    deleted: false,
    pinned: false,
    updatedAt: "Jul 17"
  },
  {
    id: "7",
    title: "Books to Read",
    content: "Clean Code, Designing Data-Intensive Applications, Atomic Habits",
    category: "Personal",
    archived: false,
    deleted: false,
    pinned: false,
    updatedAt: "Jul 18"
  },
  {
    id: "8",
    title: "Weekend Goals",
    content: "LeetCode Contest, Finish Notes App Dashboard, Push to GitHub",
    category: "Planning",
    archived: false,
    deleted: false,
    pinned: false,
    updatedAt: "Jul 17"
  },
  {
    id: "7",
    title: "Books to Read",
    content: "Clean Code, Designing Data-Intensive Applications, Atomic Habits",
    category: "Personal",
    archived: false,
    deleted: false,
    pinned: false,
    updatedAt: "Jul 18"
  },
  {
    id: "8",
    title: "Weekend Goals",
    content: "LeetCode Contest, Finish Notes App Dashboard, Push to GitHub",
    category: "Planning",
    archived: false,
    deleted: false,
    pinned: false,
    updatedAt: "Jul 17"
  }
];