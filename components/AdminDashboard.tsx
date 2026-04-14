import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, FileText, Database, Settings, LogOut, 
  Search, Filter, Plus, MoreVertical, Trash2, ExternalLink, 
  RefreshCw, CheckCircle, Clock, Users, BookOpen, Layers
} from 'lucide-react';
import { supabase } from '../utils/supabase';
import { LessonPlanRecord } from '../types';

interface Props {
  onLogout: () => void;
}

const AdminDashboard: React.FC<Props> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'plans' | 'documents' | 'competencies'>('plans');
  const [plans, setPlans] = useState<LessonPlanRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPlans: 0,
    totalDocs: 0,
    activeUsers: 142,
    avgScore: 92
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('lesson_plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPlans(data || []);
      setStats(prev => ({ ...prev, totalPlans: data?.length || 0 }));
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Set up real-time subscription for automatic data refresh
    const subscription = supabase
      .channel('lesson_plans_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'lesson_plans' }, 
        () => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa giáo án này?')) return;
    
    try {
      const { error } = await supabase
        .from('lesson_plans')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchData();
    } catch (err) {
      console.error('Error deleting:', err);
      alert('Không thể xóa giáo án.');
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gold-accent flex items-center justify-center">
              <Settings className="text-white" size={18} />
            </div>
            <span className="font-bold text-white tracking-tight">Admin Panel</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button 
            onClick={() => setActiveTab('plans')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'plans' ? 'bg-gold-accent text-white shadow-lg shadow-gold-accent/20' : 'hover:bg-white/5'}`}
          >
            <FileText size={18} /> <span className="text-sm font-medium">Quản lý Giáo án</span>
          </button>
          <button 
            onClick={() => setActiveTab('documents')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'documents' ? 'bg-gold-accent text-white shadow-lg shadow-gold-accent/20' : 'hover:bg-white/5'}`}
          >
            <Database size={18} /> <span className="text-sm font-medium">Kho Tài liệu</span>
          </button>
          <button 
            onClick={() => setActiveTab('competencies')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'competencies' ? 'bg-gold-accent text-white shadow-lg shadow-gold-accent/20' : 'hover:bg-white/5'}`}
          >
            <Layers size={18} /> <span className="text-sm font-medium">Khung Năng lực</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all"
          >
            <LogOut size={18} /> <span className="text-sm font-medium">Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0">
          <h2 className="text-lg font-bold text-slate-800">
            {activeTab === 'plans' && 'Danh sách Giáo án đã lưu'}
            {activeTab === 'documents' && 'Kho Tài liệu SGK'}
            {activeTab === 'competencies' && 'Quản lý Khung Năng lực Số'}
          </h2>
          <div className="flex items-center gap-4">
            <button onClick={fetchData} className="p-2 text-slate-400 hover:text-gold-accent transition-colors">
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
            <div className="h-8 w-px bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-800 leading-none">Admin User</p>
                <p className="text-[10px] text-slate-500 mt-1">Quản trị viên</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                <Users size={16} />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Tổng giáo án', value: stats.totalPlans, icon: FileText, color: 'blue' },
              { label: 'Tài liệu SGK', value: stats.totalDocs, icon: BookOpen, color: 'gold' },
              { label: 'Người dùng', value: stats.activeUsers, icon: Users, color: 'green' },
              { label: 'Điểm TB', value: `${stats.avgScore}%`, icon: CheckCircle, color: 'purple' }
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-slate-50 text-slate-600`}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Table Area */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Tìm kiếm..."
                  className="w-full bg-white border border-slate-200 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-gold-accent transition-all"
                />
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all">
                  <Filter size={16} /> Lọc
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <th className="px-6 py-4">Tên bài dạy / Chủ đề</th>
                    <th className="px-6 py-4">Môn học</th>
                    <th className="px-6 py-4">Lớp</th>
                    <th className="px-6 py-4">Ngày tạo</th>
                    <th className="px-6 py-4">Trạng thái</th>
                    <th className="px-6 py-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <RefreshCw className="mx-auto text-gold-accent animate-spin mb-2" size={24} />
                        <p className="text-sm text-slate-400">Đang tải dữ liệu...</p>
                      </td>
                    </tr>
                  ) : plans.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <p className="text-sm text-slate-400">Chưa có giáo án nào được lưu.</p>
                      </td>
                    </tr>
                  ) : (
                    plans.map((plan) => (
                      <tr key={plan.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-slate-800">{plan.topic}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">ID: #{plan.id}</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{plan.subject}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">Lớp {plan.grade}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Clock size={12} /> {new Date(plan.created_at).toLocaleDateString('vi-VN')}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded uppercase">Đã lưu</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 text-slate-400 hover:text-gold-accent transition-colors">
                              <ExternalLink size={16} />
                            </button>
                            <button 
                              onClick={() => handleDelete(plan.id)}
                              className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
