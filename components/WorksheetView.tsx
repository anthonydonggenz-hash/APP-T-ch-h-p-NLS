import React, { useState } from 'react';
import { Worksheet } from '../types';

interface Props {
  data: Worksheet[];
}

const WorksheetView: React.FC<Props> = ({ data }) => {
    const [level, setLevel] = useState(0); 
    if (!data) return <div className="p-8 text-center text-slate-500">Đang cập nhật dữ liệu...</div>;

    return (
        <div className="a4-container font-sans">
            <h2 className="text-xl font-bold text-center mb-6 uppercase text-gold-primary font-serif">Phiếu Học Tập Phân Hoá</h2>
            
            <div className="flex justify-center mb-8">
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    {data.map((ws, idx) => (
                        <button 
                            key={idx}
                            onClick={() => setLevel(idx)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${level === idx ? 'bg-white shadow text-gold-dark font-bold' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            {ws.title}
                        </button>
                    ))}
                </div>
            </div>

            <div className="border-2 border-slate-800 p-8 rounded-sm bg-white min-h-[500px]">
                <div className="text-center border-b-2 border-slate-800 pb-4 mb-6">
                    <h3 className="font-bold text-lg uppercase font-serif">{data[level].title}</h3>
                    <p className="text-slate-500 italic text-sm mt-1">{data[level].description}</p>
                </div>
                
                <div className="space-y-8">
                    {data[level].content.map((item, i) => (
                        <div key={i}>
                            <p className="font-bold text-slate-900 mb-2">Câu {i+1}: {item.question}</p>
                            <div className="w-full p-4 border border-dotted border-slate-400 rounded bg-slate-50 min-h-[80px] text-slate-400 italic text-xs">
                                {item.type === 'essay' ? '..................................................................................................' : '(Khoảng trống trả lời)'}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WorksheetView;
