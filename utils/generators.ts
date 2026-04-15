import { DIGITAL_COMPETENCY_DB, AI_EDUCATION_FRAMEWORK } from '../constants';
import { FormData, LessonPlan, Worksheet, Slide, DigitalPack, AssessmentQuestion } from '../types';

const getTopicContext = (topic: string, subject: string, isMath: boolean) => {
    const topicLower = topic.toLowerCase();
    const subjectLower = subject.toLowerCase();

    let context = {
        definition: `Khái niệm và tính chất của ${topic}.`,
        realWorld: `Ứng dụng của ${topic} trong thực tiễn.`,
        exercises: `Các bài tập tính toán và chứng minh liên quan đến ${topic}.`,
        keywords: [topic],
        diagram: ""
    };

    if (isMath) {
        if (topicLower.includes("hình bình hành")) {
            context = {
                definition: `Hình bình hành là tứ giác có các cạnh đối song song.\nCông thức diện tích: $S = a \\cdot h$\nTính chất: Các cạnh đối bằng nhau ($AB = CD$), góc đối bằng nhau.`,
                realWorld: "Mái nhà, khung cửa sổ, họa tiết trang trí, cơ cấu xe nâng (hình bình hành động).",
                exercises: "Chứng minh một tứ giác là hình bình hành. Tính độ dài cạnh, số đo góc.",
                keywords: ["cạnh đối song song", "hai đường chéo", "trung điểm", "AB // CD", "AD = BC"],
                diagram: `<svg width="200" height="100" viewBox="0 0 200 100"><path d="M50 80 L180 80 L150 20 L20 20 Z" fill="none" stroke="black" stroke-width="2"/><text x="15" y="20" font-size="12">A</text><text x="155" y="20" font-size="12">B</text><text x="185" y="80" font-size="12">C</text><text x="40" y="80" font-size="12">D</text></svg>`
            };
        } else if (topicLower.includes("đường tròn") || topicLower.includes("phương trình đường tròn")) {
            context = {
                definition: `Phương trình đường tròn tâm $I(a; b)$ bán kính $R$:\n$$(x - a)^2 + (y - b)^2 = R^2$$`,
                realWorld: "Quỹ đạo chuyển động tròn, phạm vi phủ sóng radar, thiết kế bánh răng.",
                exercises: "Viết phương trình đường tròn đi qua 3 điểm. Xác định tâm và bán kính từ phương trình cho trước.",
                keywords: ["tâm I", "bán kính R", "x² + y²", "tiếp tuyến"],
                diagram: `<svg width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" stroke="black" stroke-width="2" fill="none" /><circle cx="50" cy="50" r="2" fill="black"/><text x="55" y="55" font-size="12">I</text></svg>`
            };
        } else if (topicLower.includes("vectơ") || topicLower.includes("vector")) {
            context = {
                definition: "Vectơ là một đoạn thẳng có hướng. Đặc trưng bởi độ dài và hướng.\nKý hiệu: $\\vec{u}, \\vec{v}, \\vec{AB}$",
                realWorld: "Biểu diễn lực, vận tốc trong Vật lý. Định vị GPS.",
                exercises: `Tính tổng: $\\vec{u} + \\vec{v}$\nTích vô hướng: $\\vec{u} \\cdot \\vec{v} = |\\vec{u}| \\cdot |\\vec{v}| \\cdot \\cos(\\vec{u}, \\vec{v})$`,
                keywords: ["độ dài", "hướng", "cùng phương", "tổng hai vectơ"],
                diagram: `<svg width="150" height="50" viewBox="0 0 150 50"><defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L9,3 z" fill="#000" /></marker></defs><line x1="10" y1="25" x2="130" y2="25" stroke="#000" stroke-width="2" marker-end="url(#arrow)" /><text x="70" y="15" font-size="14">u</text></svg>`
            };
        } else if (topicLower.includes("phương trình") || topicLower.includes("hàm số")) {
             context = {
                definition: `Hàm số bậc hai có dạng: $$y = ax^2 + bx + c \\quad (a \\neq 0)$$`,
                realWorld: "Quỹ đạo ném vật (Parabol), thiết kế cầu treo, ăng-ten parabol.",
                exercises: `Giải phương trình $ax^2 + bx + c = 0$. Tìm đỉnh Parabol $I(-\\frac{b}{2a}; -\\frac{\\Delta}{4a})$.`,
                keywords: ["parabol", "đỉnh I", "trục đối xứng"],
                diagram: `<svg width="100" height="100" viewBox="0 0 100 100"><path d="M10 10 Q50 90 90 10" stroke="black" fill="none"/><line x1="50" y1="0" x2="50" y2="100" stroke="gray" stroke-dasharray="4"/><line x1="0" y1="50" x2="100" y2="50" stroke="gray" stroke-dasharray="4"/></svg>`
            };
        }
    } else if (subjectLower.includes("văn") || subjectLower.includes("ngữ văn")) {
        context = {
            definition: `Phân tích các giá trị nội dung và nghệ thuật của tác phẩm/chủ đề: ${topic}.`,
            realWorld: `Liên hệ các thông điệp của ${topic} với đời sống tâm hồn và xã hội hiện nay.`,
            exercises: `Viết đoạn văn nghị luận xã hội hoặc nghị luận văn học về ${topic}.`,
            keywords: ["biện pháp tu từ", "ngôn ngữ", "hình tượng", "thông điệp"],
            diagram: ""
        };
    } else if (subjectLower.includes("lý") || subjectLower.includes("vật lý")) {
        context = {
            definition: `Các định luật và hiện tượng vật lý liên quan đến ${topic}.`,
            realWorld: `Ứng dụng của ${topic} trong kỹ thuật, đời sống và công nghệ.`,
            exercises: `Giải các bài tập tính toán đại lượng vật lý liên quan đến ${topic}.`,
            keywords: ["lực", "năng lượng", "biến thiên", "định luật"],
            diagram: ""
        };
    }

    return context;
};

