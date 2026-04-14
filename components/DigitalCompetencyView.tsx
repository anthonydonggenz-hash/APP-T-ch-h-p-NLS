import React from 'react';
import { DigitalPack } from '../types';

interface Props {
  data: DigitalPack;
  topic: string;
}

const DigitalCompetencyView: React.FC<Props> = ({ data, topic }) => {
    if (!data) return <div className="p-8 text-center text-slate-500">Đang cập nhật dữ liệu...</div>;

    return (
    <div className="a4-container font-sans">
    <h2 className="text-xl font-bold text-center mb-2 uppercase text-gold-primary font-serif">Phụ Lục: Tích Hợp Năng Lực Số</h2>
    <p className="text-center text-sm text-slate-500 mb-8 italic">(Dành cho giáo án: {topic})</p>
    
    <div className="bg-gold-light p-6 rounded-lg mb-8 text-sm text-gold-dark border-l-4 border-gold-primary">
        <strong>Tổng quan chiến lược:</strong> {data.summary}
    </div>

    <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-slate-300 text-sm">
        <thead className="bg-slate-100 text-slate-700">
            <tr>
            <th className="border border-slate-300 p-3 w-1/4">Hoạt động</th>
            <th className="border border-slate-300 p-3 w-1/4">Năng lực số mục tiêu</th>
            <th className="border border-slate-300 p-3 w-1/4">Công cụ & Thao tác</th>
            <th className="border border-slate-300 p-3 w-1/4">Minh chứng & Đánh giá</th>
            </tr>
        </thead>
        <tbody>
            {data.mapping.map((row, idx) => (
            <tr key={idx} className="hover:bg-slate-50 transition-colors">
                <td className="border border-slate-300 p-3 font-medium align-top">{row.activity}</td>
                <td className="border border-slate-300 p-3 text-slate-600 align-top">
                    <span className="inline-block px-2 py-1 bg-gold-light text-gold-dark rounded text-xs font-bold mb-1 border border-gold-primary/20">{row.competencyCode}</span>
                    <br/>
                    {row.competency}
                </td>
                <td className="border border-slate-300 p-3 align-top">
                <div className="font-bold text-blue-600 flex items-center gap-1">
                    {row.tool}
                </div>
                <div className="text-xs text-slate-500 mt-2 p-2 bg-slate-50 rounded border border-slate-200">
                    <strong>GV:</strong> {row.action}
                </div>
                </td>
                <td className="border border-slate-300 p-3 italic text-slate-600 align-top">
                    {row.evidence}
                </td>
            </tr>
            ))}
        </tbody>
        </table>
    </div>
    </div>
    );
};

export default DigitalCompetencyView;
