export const TEMPLATES = [
  { id: 'th_kienthuc', name: 'Tiểu học: Hình thành kiến thức mới (1 tiết)' },
  { id: 'th_luyentap', name: 'Tiểu học: Luyện tập – thực hành (1 tiết)' },
  { id: 'trung_hoc_khampha', name: 'THCS/THPT: Khám phá – hình thành kiến thức (1-2 tiết)' },
  { id: 'trung_hoc_ontap', name: 'THCS/THPT: Ôn tập – hệ thống hoá (1 tiết)' },
  { id: 'nguvan_docviet', name: 'Ngữ văn: Đọc hiểu + Viết (2 tiết)' },
  { id: 'toan_hinhhoc', name: 'Toán: Hình học & Đo lường (1 tiết)' }, 
  { id: 'stem_duan', name: 'HĐ Trải nghiệm / STEM: Dự án mini (2 tiết)' },
];

export const DIGITAL_COMPETENCY_DB = [
  { code: "1.1.TC1a", domain: "1. Khai thác dữ liệu & thông tin", component: "1.1. Duyệt, tìm kiếm", requirement: "Giải thích được nhu cầu thông tin.", level: "L6-L7 (Cơ bản)" },
  { code: "1.1.TC1b", domain: "1. Khai thác dữ liệu & thông tin", component: "1.1. Duyệt, tìm kiếm", requirement: "Thực hiện được rõ ràng và theo quy trình các tìm kiếm.", level: "L6-L7 (Cơ bản)" },
  { code: "6.2.TC1a", domain: "6. Trí tuệ nhân tạo (AI)", component: "6.2. Sử dụng công cụ AI", requirement: "Sử dụng được các công cụ AI trong công việc và học tập.", level: "L6-L7 (Cơ bản)" },
  { code: "6.2.TC1b", domain: "6. Trí tuệ nhân tạo (AI)", component: "6.2. Sử dụng công cụ AI", requirement: "Thực hành được các kỹ năng sử dụng AI qua dự án nhỏ.", level: "L6-L7 (Cơ bản)" },
  { code: "6.3.TC1a", domain: "6. Trí tuệ nhân tạo (AI)", component: "6.3. Đánh giá AI", requirement: "Giải thích được cách thức hoạt động của các hệ thống AI đơn giản.", level: "L6-L7 (Cơ bản)" },
  { code: "6.3.TC1b", domain: "6. Trí tuệ nhân tạo (AI)", component: "6.3. Đánh giá AI", requirement: "Tóm tắt được các đặc điểm và giới hạn của AI.", level: "L6-L7 (Cơ bản)" }
];

export const AI_EDUCATION_FRAMEWORK = [
  { 
    code: "NLa", 
    domain: "Tư duy lấy con người làm trung tâm", 
    requirement: {
      primary: "Nhận biết AI là sản phẩm do con người tạo ra để phục vụ cuộc sống; biết lựa chọn công cụ AI an toàn.",
      secondary: "Hiểu vai trò của con người trong thiết kế, vận hành; phân tích tình huống sử dụng AI đúng đắn.",
      high: "Phân tích ảnh hưởng của AI đến việc làm, quyền riêng tư; tích hợp yếu tố nhân văn vào thiết kế AI."
    }
  },
  { 
    code: "NLb", 
    domain: "Đạo đức AI", 
    requirement: {
      primary: "Sử dụng AI đúng cách, không gây hại; bảo vệ thông tin cá nhân; tôn trọng bản quyền.",
      secondary: "Nêu được các nguyên tắc đạo đức: không gây hại, không thiên kiến, công bằng, minh bạch.",
      high: "Đánh giá các nguyên tắc đạo đức trong tình huống thực tế; đề xuất quy tắc ứng xử hoặc chính sách đạo đức."
    }
  },
  { 
    code: "NLc", 
    domain: "Các kĩ thuật và ứng dụng AI", 
    requirement: {
      primary: "Làm quen với ứng dụng AI (nhận diện hình ảnh, giọng nói); biết vận dụng AI hỗ trợ học tập.",
      secondary: "Hiểu khái niệm dữ liệu, thuật toán, mô hình; biết kết hợp công cụ AI tạo sản phẩm số có ý nghĩa.",
      high: "Trình bày quy trình phát triển AI (thu thập - xử lý - huấn luyện - đánh giá); cải tiến mô hình AI sẵn có."
    }
  },
  { 
    code: "NLd", 
    domain: "Thiết kế hệ thống AI", 
    requirement: {
      primary: "Nhận biết AI hoạt động dựa trên dữ liệu; nêu được ý tưởng đơn giản để cải thiện kết quả AI.",
      secondary: "Xác định tình huống thực tiễn ứng dụng AI; lập kế hoạch thiết kế hệ thống AI đơn giản.",
      high: "Mô tả cấu trúc tổng thể hệ thống AI; thực hiện kiểm thử, điều chỉnh và tối ưu hóa hệ thống ở mức cơ bản."
    }
  }
];