export const generateAiSuggestion = (formData: FormData): string => {
    const { topic, subject, grade } = formData;
    const isMath = subject.toLowerCase().includes('toán') || subject.toLowerCase().includes('hình') || subject.toLowerCase().includes('đại');
    const topicUpper = topic.toUpperCase();
    const context = getTopicContext(topic, subject, isMath);

    const sgkSeries = ["Kết nối tri thức với cuộc sống", "Chân trời sáng tạo", "Cánh diều"];
    const randomSgk = sgkSeries[Math.floor(Math.random() * sgkSeries.length)];

    if (isMath) {
        return `[AI GỢI Ý - CHUẨN SGK: ${randomSgk}]
BÀI DẠY: ${topicUpper}
Môn: ${subject} - Lớp: ${grade}

I. YÊU CẦU CẦN ĐẠT (Theo Chương trình GDPT 2018):
- Kiến thức: HS nắm vững ${context.definition}
- Năng lực: HS phát triển năng lực giải quyết vấn đề toán học thông qua ${context.exercises}
- Phẩm chất: Trung thực, trách nhiệm và tư duy logic.

II. NỘI DUNG CHI TIẾT (Bám sát SGK):
1. Hoạt động Khởi động:
- Tình huống thực tế: ${context.realWorld}
- Câu hỏi dẫn dắt: Làm thế nào để ứng dụng ${topic} vào thực tiễn?

2. Hình thành kiến thức mới:
- Định nghĩa: ${context.definition}
- Các tính chất/quy tắc quan trọng: ${context.keywords.join(', ')}.

3. Luyện tập & Vận dụng:
- Giải các bài tập trong SGK (Trang tương ứng của bộ sách ${randomSgk}).
- Bài tập mở rộng: ${context.exercises}

(Nội dung được tối ưu hóa cho việc dạy học tích hợp Năng lực số)`;
    }

    return `[AI GỢI Ý - CHUẨN SGK: ${randomSgk}]
BÀI DẠY: ${topicUpper}
MÔN: ${subject.toUpperCase()} - LỚP ${grade}

I. YÊU CẦU CẦN ĐẠT (Theo Chương trình GDPT 2018):
- Nêu được khái niệm và các đặc điểm cốt lõi của ${topic}.
- Giải thích được ý nghĩa thực tiễn: ${context.realWorld}
- Phát triển năng lực tự chủ, tự học và giao tiếp hợp tác.

II. NỘI DUNG CHI TIẾT:
1. Khám phá: Tìm hiểu về ${topic} qua các ngữ liệu trong SGK ${randomSgk}.
2. Phân tích: Làm rõ ${context.keywords[0]} và các giá trị liên quan.
3. Thực hành: Vận dụng kiến thức vào bài tập thực tế: ${context.realWorld}

(Nội dung được trích xuất chuẩn theo Công văn 5512/BGDĐT)`;
};

