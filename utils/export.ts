import { ResultData } from "../types";

export const renderWordHTML = (fullData: ResultData): string => {
  const data = fullData.lessonPlan;
  if (!data || !data.activities) return "";
  
  const activitiesHtml = data.activities.map(act => {
      const digitalBlock = act.digitalIntegration ? `
        <div style="border: 1px solid #C5A021; background-color: #F9F6E5; padding: 10px; margin-top: 10px; font-size: 11pt; border-left: 4px solid #C5A021;">
           <b>[TÍCH HỢP NĂNG LỰC SỐ - 3456]</b><br/>
           <b>Mã tiêu chí:</b> ${act.digitalIntegration.code}<br/>
           <b>Yêu cầu cần đạt:</b> ${act.digitalIntegration.requirement}<br/>
           <b>Gợi ý triển khai:</b> ${act.digitalIntegration.description}
        </div>
      ` : '';

      return `
        <div style="margin-bottom: 20px;">
          <h4 style="font-weight: bold; background-color: #f2f2f2; padding: 5px; text-transform: uppercase;">${act.name}</h4>
          <p><b>a) Mục tiêu:</b> ${act.objective}</p>
          <p><b>b) Nội dung:</b><br/>${act.content.replace(/\n/g, '<br/>')}</p>
          <p><b>c) Sản phẩm:</b> ${act.product.replace(/\n/g, '<br/>')}</p>
          <p><b>d) Tổ chức thực hiện:</b></p>
          <table style="width: 100%; border-collapse: collapse; border: 1px solid black;">
            <thead>
              <tr>
                <th style="width: 60%; background-color: #e0e0e0; border: 1px solid black; padding: 5px;">Hoạt động của GV và HS</th>
                <th style="width: 40%; background-color: #e0e0e0; border: 1px solid black; padding: 5px;">Yêu cầu cần đạt</th>
              </tr>
            </thead>
            <tbody>
              ${act.steps.map(step => `
                <tr>
                  <td style="border: 1px solid black; padding: 5px;">
                    <div style="font-weight: bold; text-decoration: underline;">${step.stepName}</div>
                    ${step.teacherAction.replace(/\n/g, '<br/>')}
                  </td>
                  <td style="border: 1px solid black; padding: 5px;"><i>${step.output.replace(/\n/g, '<br/>')}</i></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          ${digitalBlock}
        </div>
      `;
  }).join('');

  return `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'><title>Giáo án</title>
    <style>body { font-family: 'Times New Roman'; font-size: 13pt; line-height: 1.5; }</style>
    </head><body>
    <div style="text-align: center; margin-bottom: 20px;">
      <p style="font-weight: bold;">KHUNG KẾ HOẠCH BÀI DẠY</p>
      <p style="font-style: italic;">(Kèm theo Công văn số 5512/BGDĐT-GDTrH)</p>
      <p style="font-weight: bold; color: #C5A021;">Căn cứ: Khung năng lực số (Văn bản 3456/BGDĐT-GDPT)</p>
    </div>
    <h1 style="font-size: 16pt; margin-top: 20px; text-align: center; text-transform: uppercase;">TÊN BÀI DẠY: ${data.topic.toUpperCase()}</h1>
    <p style="text-align: center;">Môn học: ${data.subject}; Lớp: ${data.grade}</p>
    
    <h3>I. MỤC TIÊU</h3>
    <p><b>1. Về kiến thức:</b></p><ul>${data.objectives.knowledge.map(i => `<li>${i}</li>`).join('')}</ul>
    <p><b>2. Về năng lực:</b></p><ul>${data.objectives.competency.map(i => `<li>${i}</li>`).join('')}</ul>
    <p><b>3. Về phẩm chất:</b></p><ul>${data.objectives.quality.map(i => `<li>${i}</li>`).join('')}</ul>

    <h3>II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU</h3>
    <ul>${data.materials.map(i => `<li>${i}</li>`).join('')}</ul>

    <h3>III. TIẾN TRÌNH DẠY HỌC</h3>
    ${activitiesHtml}

    <br clear="all" style="page-break-before:always" />
    <h2 style="text-align: center; text-transform: uppercase; color: #C5A021; border-bottom: 2px solid #C5A021; padding-bottom: 10px;">PHỤ LỤC 1: TỔNG HỢP TÍCH HỢP NĂNG LỰC SỐ</h2>
    <p>${fullData.digitalPack.summary}</p>
    <table style="width: 100%; border-collapse: collapse; border: 1px solid black;">
      <thead>
        <tr style="background-color: #f2f2f2;">
          <th style="border: 1px solid black; padding: 5px;">Hoạt động</th>
          <th style="border: 1px solid black; padding: 5px;">Mã NL Số</th>
          <th style="border: 1px solid black; padding: 5px;">Công cụ/Hành động</th>
        </tr>
      </thead>
      <tbody>
        ${fullData.digitalPack.mapping.map(m => `
          <tr>
            <td style="border: 1px solid black; padding: 5px;">${m.activity}</td>
            <td style="border: 1px solid black; padding: 5px;">${m.competencyCode}</td>
            <td style="border: 1px solid black; padding: 5px;"><b>${m.tool}:</b> ${m.action}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <br clear="all" style="page-break-before:always" />
    <h2 style="text-align: center; text-transform: uppercase; border-bottom: 2px solid black; padding-bottom: 10px;">PHỤ LỤC 2: PHIẾU HỌC TẬP</h2>
    ${fullData.worksheets.map(ws => `
      <div style="margin-bottom: 30px; border: 1px solid #ccc; padding: 15px;">
        <h4 style="text-align: center; text-decoration: underline;">${ws.title}</h4>
        <p><i>${ws.description}</i></p>
        <ol>
          ${ws.content.map(q => `
            <li style="margin-bottom: 15px;">
              ${q.question.replace(/\n/g, '<br/>')}
              <div style="margin-top: 10px; border-bottom: 1px dotted black; height: 20px;"></div>
              <div style="margin-top: 10px; border-bottom: 1px dotted black; height: 20px;"></div>
            </li>
          `).join('')}
        </ol>
      </div>
    `).join('')}

    <br clear="all" style="page-break-before:always" />
    <h2 style="text-align: center; text-transform: uppercase; border-bottom: 2px solid black; padding-bottom: 10px;">PHỤ LỤC 3: DÀN Ý BÀI TRÌNH CHIẾU (SLIDES)</h2>
    <table style="width: 100%; border-collapse: collapse; border: 1px solid black;">
      <thead>
        <tr style="background-color: #f2f2f2;">
          <th style="border: 1px solid black; padding: 5px; width: 20%;">Slide</th>
          <th style="border: 1px solid black; padding: 5px;">Nội dung chính</th>
        </tr>
      </thead>
      <tbody>
        ${fullData.slides.map((s, idx) => `
          <tr>
            <td style="border: 1px solid black; padding: 5px; text-align: center;"><b>Slide ${idx + 1}</b><br/>(${s.type})</td>
            <td style="border: 1px solid black; padding: 5px;">
              <p style="font-weight: bold; color: #2c3e50;">${s.title}</p>
              <ul>
                ${s.points.map(p => `<li>${p}</li>`).join('')}
              </ul>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    </body></html>
  `;
};
