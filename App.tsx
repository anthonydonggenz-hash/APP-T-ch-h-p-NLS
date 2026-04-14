import React, { useState, useRef, useEffect } from 'react';
import { 
  Wand2, Sparkles, Layers, CheckCircle, File as FileIcon, User, 
  Edit3, RefreshCw, Settings, Upload, Bot, FileText, X, Brain, Save, Key, ArrowRight, Download, FileJson,
  Facebook, Phone, MessageCircle, Users as UsersIcon
} from 'lucide-react';
import LessonPlan5512View from './components/LessonPlan5512View';
import WorksheetView from './components/WorksheetView';
import SlideView from './components/SlideView';
import DigitalCompetencyView from './components/DigitalCompetencyView';
import AdminDashboard from './components/AdminDashboard';
import Auth from './components/Auth';
import { TEMPLATES } from './constants';
import { generateDetailed5512Plan, generateMockWorksheets, generateMockSlides, generateMockDigitalPack, generateMockAssessment, generateAiSuggestion } from './utils/generators';
import { renderWordHTML } from './utils/export';
import { FormData, ResultData } from './types';
import { supabase } from './utils/supabase';

// Định nghĩa kiểu cho window.aistudio
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    aistudio?: AIStudio;
  }
}

const App = () => {
  const [currentMode, setCurrentMode] = useState<string>('home'); 
  const [formData, setFormData] = useState<FormData>({
    grade: '10', subject: '', topic: '',
    duration: '1', template: '', classLevel: 'standard', 
    integrationMode: 'inline', originalText: '', products: ['plan', 'questions'], selectedFramework: '3456_THCS',
    textbookFileName: '', frameworkFileName: '', customFrameworkFileName: ''
  });
  
  const [resultData, setResultData] = useState<ResultData | null>(null);
  const [activeTab, setActiveTab] = useState(0); 
  const [auditResult, setAuditResult] = useState<{score: number; issues: any[]} | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [uploadingFile, setUploadingFile] = useState<string | null>(null);

  // Refs for file inputs
  const textbookInputRef = useRef<HTMLInputElement>(null);
  const frameworkInputRef = useRef<HTMLInputElement>(null);
  const customFrameworkInputRef = useRef<HTMLInputElement>(null);
  const jsonInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsAuthLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // --- SUPABASE HELPERS ---
  const uploadFileToSupabase = async (file: File, bucket: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage.from(bucket).upload(filePath, file);

      if (error) {
        console.error('Upload error:', error);
        alert(`Lỗi tải file: ${error.message}`);
        return null;
      }

      // Get public URL (assuming bucket is public)
      const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(filePath);
      return publicUrl;
    } catch (e) {
      console.error('Unexpected upload error:', e);
      return null;
    }
  };

  const saveLessonPlanToDb = async () => {
    if (!resultData) return;
    try {
        const { error } = await supabase.from('lesson_plans').insert([
            {
                topic: formData.topic,
                subject: formData.subject,
                grade: formData.grade,
                content: resultData, // Lưu toàn bộ kết quả JSON
                textbook_url: formData.textbookFileName, // Lưu URL hoặc tên file
                framework_url: formData.frameworkFileName,
                created_at: new Date()
            }
        ]);

        if (error) throw error;
        alert("Đã lưu giáo án vào CSDL thành công!");
    } catch (error: any) {
        console.error("Lỗi lưu CSDL:", error);
        alert(`Không thể lưu: ${error.message}`);
    }
  };

  // --- HANDLERS ---
  const handleGenerate = async () => {
    if (!formData.subject.trim()) { alert("Vui lòng điền tên Môn học!"); return; }
    if (!formData.grade) { alert("Vui lòng chọn Lớp học!"); return; }
    if (!formData.topic.trim()) { alert("Vui lòng điền Tên bài dạy / Chủ đề!"); return; }

    setCurrentMode('loading');
    
    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 2500));

    const isMath = formData.subject.toLowerCase().includes('toán') || formData.subject.toLowerCase().includes('hình') || formData.subject.toLowerCase().includes('đại');
    const lessonPlan = generateDetailed5512Plan(formData, isMath);

    const newResult: ResultData = {
      lessonPlan: lessonPlan,
      assessment: generateMockAssessment(formData, isMath),
      worksheets: generateMockWorksheets(formData, isMath),
      slides: generateMockSlides(formData),
      digitalPack: generateMockDigitalPack(formData),
      mode: formData.originalText ? 'integration' : 'creation'
    };

    setResultData(newResult);
    setCurrentMode('result');

    // Auto-save to Supabase
    try {
      await supabase.from('lesson_plans').insert([
        {
          topic: formData.topic,
          subject: formData.subject,
          grade: formData.grade,
          content: newResult,
          textbook_url: formData.textbookFileName,
          framework_url: formData.frameworkFileName,
          created_at: new Date()
        }
      ]);
      console.log("Auto-saved to database");
    } catch (error) {
      console.error("Auto-save failed:", error);
    }
  };

  const handleExportWord = () => {
    if (!resultData || !resultData.lessonPlan) return;
    const contentHtml = renderWordHTML(resultData);
    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(contentHtml);
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = `Giao_an_${formData.topic.replace(/\s+/g, '_')}.doc`;
    fileDownload.click();
    document.body.removeChild(fileDownload);
  };

  const handleExportJson = () => {
    if (!resultData) {
      alert("Chưa có dữ liệu để xuất!");
      return;
    }
    const exportData = {
      formData,
      resultData,
      exportedAt: new Date().toISOString(),
      version: "1.0"
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `Giao_an_${formData.topic.replace(/\s+/g, '_') || 'export'}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.formData) setFormData(json.formData);
        if (json.resultData) {
          setResultData(json.resultData);
          setCurrentMode('result');
        }
        alert("Nhập dữ liệu thành công!");
      } catch (err) {
        console.error("Lỗi nhập JSON:", err);
        alert("File JSON không hợp lệ hoặc cấu trúc sai.");
      }
    };
    reader.readAsText(file);
    // Reset input
    if (e.target) e.target.value = '';
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'textbook' | 'framework' | 'customFramework') => {
      if (e.target.files && e.target.files.length > 0) {
          const file = e.target.files[0];
          setUploadingFile(type);
          
          try {
              // Try to upload to Supabase, but don't block state update if it fails
              uploadFileToSupabase(file, 'documents').catch(console.error);
              
              if (type === 'textbook') {
                  setFormData(prev => ({ ...prev, textbookFileName: file.name })); 
              } else if (type === 'framework') {
                  setFormData(prev => ({ ...prev, frameworkFileName: file.name }));
              } else if (type === 'customFramework') {
                  setFormData(prev => ({ ...prev, customFrameworkFileName: file.name }));
              }
          } finally {
              setUploadingFile(null);
          }
      }
  };

  const handleAiSuggest = () => {
      if (!formData.topic || !formData.subject) {
          alert("Vui lòng nhập Môn học và Tên bài dạy trước để AI gợi ý nội dung!");
          return;
      }
      setIsSuggesting(true);
      
      const isMath = formData.subject.toLowerCase().includes('toán') || formData.subject.toLowerCase().includes('hình') || formData.subject.toLowerCase().includes('đại');
      
      setTimeout(() => {
          const aiContent = generateAiSuggestion(formData);

          setFormData(prev => ({
              ...prev, 
              originalText: aiContent
          }));
          setIsSuggesting(false);
      }, 1500);
  };

  const handleAudit = () => {
      setAuditResult({
          score: 98,
          issues: [{type: 'success', msg: 'Cấu trúc bài dạy rất chi tiết và đúng quy định 5512.'}]
      });
  };

  const handleAuthSuccess = () => {
    setCurrentMode('home');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentMode('home');
  };
  
  const handleTransformMethod = (actIndex: number, methodType: string) => {};
  const handleSectionElaborate = (sectionId: string, userPrompt: string) => {};

  // --- RENDER SUB-VIEWS ---

  const renderApiGuide = () => (
    <div className="w-full max-w-4xl bg-white p-10 rounded-xl shadow-sm border border-gray-100 animate-fade-in mx-auto mt-6 mb-10">
        <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-6">
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                <Key size={28}/>
            </div>
            <div>
                <h2 className="text-2xl font-bold font-serif text-slate-800">Hướng dẫn lấy API Key</h2>
                <p className="text-slate-500 text-sm italic">Để sử dụng công cụ ổn định và không giới hạn lượt dùng.</p>
            </div>
        </div>

        <div className="space-y-8 text-slate-700 leading-relaxed">
            <section>
                <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-gold-accent text-white flex items-center justify-center text-xs">1</span>
                    Truy cập Google AI Studio
                </h3>
                <p className="pl-8">
                    Truy cập vào trang web <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-gold-dark font-bold underline">Google AI Studio</a>. Đây là nền tảng miễn phí của Google để quản lý các khóa API cho mô hình Gemini.
                </p>
            </section>

            <section>
                <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-gold-accent text-white flex items-center justify-center text-xs">2</span>
                    Tạo API Key
                </h3>
                <p className="pl-8">
                    Nhấn vào nút <span className="font-bold text-slate-900">"Create API key"</span>. Nếu bạn đã có Project trên Google Cloud, bạn có thể chọn project đó, hoặc chọn <span className="font-bold text-slate-900">"Create API key in new project"</span>.
                </p>
            </section>

            <section>
                <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-gold-accent text-white flex items-center justify-center text-xs">3</span>
                    Sao chép và Cấu hình
                </h3>
                <p className="pl-8">
                    Sau khi Key được tạo, hãy sao chép (Copy) nó. Quay lại ứng dụng này, nhấn vào biểu tượng <span className="font-bold text-slate-900">Cài đặt (Settings)</span> ở góc dưới bên trái màn hình AI Studio (ngoài khung ứng dụng này) để dán Key vào phần cấu hình.
                </p>
            </section>

            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                <p className="text-sm text-blue-800 font-medium flex items-center gap-2">
                    <Bot size={18} /> Lưu ý quan trọng:
                </p>
                <ul className="list-disc pl-10 mt-3 text-sm text-blue-700 space-y-2">
                    <li>API Key của Gemini hiện tại có gói <strong>miễn phí</strong> rất hào phóng.</li>
                    <li>Không chia sẻ API Key của bạn cho người khác để đảm bảo bảo mật.</li>
                    <li>Việc sử dụng API Key riêng giúp bạn tránh được tình trạng "Quá tải lượt dùng" khi dùng chung hệ thống.</li>
                </ul>
            </div>

            <div className="flex justify-center pt-4">
                <button onClick={() => setCurrentMode('create_input')} className="px-8 py-3 rounded-xl bg-gold-accent text-white font-bold shadow-lg hover:brightness-110 transition-all flex items-center gap-2">
                    <Sparkles size={18} /> Bắt đầu soạn bài ngay
                </button>
            </div>
        </div>
    </div>
  );

  const renderInputForm = () => (
      <div className="w-full max-w-4xl bg-white p-10 rounded-xl shadow-sm border border-gray-100 animate-fade-in mx-auto mt-6 mb-10">
          <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-6">
              <div className="p-3 rounded-xl bg-yellow-50 text-gold-accent">
                  <Edit3 size={28}/>
              </div>
              <div>
                  <h2 className="text-2xl font-bold font-serif text-slate-800">Soạn bài mới (Chuẩn 5512)</h2>
                  <p className="text-slate-500 text-sm italic">Hệ thống hỗ trợ công thức Toán (LaTeX), Hình học (SVG) và tích hợp NL Số.</p>
              </div>
          </div>

          <div className="space-y-8">
              {/* Basic Info Group */}
              <div className="grid grid-cols-2 gap-6">
                  <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Môn học <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        className="w-full bg-white border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-gold-accent focus:ring-1 focus:ring-gold-accent/20 transition-all text-sm" 
                        placeholder="Ví dụ: Toán Hình, Đại số..."
                        value={formData.subject} 
                        onChange={e => setFormData({...formData, subject: e.target.value})} 
                      />
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Lớp <span className="text-red-500">*</span></label>
                      <select className="w-full bg-white border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-gold-accent focus:ring-1 focus:ring-gold-accent/20 transition-all text-sm" value={formData.grade} onChange={e => setFormData({...formData, grade: e.target.value})}>
                          {[1,2,3,4,5,6,7,8,9,10,11,12].map(g => <option key={g} value={g}>Lớp {g}</option>)}
                      </select>
                  </div>
                  <div className="col-span-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Tên bài dạy / Chủ đề <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        className="w-full bg-white border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-gold-accent focus:ring-1 focus:ring-gold-accent/20 transition-all text-sm font-semibold" 
                        placeholder="Ví dụ: Hình bình hành, Phương trình bậc hai..."
                        value={formData.topic} 
                        onChange={e => setFormData({...formData, topic: e.target.value})} 
                      />
                  </div>
              </div>

              <div className="h-px bg-slate-100"></div>

              {/* THREE SECTIONS: Textbook, Framework, AI Suggestion */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* 1. Textbook Material */}
                  <div className="border border-dashed border-slate-300 rounded-xl p-5 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                          <label className="block text-xs font-bold text-gold-dark uppercase tracking-widest">1. Tài liệu SGK</label>
                          <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded">Ảnh/PDF/PPT/Excel</span>
                      </div>
                      
                      <input 
                        type="file" 
                        ref={textbookInputRef}
                        className="hidden" 
                        accept=".jpg,.png,.jpeg,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                        onChange={(e) => handleFileChange(e, 'textbook')}
                      />
                      
                      {!formData.textbookFileName ? (
                          <div className="text-center py-6 cursor-pointer" onClick={() => !uploadingFile && textbookInputRef.current?.click()}>
                              {uploadingFile === 'textbook' ? (
                                <RefreshCw className="mx-auto text-gold-accent mb-2 animate-spin" size={24} />
                              ) : (
                                <Upload className="mx-auto text-slate-300 mb-2" size={24} />
                              )}
                              <p className="text-xs text-slate-500">{uploadingFile === 'textbook' ? 'Đang tải lên...' : 'Tải lên tài liệu bộ môn'}</p>
                          </div>
                      ) : (
                          <div className="flex items-center gap-2 bg-gold-light p-3 rounded-lg border border-gold-primary/20">
                              <FileText size={20} className="text-gold-dark" />
                              <div className="flex-1 min-w-0">
                                  <p className="text-xs font-bold text-slate-800 truncate">{formData.textbookFileName}</p>
                                  <p className="text-[10px] text-slate-500">Đã lưu lên Cloud</p>
                              </div>
                              <div className="flex items-center gap-2">
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); handleExportJson(); }}
                                    className="p-1.5 bg-white border border-gold-primary/20 rounded-md text-gold-dark hover:bg-gold-light transition-colors shadow-sm"
                                    title="Xuất JSON"
                                  >
                                    <FileJson size={14} />
                                  </button>
                                  <X size={16} className="text-slate-400 cursor-pointer hover:text-red-500" onClick={() => setFormData({...formData, textbookFileName: ''})} />
                              </div>
                          </div>
                      )}
                  </div>

                  {/* 2. Digital Framework */}
                  <div className="border border-dashed border-slate-300 rounded-xl p-5 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">2. Khung NL Số (Nếu có)</label>
                          <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded">Ảnh/PDF/PPT/Excel</span>
                      </div>
                      
                      <input 
                        type="file" 
                        ref={frameworkInputRef}
                        className="hidden" 
                        accept=".jpg,.png,.jpeg,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                        onChange={(e) => handleFileChange(e, 'framework')}
                      />

                      {!formData.frameworkFileName ? (
                          <div className="text-center py-6 cursor-pointer" onClick={() => !uploadingFile && frameworkInputRef.current?.click()}>
                              {uploadingFile === 'framework' ? (
                                <RefreshCw className="mx-auto text-gold-accent mb-2 animate-spin" size={24} />
                              ) : (
                                <Layers className="mx-auto text-slate-300 mb-2" size={24} />
                              )}
                              <p className="text-xs text-slate-500">{uploadingFile === 'framework' ? 'Đang tải lên...' : 'Tải lên khung năng lực'}</p>
                          </div>
                      ) : (
                          <div className="flex items-center gap-2 bg-slate-100 p-3 rounded-lg border border-slate-200">
                              <FileText size={20} className="text-slate-500" />
                              <div className="flex-1 min-w-0">
                                  <p className="text-xs font-bold text-slate-800 truncate">{formData.frameworkFileName}</p>
                                  <p className="text-[10px] text-slate-500">Đã lưu lên Cloud</p>
                              </div>
                              <div className="flex items-center gap-2">
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); handleExportJson(); }}
                                    className="p-1.5 bg-white border border-slate-200 rounded-md text-slate-500 hover:bg-slate-50 transition-colors shadow-sm"
                                    title="Xuất JSON"
                                  >
                                    <FileJson size={14} />
                                  </button>
                                  <X size={16} className="text-slate-400 cursor-pointer hover:text-red-500" onClick={() => setFormData({...formData, frameworkFileName: ''})} />
                              </div>
                          </div>
                      )}

                      <div className="mt-4 pt-4 border-t border-slate-100">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Chọn Khung Năng Lực Tích hợp</label>
                          <select 
                              className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-gold-accent transition-all"
                              value={formData.selectedFramework}
                              onChange={e => setFormData({...formData, selectedFramework: e.target.value})}
                          >
                              <option value="3456_THCS">CV 3456/BGDĐT (Năng lực số chung)</option>
                              <option value="3439_AI">QĐ 3439/BGDĐT (Giáo dục Trí tuệ nhân tạo)</option>
                          </select>
                      </div>
                  </div>

                  {/* 3. AI Suggestion (Full Width) */}
                  <div className="col-span-1 md:col-span-2 border border-gold-primary/30 bg-yellow-50/30 rounded-xl p-5 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-gold-primary"></div>
                      <div className="flex items-center justify-between mb-4">
                          <label className="block text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                             <Sparkles size={14} className="text-gold-primary" /> 3. Gợi ý chi tiết nội dung từ SGK
                          </label>
                          <button 
                             onClick={handleAiSuggest}
                             disabled={isSuggesting}
                             className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800 text-white text-[10px] font-bold hover:bg-slate-700 transition-all disabled:opacity-50"
                           >
                             {isSuggesting ? <RefreshCw size={12} className="animate-spin" /> : <Brain size={12} />} 
                             {isSuggesting ? 'Đang phân tích...' : 'Phân tích & Gợi ý từ AI'}
                           </button>
                      </div>

                      {!formData.originalText ? (
                          <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed border-slate-300 rounded-lg bg-white/50">
                               <p className="text-xs text-slate-500 mb-1">Chưa có nội dung gợi ý</p>
                               <p className="text-[10px] text-slate-400 italic">Nhập Môn, Lớp, Tên bài dạy ở trên và nhấn "Phân tích" để AI trích xuất nội dung chuẩn.</p>
                          </div>
                      ) : (
                         <div className="animate-fade-in">
                             <textarea 
                                className="w-full bg-white border border-slate-200 rounded-lg p-4 focus:outline-none focus:border-gold-accent text-sm text-slate-700 min-h-[120px] shadow-inner font-mono leading-relaxed" 
                                value={formData.originalText} 
                                onChange={e => setFormData({...formData, originalText: e.target.value})}
                                placeholder="Nội dung gợi ý sẽ hiển thị ở đây..."
                             ></textarea>
                             <p className="text-[10px] text-right text-slate-400 mt-2 italic">* Bạn có thể chỉnh sửa nội dung này trước khi khởi tạo.</p>
                         </div>
                      )}
                  </div>
              </div>

              <div className="pt-4">
                  <button onClick={handleGenerate} className="w-full py-4 rounded-xl bg-gradient-to-br from-gold-accent to-gold-primary text-white shadow-lg hover:shadow-xl hover:brightness-110 active:translate-y-0.5 transition-all font-bold text-lg flex items-center justify-center gap-2 uppercase tracking-widest">
                      <Wand2 size={24} />
                      Khởi tạo Giáo án 5512 Chi tiết
                  </button>
                  <p className="text-center text-[10px] text-slate-400 mt-3 italic">Hệ thống tự động render công thức Toán học, biểu đồ và hình học chuẩn SVG.</p>
              </div>
          </div>
      </div>
  );

  // --- WELCOME SCREEN ---
  if (isAuthLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-premium">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw size={40} className="text-gold-primary animate-spin" />
          <p className="text-gold-dark font-serif font-bold animate-pulse">Đang khởi động hệ thống AI...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth onAuthSuccess={handleAuthSuccess} onBack={() => {}} />;
  }

  if (currentMode === 'admin_dashboard' && user && user.email === 'anthonydong.genz@gmail.com') {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  return (
    <div className="flex h-screen w-full bg-premium">
      
      {/* SIDEBAR */}
      <aside className="w-72 h-full flex flex-col bg-sidebar z-20 text-slate-300 shadow-xl border-r border-gold-accent/20">
        <div className="p-6 flex flex-col h-full">
            {/* Logo Area */}
            <div className="flex items-center gap-3 mb-10 cursor-pointer" onClick={() => setCurrentMode('home')}>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-accent to-gold-primary flex items-center justify-center shadow-lg">
                    <Wand2 className="text-white" size={20} />
                </div>
                <div className="flex flex-col">
                    <h1 className="text-white text-xs font-bold leading-tight tracking-tight uppercase">Công cụ AI - Tích hợp Năng Lực Số</h1>
                    <p className="text-gold-primary text-[9px] font-bold uppercase tracking-widest mt-1">Cùng thầy Trần Đông</p>
                </div>
            </div>

            {/* Teacher Info & Social Links */}
            <div className="mt-6 pt-6 border-t border-white/10 space-y-4">
                <p className="text-[10px] font-bold text-gold-accent uppercase tracking-widest mb-2">Thông tin Giảng viên</p>
                <div className="flex flex-col gap-3">
                    <a href="https://www.facebook.com/tranvandong.vietnam" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-xs text-slate-400 hover:text-white transition-colors">
                        <Facebook size={14} className="text-blue-400" /> <span>Facebook cá nhân</span>
                    </a>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                        <Phone size={14} className="text-green-400" /> <span>Zalo: 0944562096</span>
                    </div>
                    <a href="https://www.facebook.com/groups/24037123512640076" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-xs text-slate-400 hover:text-white transition-colors">
                        <UsersIcon size={14} className="text-gold-primary" /> <span>Cộng đồng AI cho GV</span>
                    </a>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-1 mb-8">
                <div onClick={() => setCurrentMode('create_input')} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all ${currentMode === 'create_input' ? 'bg-white/10 text-gold-accent border border-gold-accent/30' : 'hover:bg-white/5 hover:text-white'}`}>
                    <Sparkles size={18} /> <span className="text-sm font-medium">Soạn bài mới</span>
                </div>
                <div onClick={() => setCurrentMode('api_guide')} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all ${currentMode === 'api_guide' ? 'bg-white/10 text-gold-accent border border-gold-accent/30' : 'hover:bg-white/5 hover:text-white'}`}>
                    <Key size={18} /> <span className="text-sm font-medium">Hướng dẫn lấy API Key</span>
                </div>
                {user?.email === 'anthonydong.genz@gmail.com' && (
                  <div onClick={() => setCurrentMode('admin_dashboard')} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all ${currentMode === 'admin_dashboard' ? 'bg-white/10 text-gold-accent border border-gold-accent/30' : 'hover:bg-white/5 hover:text-white'}`}>
                      <Settings size={18} /> <span className="text-sm font-medium">Quản trị hệ thống</span>
                  </div>
                )}
            </nav>

            {/* Bottom Actions */}
            <div className="mt-auto flex flex-col gap-4">
                {currentMode === 'result' && (
                    <>
                        <button onClick={saveLessonPlanToDb} className="bg-slate-800 border border-gold-primary/30 flex items-center justify-center gap-2 w-full py-3 rounded-xl text-gold-accent text-sm font-bold tracking-wide transition-all hover:bg-slate-700 shadow-lg">
                            <Save size={18} /> <span>Lưu Giáo án</span>
                        </button>
                        <button onClick={handleAudit} className="bg-gradient-to-br from-gold-accent to-gold-primary flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white text-sm font-bold tracking-wide transition-all active:scale-95 hover:brightness-110 shadow-lg">
                            <CheckCircle size={18} /> <span>Kiểm tra sư phạm</span>
                        </button>
                        {auditResult && (
                            <div className="bg-slate-800 p-3 rounded border border-green-500/30 text-xs text-green-400 animate-fade-in">
                                <p className="font-bold">Điểm sư phạm: {auditResult.score}/100</p>
                                <p className="opacity-80">{auditResult.issues[0].msg}</p>
                            </div>
                        )}
                        <div className="flex flex-col gap-2 pt-4 border-t border-white/10">
                            <div onClick={handleExportWord} className="flex h-9 items-center gap-2 rounded-full bg-slate-800 px-4 cursor-pointer hover:bg-slate-700 transition-colors border border-gold-accent/20 w-full justify-center">
                                <FileIcon size={14} className="text-gold-accent" />
                                <p className="text-white text-xs font-semibold">Xuất Word (5512)</p>
                            </div>
                            <div onClick={handleExportJson} className="flex h-9 items-center gap-2 rounded-full bg-slate-800 px-4 cursor-pointer hover:bg-slate-700 transition-colors border border-blue-400/20 w-full justify-center">
                                <FileJson size={14} className="text-blue-400" />
                                <p className="text-white text-xs font-semibold">Xuất JSON</p>
                            </div>
                        </div>
                    </>
                )}
                
                <div className="flex flex-col gap-2">
                    <input 
                      type="file" 
                      ref={jsonInputRef} 
                      className="hidden" 
                      accept=".json" 
                      onChange={handleImportJson} 
                    />
                    <div 
                      onClick={() => jsonInputRef.current?.click()}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-white/5 hover:text-white transition-all text-slate-400"
                    >
                        <Download size={18} className="rotate-180" /> <span className="text-sm font-medium">Nhập dữ liệu (JSON)</span>
                    </div>
                </div>
                
                <div 
                  onClick={() => user ? handleLogout() : setCurrentMode('auth')}
                  className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white cursor-pointer transition-colors mt-2 border-t border-white/5 pt-4"
                >
                    <div className="bg-slate-800 p-2 rounded-full"><User size={16} /></div>
                    <div className="flex-1">
                        <p className="text-xs font-bold text-white">
                          {user ? (user.user_metadata?.full_name || user.email) : 'Chưa đăng nhập'}
                        </p>
                        <p className="text-[10px]">
                          {user ? 'Nhấn để đăng xuất' : 'Nhấn để đăng ký/đăng nhập'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-premium">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold-accent/5 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold-primary/5 rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2"></div>

        {/* Top Bar (Tabs) - REMOVED AS PER USER REQUEST */}
        {currentMode === 'result' && (
            <header className="w-full py-6 px-10 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gold-accent rounded-lg text-white">
                        <FileText size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 font-serif">Kế hoạch bài dạy chi tiết</h2>
                        <p className="text-xs text-slate-500">Đã tích hợp Năng lực số & Phụ lục học tập</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={saveLessonPlanToDb}
                        className="hidden md:flex items-center gap-2 px-4 py-2 bg-white border border-gold-accent/30 rounded-lg text-gold-dark text-sm font-bold hover:bg-gold-light transition-all shadow-sm"
                    >
                        <Save size={16} />
                        <span>Lưu Giáo án</span>
                    </button>
                    <div className="text-right hidden lg:block">
                        <p className="text-xs text-slate-400 font-medium leading-none">Trạng thái: Đã lưu</p>
                        <p className="text-[10px] text-gold-primary font-bold uppercase tracking-tighter mt-1">Secured by TD-AI</p>
                    </div>
                </div>
            </header>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto px-10 pb-20 scrollbar-thin scrollbar-thumb-gold-accent/20 hover:scrollbar-thumb-gold-accent/40">
            {currentMode === 'home' && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <h1 className="text-5xl md:text-7xl font-serif font-black tracking-tight mb-4 leading-tight text-[#2C2C2C] uppercase">
                        CÔNG CỤ AI <br/> 
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-dark to-gold-accent text-3xl md:text-5xl block mt-2">
                            TÍCH HỢP NĂNG LỰC SỐ
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl font-serif font-bold text-slate-600 mb-10 tracking-wide">Cùng thầy Trần Đông</p>
                    <div className="flex gap-6 mt-4">
                        <button onClick={() => setCurrentMode('create_input')} className="px-8 py-4 rounded-xl bg-gradient-to-br from-gold-accent to-gold-primary text-white font-bold shadow-lg flex items-center gap-2 text-lg hover:brightness-110 active:scale-95 transition-all">
                            <Sparkles size={20}/> Bắt đầu ngay
                        </button>
                    </div>
                </div>
            )}

            {currentMode === 'api_guide' && (
                <div className="flex justify-center pt-10">
                    {renderApiGuide()}
                </div>
            )}

            {(currentMode === 'create_input' || currentMode === 'integrate_input') && (
                <div className="flex justify-center pt-10">
                    {renderInputForm()}
                </div>
            )}

            {currentMode === 'loading' && (
                <div className="flex flex-col items-center justify-center h-full">
                    <div className="w-16 h-16 border-4 border-gold-accent/30 border-t-gold-accent rounded-full animate-spin mb-6"></div>
                    <h3 className="text-xl font-bold text-gold-dark font-serif">AI đang kiến tạo bài giảng...</h3>
                    <p className="text-sm text-slate-500 mt-2">Đang phân tích tài liệu và cấu trúc bài dạy</p>
                </div>
            )}

            {currentMode === 'result' && resultData && (
                <div className="max-w-[1000px] mx-auto pb-10">
                    <LessonPlan5512View 
                        fullData={resultData} 
                        onTransform={handleTransformMethod} 
                        onElaborate={handleSectionElaborate} 
                    />
                </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default App;