export const generateDetailed5512Plan = (formData: FormData, isMath: boolean): LessonPlan => {
    const pickComp = (code: string) => DIGITAL_COMPETENCY_DB.find(c => c.code === code) || DIGITAL_COMPETENCY_DB[0];
    
    // Helper for AI Education Framework (QĐ 3439)
    const pickAiComp = (code: string) => {
        const comp = AI_EDUCATION_FRAMEWORK.find(c => c.code === code);
        if (!comp) return { code: "NLa", domain: "AI", requirement: "AI Education" };
        
        const gradeNum = parseInt(formData.grade);
        let req = comp.requirement.primary;
        if (gradeNum >= 6 && gradeNum <= 9) req = comp.requirement.secondary;
        if (gradeNum >= 10) req = comp.requirement.high;
        
        return { code: comp.code, domain: comp.domain, requirement: req };
    };

    // 1. CHUẨN HÓA DỮ LIỆU ĐẦU VÀO
    const topic = formData.topic.trim() || "Bài học mới";
    const subject = formData.subject || "Môn học";
    const grade = formData.grade || "10";
    const hasOriginalText = formData.originalText && formData.originalText.length > 50;

    // 2. XÁC ĐỊNH NGỮ CẢNH BÀI DẠY (CONTEXT)
    const context = getTopicContext(topic, subject, isMath);

    // 3. XÂY DỰNG MỤC TIÊU (OBJECTIVES)
    const objectives = {
        knowledge: [
            hasOriginalText 
                ? `Trình bày được các kiến thức cốt lõi về ${topic} dựa trên tài liệu SGK đã cung cấp.` 
                : `Phát biểu được định nghĩa, tính chất, dấu hiệu nhận biết của ${topic}.`,
            `Hệ thống hóa được các công thức/định lý liên quan đến ${topic}.`,
            `Giải thích được mối liên hệ giữa ${topic} và các kiến thức đã học trước đó.`
        ],
        competency: [
            "Tư duy và lập luận: Phân tích, tổng hợp các dữ kiện để giải quyết vấn đề.",
            "Mô hình hóa: Chuyển đổi bài toán thực tế về mô hình lý thuyết (nếu có).",
            `Giao tiếp chuyên môn: Sử dụng đúng các thuật ngữ, ký hiệu (${context.keywords.join(", ")}).`,
            "Sử dụng công cụ, phương tiện học tập: Máy tính cầm tay, phần mềm hỗ trợ."
        ],
        quality: [
            "Chăm chỉ: Tích cực tìm tòi, giải quyết các bài tập trong SGK.",
            "Trung thực: Nghiêm túc trong kiểm tra, đánh giá, tự giác làm bài tập về nhà."
        ]
    };

    // 4. THIẾT BỊ DẠY HỌC
    const materials = [
        hasOriginalText ? `Tài liệu/Giáo án điện tử: ${formData.textbookFileName || "Nội dung từ AI"}` : `Sách giáo khoa ${subject} ${grade} - Bộ sách Kết nối tri thức với cuộc sống.`,
        "Kế hoạch bài dạy, bài trình chiếu (Slide), phiếu học tập.",
        "Thước thẳng, compa, êke, phấn màu.",
        "Máy tính, tivi/màn hình chiếu tương tác."
    ];

    // Nếu có nội dung từ AI/File tải lên, ưu tiên sử dụng nội dung đó làm context
    if (hasOriginalText) {
        const aiComp = pickAiComp("NLa");
        return {
            topic: topic.toUpperCase(),
            subject: subject,
            grade: grade,
            duration: formData.duration || "1",
            objectives: {
                knowledge: [
                    `Bám sát các yêu cầu cần đạt về kiến thức trong giáo án gốc của bài dạy: ${topic}.`,
                    `[RED: Tích hợp NLS: Khai thác và sử dụng các nguồn học liệu số liên quan đến ${topic} để mở rộng kiến thức.]`
                ],
                competency: [
                    `Phát triển năng lực chuyên môn theo kế hoạch bài dạy đã có.`, 
                    `[RED: Năng lực số (${aiComp.code}): ${aiComp.requirement}]`,
                    `[RED: Năng lực số: Ứng dụng CNTT và truyền thông trong dạy học để nâng cao hiệu quả bài dạy.]`
                ],
                quality: [
                    "Chăm chỉ, trung thực và trách nhiệm trong học tập.",
                    `[RED: Trách nhiệm số: Có ý thức bảo vệ thông tin cá nhân và tuân thủ đạo đức khi sử dụng AI/Internet.]`
                ]
            },
            materials: [
                ...materials,
                "[RED: Học liệu số: Bài trình chiếu, video clip, phần mềm mô phỏng, công cụ AI hỗ trợ.]",
                "[RED: Thiết bị số: Máy tính, máy chiếu, bảng tương tác, thiết bị di động.]"
            ],
            activities: [
                {
                    name: "NỘI DUNG GIÁO ÁN GỐC (BẢO TOÀN 100%)",
                    objective: "Thực hiện đầy đủ các mục tiêu kiến thức, kĩ năng theo kế hoạch bài dạy đã có.",
                    content: formData.originalText + "\n\n[RED: --- ĐIỂM TÍCH HỢP NĂNG LỰC SỐ ---\nBổ sung các hoạt động ứng dụng công nghệ để minh họa và thực hành nội dung trên.]",
                    product: "Kết quả học tập của học sinh theo tiến trình giáo án cũ.",
                    steps: [
                        { 
                            stepName: "Tiến trình dạy học", 
                            teacherAction: "Giáo viên thực hiện các hoạt động dạy học (Khởi động, Hình thành kiến thức, Luyện tập, Vận dụng) đúng theo nội dung giáo án đã tải lên.\n\n[RED: Tích hợp (${aiComp.code}): GV hướng dẫn HS sử dụng thiết bị số để truy cập học liệu, thực hiện các nhiệm vụ học tập trên môi trường số.]", 
                            output: "Học sinh đạt được các yêu cầu về kiến thức và kĩ năng của bài học.\n[RED: HS hình thành kĩ năng thao tác trên thiết bị số.]" 
                        }
                    ]
                },
                {
                    name: "LỚP TÍCH HỢP NĂNG LỰC SỐ (NÂNG CẤP THEO QĐ 3439 & CV 3456)",
                    objective: "Nâng cấp bài dạy đáp ứng yêu cầu chuyển đổi số và giáo dục Trí tuệ nhân tạo.",
                    content: `Dựa trên nội dung bài dạy ${topic}, hệ thống đề xuất các điểm tích hợp Năng lực số và AI như sau:`,
                    product: "Sản phẩm học tập số, kĩ năng khai thác công cụ AI của học sinh.",
                    steps: [
                        {
                            stepName: "Tích hợp 1: Khai thác học liệu số",
                            teacherAction: `[RED: Trong quá trình dạy học, GV hướng dẫn HS sử dụng các công cụ tìm kiếm hoặc AI để mở rộng kiến thức về ${topic}. (Mã: 1.1.TC1b)]`,
                            output: "[RED: HS biết cách chọn lọc và đánh giá thông tin số.]"
                        },
                        {
                            stepName: "Tích hợp 2: Tư duy AI & Đạo đức số",
                            teacherAction: "[RED: GV lồng ghép thảo luận về vai trò của công nghệ và trách nhiệm khi sử dụng AI trong học tập. (Mã: 5.1.TC2a)]",
                            output: "[RED: HS hình thành ý thức về đạo đức và an toàn trên không gian mạng.]"
                        }
                    ],
                    digitalIntegration: {
                        code: aiComp.code,
                        requirement: aiComp.requirement,
                        description: `[RED: Tích hợp Năng lực số theo Khung giáo dục AI mới nhất (QĐ 3439/BGDĐT). Giữ nguyên tiến trình cũ, chỉ bổ sung các "điểm chạm công nghệ" để nâng tầm bài dạy.]`
                    }
                }
            ]
        };
    }

    // 5. TIẾN TRÌNH DẠY HỌC (4 HOẠT ĐỘNG)
    const activities = [
        {
            name: "HOẠT ĐỘNG 1: KHỞI ĐỘNG (WARM-UP)",
            objective: `Gợi mở, tạo tâm thế hứng thú cho HS tìm hiểu về ${topic}.`,
            content: `GV đưa ra tình huống thực tế hoặc bài toán mở đầu liên quan đến: ${context.realWorld}`,
            product: "Câu trả lời của HS, sự tò mò cần giải đáp.",
            steps: [
                { 
                    stepName: "Bước 1: Chuyển giao nhiệm vụ", 
                    teacherAction: `GV chiếu hình ảnh/video về ${context.realWorld}.\nGV đặt câu hỏi: "Các em có nhận xét gì về hình dạng/đặc điểm của các đối tượng trong hình?"`, 
                    output: "HS quan sát, lắng nghe." 
                },
                { 
                    stepName: "Bước 2: Thực hiện nhiệm vụ", 
                    teacherAction: "HS quan sát, suy nghĩ cá nhân và trao đổi nhanh với bạn cùng bàn.", 
                    output: "HS thảo luận sôi nổi." 
                },
                { 
                    stepName: "Bước 3: Báo cáo, thảo luận", 
                    teacherAction: "GV gọi 1-2 HS trả lời.\nGV ghi nhận các ý kiến (kể cả ý kiến chưa chính xác).", 
                    output: "HS trình bày quan điểm." 
                },
                { 
                    stepName: "Bước 4: Kết luận, nhận định", 
                    teacherAction: `GV dẫn dắt: "Để hiểu rõ hơn về tính chất và ứng dụng của nó, chúng ta cùng vào bài mới: ${topic}."`, 
                    output: "HS ghi tên bài vào vở." 
                }
            ],
            digitalIntegration: formData.selectedFramework === '3439_AI' ? {
                code: "NLa",
                requirement: pickAiComp("NLa").requirement,
                description: "Sử dụng AI để trực quan hóa tình huống khởi động."
            } : {
                code: "1.1.TC1a", 
                requirement: pickComp("1.1.TC1a").requirement,
                description: "Sử dụng hình ảnh/video đa phương tiện để trực quan hóa vấn đề."
            }
        },
        {
            name: "HOẠT ĐỘNG 2: HÌNH THÀNH KIẾN THỨC MỚI",
            objective: `HS nắm vững định nghĩa, định lý, công thức của ${topic}.`,
            content: `Tìm hiểu nội dung:\n1. Định nghĩa/Khái niệm.\n2. Tính chất/Định lý.\n\nChi tiết: ${context.definition}\n${context.diagram}`,
            product: "HS ghi vở các kiến thức trọng tâm. Hoàn thành Phiếu học tập số 1.",
            steps: [
                { 
                    stepName: "Bước 1: Chuyển giao nhiệm vụ", 
                    teacherAction: `GV chia lớp thành 4 nhóm.\nYêu cầu các nhóm đọc SGK (hoặc tài liệu ${formData.textbookFileName}) phần Kiến thức trọng tâm.\nTrả lời câu hỏi trong Phiếu học tập số 1.`, 
                    output: "HS nhận nhiệm vụ và phiếu học tập." 
                },
                { 
                    stepName: "Bước 2: Thực hiện nhiệm vụ", 
                    teacherAction: "HS làm việc nhóm, thảo luận, tra cứu tài liệu.\nGV quan sát, hỗ trợ các nhóm gặp khó khăn.", 
                    output: "Các nhóm thảo luận, ghi chép kết quả." 
                },
                { 
                    stepName: "Bước 3: Báo cáo, thảo luận", 
                    teacherAction: "GV mời đại diện nhóm lên trình bày.\nGV tổ chức cho các nhóm khác nhận xét, bổ sung, phản biện.", 
                    output: "Đại diện nhóm báo cáo. HS lớp lắng nghe." 
                },
                { 
                    stepName: "Bước 4: Kết luận, nhận định", 
                    teacherAction: "GV chốt lại kiến thức đúng.\nNhấn mạnh các lưu ý, sai lầm thường gặp.\nYêu cầu HS ghi nội dung chính vào vở.", 
                    output: "HS ghi bài." 
                }
            ],
            digitalIntegration: formData.selectedFramework === '3439_AI' ? {
                code: "NLc",
                requirement: pickAiComp("NLc").requirement,
                description: "Khai thác học liệu số và công cụ AI để hình thành kiến thức."
            } : {
                 code: "6.2.TC1b",
                 requirement: pickComp("6.2.TC1b").requirement,
                 description: "HS sử dụng thiết bị thông minh để tra cứu thêm thông tin mở rộng hoặc dùng phần mềm GeoGebra để kiểm chứng tính chất hình học."
            }
        },
        {
            name: "HOẠT ĐỘNG 3: LUYỆN TẬP (PRACTICE)",
            objective: `Củng cố kiến thức, rèn luyện kỹ năng giải toán liên quan đến ${topic}.`,
            content: `GV yêu cầu HS làm các bài tập trắc nghiệm và tự luận.\nNội dung: ${context.exercises}`,
            product: "Lời giải chi tiết các bài tập.",
            steps: [
                { 
                    stepName: "Bước 1: Chuyển giao nhiệm vụ", 
                    teacherAction: "GV chiếu đề bài tập lên bảng (hoặc yêu cầu xem SGK).\nBài 1: Nhận biết (Trắc nghiệm).\nBài 2: Thông hiểu (Tự luận cơ bản).\nBài 3: Vận dụng (Bài toán thực tế).", 
                    output: "HS đọc đề, xác định yêu cầu." 
                },
                { 
                    stepName: "Bước 2: Thực hiện nhiệm vụ", 
                    teacherAction: "HS làm việc cá nhân.\nGV đi xem xét bài làm của HS, hướng dẫn gợi ý cho HS yếu.", 
                    output: "HS giải bài vào vở." 
                },
                { 
                    stepName: "Bước 3: Báo cáo, thảo luận", 
                    teacherAction: "GV gọi 2 HS lên bảng giải Bài 2 và Bài 3.\nGọi HS khác đứng tại chỗ trả lời trắc nghiệm.", 
                    output: "HS lên bảng trình bày lời giải." 
                },
                { 
                    stepName: "Bước 4: Kết luận, nhận định", 
                    teacherAction: "GV nhận xét bài làm trên bảng, chấm điểm.\nPhân tích lỗi sai (nếu có) về cách trình bày, tính toán.", 
                    output: "HS sửa bài (nếu sai)." 
                }
            ],
            digitalIntegration: formData.selectedFramework === '3439_AI' ? {
                code: "NLb",
                requirement: pickAiComp("NLb").requirement,
                description: "Sử dụng công cụ AI hỗ trợ luyện tập một cách trung thực."
            } : undefined
        },
        {
            name: "HOẠT ĐỘNG 4: VẬN DỤNG (APPLICATION)",
            objective: `Sử dụng kiến thức ${topic} để giải quyết vấn đề thực tiễn hoặc bài toán nâng cao.`,
            content: "GV giao bài tập về nhà hoặc dự án nhỏ.",
            product: "Bài làm về nhà của HS.",
            steps: [
                { 
                    stepName: "Bước 1: Chuyển giao nhiệm vụ", 
                    teacherAction: `GV nêu bài toán: "Hãy tìm hiểu và chụp ảnh một vật thể có hình dạng ${topic} trong ngôi nhà của em, sau đó đo đạc và tính toán các thông số..."`, 
                    output: "HS lắng nghe yêu cầu." 
                },
                { 
                    stepName: "Bước 2: Thực hiện nhiệm vụ", 
                    teacherAction: "HS thực hiện tại nhà.", 
                    output: "HS tự thực hiện." 
                },
                { 
                    stepName: "Bước 3: Báo cáo, thảo luận", 
                    teacherAction: "Nộp báo cáo vào đầu giờ học sau.", 
                    output: "Sản phẩm nộp sau." 
                },
                { 
                    stepName: "Bước 4: Kết luận, nhận định", 
                    teacherAction: "GV đánh giá vào tiết học sau.", 
                    output: "HS ghi nhớ." 
                }
            ],
            digitalIntegration: formData.selectedFramework === '3439_AI' ? {
                code: "NLd",
                requirement: pickAiComp("NLd").requirement,
                description: "Thiết kế sản phẩm hoặc giải pháp có ứng dụng AI đơn giản."
            } : undefined
        }
    ];

    return {
        topic: topic.toUpperCase(),
        subject: subject,
        grade: grade,
        duration: formData.duration || "1",
        objectives: objectives,
        materials: materials,
        activities: activities
    };
};

