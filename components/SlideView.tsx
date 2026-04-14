import React from 'react';
import { Slide } from '../types';

interface Props {
  data: Slide[];
}

const SlideView: React.FC<Props> = ({ data }) => {
    if (!data) return <div className="p-8 text-center text-slate-500">Đang cập nhật dữ liệu...</div>;

    return (
        <div className="a4-container bg-slate-50">
            <h2 className="text-xl font-bold text-center mb-8 uppercase text-gold-primary font-serif pt-4">Dàn Ý Trình Chiếu (PowerPoint)</h2>
            <div className="grid grid-cols-1 gap-8">
                {data.map((slide, idx) => (
                    <div key={idx} className="bg-white border border-slate-200 aspect-video rounded shadow-sm hover:shadow-lg transition-shadow p-8 flex flex-col justify-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-gold-accent to-gold-primary"></div>
                        <div className="flex justify-between items-center mb-4">
                            <span className="font-bold text-2xl text-gold-dark font-serif">Slide {idx + 1}</span>
                            <span className="text-xs bg-gold-light text-gold-primary px-3 py-1 rounded-full uppercase tracking-widest font-bold">{slide.type}</span>
                        </div>
                        <h4 className="font-bold text-xl text-slate-800 mb-4">{slide.title}</h4>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600">
                            {slide.points.map((p, i) => (
                                <li key={i}>{p}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SlideView;
