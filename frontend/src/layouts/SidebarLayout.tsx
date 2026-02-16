import { Outlet, Link } from 'react-router-dom';
import { LayoutDashboard, History, User } from 'lucide-react';

export const SidebarLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white border-r p-4 flex flex-col">
        <h1 className="text-xl font-bold mb-8">QuizMaster</h1>
        <nav className="space-y-2 flex-1">
          <Link to="/quizzes" className="flex items-center p-2 hover:bg-gray-100 rounded">
            <LayoutDashboard className="mr-2" /> Quizzes
          </Link>
          <Link to="/sessions" className="flex items-center p-2 hover:bg-gray-100 rounded">
            <History className="mr-2" /> My Sessions
          </Link>
        </nav>
      </aside>
      <main className="flex-1 overflow-auto p-8">
        <Outlet /> {/* 👈 This is where your pages will render */}
      </main>
    </div>
  );
};