export const generateMockWorksheets = (formData: FormData, isMath: boolean): Worksheet[] => {
    const topic = formData.topic || "Bài học";
    const context = getTopicContext(topic, formData.subject, isMath);
    
    // Customize Questions based on Topic Type
    let question1 = `Điền từ thích hợp vào chỗ trống: "${topic} là..."`;
    let question2 = `Nêu các tính chất cơ bản của ${topic}.`;
    
    if (isMath) {
        question1 = `Câu hỏi trắc nghiệm: Cho các dữ kiện về ${topic}. Khẳng định nào sau đây là đúng?\n(Sử dụng kiến thức: ${context.definition})`;
        question2 = `Bài tập tự luận: Giải bài toán sau liên quan đến ${topic}.\n${context.diagram}\n${context.exercises}`;
    } else {
        question1 = `Câu hỏi: Phân tích vai trò của ${topic} trong thực tiễn: ${context.realWorld}`;
        question2 = `Bài tập: Viết một đoạn văn ngắn (5-7 câu) trình bày hiểu biết của em về ${topic}.`;
    }

    return [
        { 
            title: "Mức 1: Nhận biết & Thông hiểu", 
            description: "Củng cố kiến thức nền tảng.", 
            content: [
                { type: 'fill', question: question1 }, 
                { type: 'essay', question: question2 }
            ] 
        },
        { 
            title: "Mức 2: Vận dụng", 
            description: "Giải quyết các bài tập tính toán.", 
            content: [
                { type: 'essay', question: `Bài tập 1: Vận dụng kiến thức ${topic} để giải quyết bài toán SGK trang ...` }, 
                { type: 'essay', question: `Bài tập 2: Dựa trên ${context.keywords[0]}, hãy chứng minh rằng...` }
            ] 
        },
        { 
            title: "Mức 3: Vận dụng cao", 
            description: "Bài toán thực tế và nâng cao.", 
            content: [{ type: 'essay', question: `Tìm hiểu ứng dụng thực tế của ${topic} trong lĩnh vực: ${context.realWorld}.` }] 
        }
    ];
};

