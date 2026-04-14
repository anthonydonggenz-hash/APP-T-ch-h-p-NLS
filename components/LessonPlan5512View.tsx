import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Check, Layers, FileText, Presentation, Database } from 'lucide-react';
import { ResultData } from '../types';
import ContentRenderer from './ContentRenderer';

interface Props {
  fullData: ResultData;
  onTransform: (index: number, method: string) => void;
  onElaborate: (sectionId: string, prompt: string) => void;
}

const LessonPlan5512View: React.FC<Props> = ({ fullData }) => {
  const data = fullData.lessonPlan;
  const mode = fullData.mode;
  if (!data) return <div className="p-10 text-center text-slate-400">Đang tải dữ liệu...</div>;

  const [expandedSections, setExpandedSections] = useState({
    objectives: true,
    materials: true,
    activities: data.activities ? data.activities.map(() => true) : [],
    appendix1: true,
    appendix2: true,
    appendix3: true
  });

  const toggleActivity = (index: number) => {
    const newActivities = [...expandedSections.activities];
    newActivities[index] = !newActivities[index];
    setExpandedSections({...expandedSections, activities: newActivities});
  };

  return (
    <div className="a4-container font-serif text-[#1e1e1e]">
      {/* Header Công văn */}
      <div className="text-center mb-8 border-b-2 border-slate-100 pb-6">
        <p className="font-bold text-sm uppercase text-slate-500 mb-1 font-sans">KHUNG KẾ HOẠCH BÀI DẠY</p>
        <p className="italic text-xs text-slate-400 font-sans">(Kèm theo Công văn số 5512/BGDĐT-GDTrH)</p>
        <p className="font-bold text-sm text-gold-accent mt-2 font-sans flex items-center justify-center gap-2">
            <Check size={14} /> Căn cứ: Khung năng lực số (Văn bản 3456/BGDĐT-GDPT)
        </p>
        {mode === 'integration' && (
          <div className="inline-block mt-3 px-4 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-[10px] font-bold uppercase tracking-wider animate-pulse">
            Chế độ: Tích hợp Năng lực số vào Giáo án gốc
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-8 mb-6 font-sans text-sm">
        <div>
           <p>Trường: ..............................</p>
           <p>Tổ: ..............................</p>
        </div>
        <div className="text-right">
           <p>Họ và tên giáo viên: <strong>...................</strong></p>
        </div>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold uppercase mb-2">TÊN BÀI DẠY: {data.topic.toUpperCase()}</h1>
        <p className="font-semibold">Môn học: {data.subject}; Lớp: {data.grade}</p>
        <p className="italic">Thời gian thực hiện: {data.duration} tiết</p>
      </div>

      {/* I. MỤC TIÊU */}
      <div className="mb-6">
        <div className="flex items-center justify-between border-b border-black mb-2 pb-1">
           <div className="flex items-center gap-3">
               <h3 className="font-bold text-lg uppercase cursor-pointer" onClick={() => setExpandedSections(p => ({...p, objectives: !p.objectives}))}>
                 I. MỤC TIÊU
               </h3>
           </div>
           <button onClick={() => setExpandedSections(p => ({...p, objectives: !p.objectives}))} className="p-1 hover:bg-slate-100 rounded">
             {expandedSections.objectives ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
           </button>
        </div>
        
        {expandedSections.objectives && (
          <div className="animate-fade-in text-sm leading-relaxed text-justify">
            <div className="mb-3">
              <p className="font-bold">1. Về kiến thức:</p>
              <ul className="list-disc pl-5 space-y-1 ml-2">
                {data.objectives.knowledge.map((item, i) => <li key={i}><ContentRenderer content={item} /></li>)}
              </ul>
            </div>
            <div className="mb-3">
              <p className="font-bold">2. Về năng lực:</p>
              <ul className="list-disc pl-5 space-y-1 ml-2">
                {data.objectives.competency.map((item, i) => <li key={i}><ContentRenderer content={item} /></li>)}
              </ul>
            </div>
            <div className="mb-3">
              <p className="font-bold">3. Về phẩm chất:</p>
              <ul className="list-disc pl-5 space-y-1 ml-2">
                {data.objectives.quality.map((item, i) => <li key={i}><ContentRenderer content={item} /></li>)}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* II. THIẾT BỊ */}
      <div className="mb-6">
        <div className="flex items-center justify-between border-b border-black mb-2 pb-1">
            <div className="flex items-center gap-3">
                <h3 className="font-bold text-lg uppercase cursor-pointer" onClick={() => setExpandedSections(p => ({...p, materials: !p.materials}))}>
                 II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU
               </h3>
            </div>
            <button onClick={() => setExpandedSections(p => ({...p, materials: !p.materials}))} className="p-1 hover:bg-slate-100 rounded">
             {expandedSections.materials ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
           </button>
        </div>
        {expandedSections.materials && (
          <ul className="list-disc pl-5 ml-2 animate-fade-in text-sm leading-relaxed text-justify">
            {data.materials.map((item, i) => <li key={i}><ContentRenderer content={item} /></li>)}
          </ul>
        )}
      </div>

      {/* III. TIẾN TRÌNH */}
      <div>
        <h3 className="font-bold text-lg mb-4 uppercase border-b border-black inline-block">III. TIẾN TRÌNH DẠY HỌC</h3>
        
        {data.activities.map((act, index) => (
          <div key={index} className="mb-6 border border-slate-200 rounded-lg overflow-hidden group">
            <div 
              className="bg-slate-50 p-3 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors"
              onClick={() => toggleActivity(index)}
            >
              <div className="flex items-center gap-3">
                  <h4 className="font-bold text-base border-l-4 border-gold-primary pl-2 font-sans text-slate-800">
                    {act.name}
                  </h4>
              </div>
              
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                 <span className="hidden sm:inline italic font-sans text-xs">
                   {expandedSections.activities[index] ? 'Thu gọn' : 'Xem chi tiết'}
                 </span>
                 {expandedSections.activities[index] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </div>
            </div>
            
            {expandedSections.activities[index] && (
              <div className="p-5 space-y-3 animate-fade-in bg-white text-sm leading-relaxed text-justify">
                <div>
                  <span className="font-bold underline decoration-dotted">a) Mục tiêu:</span> <ContentRenderer content={act.objective} />
                </div>
                <div>
                  <span className="font-bold underline decoration-dotted block mb-1">b) Nội dung:</span>
                  <div className="pl-4 whitespace-pre-line text-slate-700">
                    <ContentRenderer content={act.content} />
                  </div>
                </div>
                <div>
                  <span className="font-bold underline decoration-dotted">c) Sản phẩm:</span> <ContentRenderer content={act.product} />
                </div>
                <div>
                  <span className="font-bold underline decoration-dotted block mb-2">d) Tổ chức thực hiện:</span>
                  
                  <table className="w-full border-collapse border border-slate-400 text-sm mb-3">
                    <thead>
                       <tr className="bg-slate-50">
                          <th className="border border-slate-400 p-2 w-[60%] font-bold text-center">Hoạt động của GV và HS</th>
                          <th className="border border-slate-400 p-2 w-[40%] font-bold text-center">Yêu cầu cần đạt / Sản phẩm dự kiến</th>
                       </tr>
                    </thead>
                    <tbody>
                      {act.steps.map((step, idx) => (
                        <tr key={idx}>
                          <td className="border border-slate-400 p-3 align-top whitespace-pre-line">
                             <div className="font-bold mb-1 uppercase text-xs text-blue-700 font-sans">{step.stepName}</div>
                             <ContentRenderer content={step.teacherAction} />
                          </td>
                          <td className="border border-slate-400 p-3 align-top bg-slate-50/50 whitespace-pre-line italic text-slate-600">
                             <ContentRenderer content={step.output} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {act.digitalIntegration && (
                    <div className="mt-4 p-3 bg-gold-light border border-gold-primary/30 border-dashed rounded-lg font-sans">
                        <div className="flex items-center justify-between mb-2">
                           <div className="flex items-center gap-2 text-gold-dark font-bold text-sm">
                              <Layers size={14} /> TÍCH HỢP NĂNG LỰC SỐ
                           </div>
                           <span className="text-xs bg-white text-gold-dark px-2 py-0.5 rounded border border-gold-primary/30 font-bold shadow-sm">{act.digitalIntegration.code}</span>
                        </div>
                        <div className="text-sm text-slate-700">
                            <p className="mb-1"><span className="font-semibold">Yêu cầu cần đạt:</span> {act.digitalIntegration.requirement}</p>
                            <p className="mb-0 bg-white p-2 rounded border border-gold-primary/20">
                               <span className="font-semibold text-gold-dark">Gợi ý triển khai:</span> {act.digitalIntegration.description}
                            </p>
                        </div>
                    </div>
                  )}

                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* PHỤ LỤC 1: TỔNG HỢP TÍCH HỢP NĂNG LỰC SỐ */}
      <div className="mt-12 pt-8 border-t-2 border-gold-primary/30">
        <div className="flex items-center justify-between mb-4">
           <h3 className="font-bold text-xl text-gold-dark uppercase flex items-center gap-3">
             <Database size={24} /> PHỤ LỤC 1: TỔNG HỢP TÍCH HỢP NĂNG LỰC SỐ
           </h3>
           <button onClick={() => setExpandedSections(p => ({...p, appendix1: !p.appendix1}))} className="p-2 hover:bg-gold-light rounded-full transition-colors">
             {expandedSections.appendix1 ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
           </button>
        </div>
        
        {expandedSections.appendix1 && (
          <div className="animate-fade-in bg-gold-light/30 p-6 rounded-xl border border-gold-primary/20">
            <p className="mb-4 text-sm italic text-slate-600">{fullData.digitalPack.summary}</p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
                <thead>
                  <tr className="bg-gold-accent text-white text-sm">
                    <th className="p-3 text-left border border-gold-accent">Hoạt động</th>
                    <th className="p-3 text-left border border-gold-accent">Mã NL Số</th>
                    <th className="p-3 text-left border border-gold-accent">Công cụ & Hành động</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {fullData.digitalPack.mapping.map((m, i) => (
                    <tr key={i} className="hover:bg-gold-light/10 transition-colors">
                      <td className="p-3 border border-slate-200 font-medium">{m.activity}</td>
                      <td className="p-3 border border-slate-200"><span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold">{m.competencyCode}</span></td>
                      <td className="p-3 border border-slate-200">
                        <span className="font-bold text-gold-dark">{m.tool}:</span> {m.action}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* PHỤ LỤC 2: PHIẾU HỌC TẬP */}
      <div className="mt-12 pt-8 border-t-2 border-slate-200">
        <div className="flex items-center justify-between mb-4">
           <h3 className="font-bold text-xl text-slate-800 uppercase flex items-center gap-3">
             <FileText size={24} /> PHỤ LỤC 2: PHIẾU HỌC TẬP
           </h3>
           <button onClick={() => setExpandedSections(p => ({...p, appendix2: !p.appendix2}))} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
             {expandedSections.appendix2 ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
           </button>
        </div>
        
        {expandedSections.appendix2 && (
          <div className="animate-fade-in space-y-6">
            {fullData.worksheets.map((ws, i) => (
              <div key={i} className="bg-white border-2 border-slate-100 p-8 rounded-xl shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-300"></div>
                <h4 className="text-lg font-bold text-center mb-2 underline decoration-double">{ws.title}</h4>
                <p className="text-sm text-center italic text-slate-500 mb-6">{ws.description}</p>
                <div className="space-y-6">
                  {ws.content.map((q, j) => (
                    <div key={j} className="text-sm">
                      <p className="font-bold mb-2">{j+1}. <ContentRenderer content={q.question} /></p>
                      <div className="h-24 border-b border-dashed border-slate-300"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PHỤ LỤC 3: DÀN Ý BÀI TRÌNH CHIẾU */}
      <div className="mt-12 pt-8 border-t-2 border-slate-200 mb-20">
        <div className="flex items-center justify-between mb-4">
           <h3 className="font-bold text-xl text-slate-800 uppercase flex items-center gap-3">
             <Presentation size={24} /> PHỤ LỤC 3: DÀN Ý BÀI TRÌNH CHIẾU (SLIDES)
           </h3>
           <button onClick={() => setExpandedSections(p => ({...p, appendix3: !p.appendix3}))} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
             {expandedSections.appendix3 ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
           </button>
        </div>
        
        {expandedSections.appendix3 && (
          <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 gap-4">
            {fullData.slides.map((s, i) => (
              <div key={i} className="bg-slate-800 text-white p-5 rounded-xl shadow-lg border border-white/10 flex flex-col">
                <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gold-accent">Slide {i+1}</span>
                  <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded">{s.type}</span>
                </div>
                <h5 className="font-bold text-sm mb-3 text-gold-light">{s.title}</h5>
                <ul className="text-xs space-y-2 flex-1">
                  {s.points.map((p, k) => (
                    <li key={k} className="flex gap-2">
                      <span className="text-gold-accent">•</span>
                      <span className="opacity-80">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonPlan5512View;