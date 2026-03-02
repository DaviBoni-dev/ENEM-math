import { Search, Bell, Settings, Flame, Star, Clock, Play, Users, BookMarked, Calendar, Award } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* --- TOPBAR --- */}
      <nav className="bg-white border-b border-slate-200 px-8 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-xs">∑</div>
            MathFlow
          </h1>
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search for topics, formulas..." 
              className="bg-slate-100 rounded-full py-2 pl-10 pr-4 w-80 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex gap-6 text-sm font-medium text-slate-600">
            <a href="#" className="text-indigo-600">Dashboard</a>
            <a href="#">Courses</a>
            <a href="#">Practice</a>
          </div>
          <div className="flex items-center gap-4 border-l pl-6 border-slate-200">
            <Bell className="w-5 h-5 text-slate-400 cursor-pointer" />
            <Settings className="w-5 h-5 text-slate-400 cursor-pointer" />
            <div className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-white shadow-sm overflow-hidden">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Davi" alt="Profile" />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-[1400px] mx-auto p-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* --- COLUNA PRINCIPAL (3/4) --- */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* Hero Section */}
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-4xl font-bold mb-2">Welcome back, Davi! 👋</h2>
              <p className="text-slate-500">You have completed 85% of your weekly goals. Keep pushing!</p>
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-indigo-200">
              <Play className="w-4 h-4 fill-current" /> Resume Learning
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard icon={<Flame className="text-orange-500"/>} label="STREAK" value="12 Days" trend="Personal Best!" />
            <StatCard icon={<Star className="text-yellow-500"/>} label="POINTS" value="2,450" trend="Top 5% of class" />
            <StatCard icon={<Clock className="text-blue-500"/>} label="FOCUS" value="4h 20m" trend="+15% vs last week" isTrendPositive />
          </div>

          {/* Courses Section */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <span className="text-indigo-600">🎓</span> Your Courses
              </h3>
              <button className="text-indigo-600 font-semibold text-sm">View All Courses</button>
            </div>
            <div className="space-y-6">
              <CourseCard 
                title="Algebra II" 
                subtitle="Quadratic Equations & Functions" 
                progress={75} 
                color="bg-indigo-600"
                nextLesson="Completing the Square"
                pending="Parabolas Worksheet"
              />
              <CourseCard 
                title="Geometry" 
                subtitle="Triangle Properties & Theorems" 
                progress={45} 
                color="bg-sky-500"
                nextLesson="Pythagorean Applications"
                pending="Angle Relationships"
              />
            </div>
          </div>
        </div>

        {/* --- SIDEBAR (1/4) --- */}
        <div className="space-y-8">
          {/* Mentor Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center">
             <div className="w-20 h-20 mx-auto rounded-full bg-slate-200 mb-4 overflow-hidden border-4 border-white shadow-md">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher" alt="Mentor" />
             </div>
             <h4 className="font-bold text-lg">Mr. Anderson</h4>
             <p className="text-slate-400 text-sm mb-6">Mentor • Online Now</p>
             <div className="grid grid-cols-2 gap-3">
                <button className="bg-slate-50 p-4 rounded-2xl flex flex-col items-center gap-2 text-xs font-bold hover:bg-slate-100 transition-colors">
                  <Users className="w-5 h-5 text-indigo-600" /> Study Group
                </button>
                <button className="bg-slate-50 p-4 rounded-2xl flex flex-col items-center gap-2 text-xs font-bold hover:bg-slate-100 transition-colors">
                  <BookMarked className="w-5 h-5 text-indigo-600" /> My Notes
                </button>
             </div>
          </div>

          {/* Daily Challenge Card */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-3xl text-white relative overflow-hidden">
            <div className="relative z-10">
              <span className="bg-white/20 text-[10px] font-bold px-2 py-1 rounded-md uppercase">Daily Challenge</span>
              <h4 className="text-xl font-bold mt-4 mb-2">Question of the Day</h4>
              <p className="text-indigo-100 text-xs mb-6">Solve this calculus limit problem to earn a streak bonus.</p>
              <button className="w-full bg-white text-indigo-600 py-3 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors">
                Solve Now →
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
          </div>
        </div>

      </div>
    </div>
  );
}

// --- SUB-COMPONENTES AUXILIARES ---

function StatCard({ icon, label, value, trend, isTrendPositive = false }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
        <div className="p-2 bg-slate-50 rounded-xl">{icon}</div>
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className={`text-xs font-medium ${isTrendPositive ? 'text-emerald-500' : 'text-slate-400'}`}>
        {isTrendPositive && '↑ '} {trend}
      </div>
    </div>
  );
}

function CourseCard({ title, subtitle, progress, color, nextLesson, pending }: any) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm group hover:border-indigo-200 transition-all">
      <div className="flex justify-between items-start mb-6">
        <div className="flex gap-4">
          <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
            {title[0]}
          </div>
          <div>
            <h4 className="text-xl font-bold">{title}</h4>
            <p className="text-slate-400 text-sm">{subtitle}</p>
          </div>
        </div>
        <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase">Active Now</span>
      </div>
      
      <div className="mb-8">
        <div className="flex justify-between text-xs font-bold mb-2">
          <span>Course Progress</span>
          <span className="text-indigo-600">{progress}%</span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
          <div className={`${color} h-full rounded-full transition-all duration-1000`} style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-50 p-4 rounded-2xl border border-transparent hover:border-slate-200 transition-colors">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Next Lesson</span>
          <p className="text-sm font-bold text-slate-700 mt-1">{nextLesson}</p>
          <p className="text-[10px] text-slate-400 mt-1">15 mins • Video + Quiz</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-2xl border border-transparent hover:border-slate-200 transition-colors">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Pending Assignment</span>
          <p className="text-sm font-bold text-slate-700 mt-1">{pending}</p>
          <p className="text-[10px] text-red-400 mt-1 font-bold italic">Due in 2 days</p>
        </div>
      </div>
    </div>
  );
}