export const generateMockSlides = (formData: FormData): Slide[] => {
    const topic = (formData.topic || "CHỦ ĐỀ BÀI DẠY").toUpperCase();
    return [
        { type: "Title", title: topic, points: [`Giáo viên: Nguyễn Văn A`, `Môn: ${formData.subject}`, `Lớp: ${formData.grade}`] },
        { type: "Content", title: "NỘI DUNG BÀI HỌC", points: ["1. Khởi động", "2. Hình thành kiến thức", "3. Luyện tập", "4. Vận dụng"] },
        { type: "Content", title: "1. KHÁI NIỆM & ĐỊNH NGHĨA", points: [`Định nghĩa ${formData.topic}`, "Ví dụ minh họa", "Nhận xét quan trọng"] },
        { type: "Content", title: "2. BÀI TẬP VẬN DỤNG", points: ["Bài tập 1 (Trắc nghiệm)", "Bài tập 2 (Tự luận)", "Thảo luận nhóm"] },
        { type: "Summary", title: "DẶN DÒ", points: ["Học thuộc ghi nhớ", "Làm bài tập SGK", "Chuẩn bị bài sau"] }
    ];
};

export const generateMockDigitalPack = (formData: FormData): DigitalPack => {
  const isAi = formData.selectedFramework === '3439_AI';
  const topic = formData.topic || "Bài học";
  
  if (isAi) {
    return {
      summary: `Kế hoạch tích hợp giáo dục Trí tuệ nhân tạo (QĐ 3439/BGDĐT) cho bài ${topic}.`,
      mapping: [
        { 
          activity: "HĐ1: Khởi động", 
          competencyCode: "NLa", 
          competency: "Tư duy lấy con người làm trung tâm", 
          tool: "AI Image Generator / Chatbot", 
          action: "GV sử dụng AI tạo hình ảnh minh họa tình huống thực tế để HS nhận diện vai trò của AI.", 
          evidence: "HS thảo luận về sự khác biệt giữa sản phẩm do người và AI tạo ra." 
        },
        { 
          activity: "HĐ2: Hình thành kiến thức", 
          competencyCode: "NLc", 
          competency: "Kĩ thuật và ứng dụng AI", 
          tool: "Nền tảng AI chuyên dụng", 
          action: "HS trải nghiệm trực tiếp công cụ AI để khám phá nguyên lý hoạt động của chủ đề.", 
          evidence: "Phiếu học tập ghi lại kết quả tương tác với AI." 
        }
      ]
    };
  }

  return {
    summary: `Kế hoạch tích hợp công cụ số hỗ trợ dạy học bài ${topic} theo CV 3456.`,
    mapping: [
      { activity: "HĐ2: Hình thành kiến thức", competencyCode: "6.2.TC1b", competency: "Sử dụng công cụ số", tool: "Phần mềm mô phỏng/Tra cứu", action: `GV hướng dẫn HS sử dụng phần mềm để trực quan hóa ${topic}.`, evidence: "Hình ảnh mô phỏng trên màn hình." },
      { activity: "HĐ3: Luyện tập", competencyCode: "1.1.TC1b", competency: "Đánh giá số", tool: "Quizizz / Kahoot", action: "Tổ chức kiểm tra nhanh trắc nghiệm khách quan.", evidence: "Bảng xếp hạng và thống kê điểm số." }
    ]
  };
};

export const generateMockAssessment = (data: FormData, isMath: boolean): AssessmentQuestion[] => {
    return [
        { level: "Nhận biết", question: `Câu hỏi nhận biết về ${data.topic}`, options: ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"], answer: "A", explanation: "Giải thích chi tiết dựa trên định nghĩa." },
        { level: "Thông hiểu", question: `Câu hỏi thông hiểu về ${data.topic}`, options: ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"], answer: "B", explanation: "Giải thích chi tiết dựa trên tính chất." }
    ];
};
