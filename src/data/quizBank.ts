import { QuizQuestion, QuizTopic } from "@/types/quiz";

export const QUIZ_TOPICS: QuizTopic[] = [
  {
    "id": "all",
    "title": "Toàn Bộ Ngân Hàng Câu Hỏi",
    "desc": "Tổng hợp trọn vẹn 335 câu hỏi ôn tập 100% giáo trình Công Nghệ Kim Loại trên Canvas",
    "icon": "fa-solid fa-layer-group",
    "badge": "335 CÂU",
    "count": 335
  },
  {
    "id": "ch1",
    "title": "Chương I: Tổng Quan",
    "desc": "Khái niệm sản xuất, dung sai kích thước, cấp chính xác & độ nhám bề mặt",
    "icon": "fa-solid fa-gears",
    "badge": "65 CÂU",
    "count": 65
  },
  {
    "id": "ch2",
    "title": "Chương II: Phương Pháp Đúc Kim Loại",
    "desc": "Khuôn cát, khuôn kim loại, đúc áp lực, đúc ly tâm, đúc mẫu chảy & khuyết tật",
    "icon": "fa-solid fa-fire",
    "badge": "60 CÂU",
    "count": 60
  },
  {
    "id": "ch3",
    "title": "Chương III: Phương Pháp Gia Công Kim Loại Bằng Áp Lực",
    "desc": "Cán, Kéo, Ép chảy, Rèn tự do, Dập khuôn & Dập tấm kim loại",
    "icon": "fa-solid fa-hammer",
    "badge": "40 CÂU",
    "count": 40
  },
  {
    "id": "ch4",
    "title": "Chương IV: Phương Pháp Hàn Kim Loại",
    "desc": "Hàn hồ quang tay, hàn khí O2-C2H2, hàn TIG, hàn tiếp xúc & biến dạng hàn",
    "icon": "fa-solid fa-fire-burner",
    "badge": "40 CÂU",
    "count": 40
  },
  {
    "id": "ch5",
    "title": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "desc": "Chế độ cắt, dụng cụ cắt gọt, máy tiện/phay/bào/mài, đồ gá & luynet",
    "icon": "fa-solid fa-screwdriver-wrench",
    "badge": "70 CÂU",
    "count": 70
  },
  {
    "id": "ch6",
    "title": "Chương VI: Một Số Phương Pháp Gia Công Tiên Tiến",
    "desc": "Gia công tia lửa điện (EDM), laser (LBM), điện hóa (ECM), siêu âm (USM), tia nước (AJM)",
    "icon": "fa-solid fa-bolt",
    "badge": "35 CÂU",
    "count": 35
  },
  {
    "id": "ch7",
    "title": "Chương VII và VIII: Quản Lý & Sản Xuất Tinh Gọn",
    "desc": "Chuẩn bị kỹ thuật & công nghệ, chi phí, Takt/Cycle/Lead time, 7 lãng phí & JIT",
    "icon": "fa-solid fa-chart-line",
    "badge": "25 CÂU MỚI",
    "count": 25
  }
];

export const MECHANICAL_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    "id": 1,
    "question": "Quá trình trình sản xuất cơ khí bao gồm các quá trình:",
    "options": [
      "Gia công tạo hình; Xử lý bề mặt; Lắp ráp và đóng gói sản phẩm.",
      "Luyện kim; Chế tạo phôi; Gia công tạo hình; Xử lý bề mặt; Lắp ráp và đóng gói sản phẩm.",
      "Khai thác quặng; Luyện kim; Chế tạo phôi; Gia công tạo hình; Xử lý bề mặt; Lắp ráp và đóng gói sản phẩm.",
      "Chế tạo phôi; Gia công tạo hình; Xử lý bề mặt; Lắp ráp và đóng gói sản phẩm."
    ],
    "correctIndex": 2,
    "correctAnswer": "Khai thác quặng; Luyện kim; Chế tạo phôi; Gia công tạo hình; Xử lý bề mặt; Lắp ráp và đóng gói sản phẩm.",
    "correctAnswerLetter": "C",
    "chapterId": "ch1",
    "chapterTitle": "Chương I: Tổng Quan",
    "explanation": "Quá trình sản xuất cơ khí là quá trình tổng thể từ nguyên liệu thô trong tự nhiên: Khai thác quặng -> Luyện kim -> Chế tạo phôi -> Gia công tạo hình -> Xử lý bề mặt -> Lắp ráp và đóng gói."
  },
  {
    "id": 2,
    "question": "Quá trình công nghệ cơ khí bao gồm các quá trình:",
    "options": [
      "Khai thác quặng; Luyện kim; Chế tạo phôi; Gia công tạo hình; Xử lý bề mặt; Lắp ráp và đóng gói sản phẩm.",
      "Chế tạo phôi; Gia công tạo hình; Xử lý bề mặt; Lắp ráp và đóng gói sản phẩm.",
      "Gia công tạo hình; Xử lý bề mặt; Lắp ráp và đóng gói sản phẩm.",
      "Luyện kim; Chế tạo phôi; Gia công tạo hình; Xử lý bề mặt; Lắp ráp và đóng gói sản phẩm."
    ],
    "correctIndex": 1,
    "correctAnswer": "Chế tạo phôi; Gia công tạo hình; Xử lý bề mặt; Lắp ráp và đóng gói sản phẩm.",
    "correctAnswerLetter": "B",
    "chapterId": "ch1",
    "chapterTitle": "Chương I: Tổng Quan",
    "explanation": "Quá trình công nghệ cơ khí là một phần của quá trình sản xuất, bắt đầu từ phôi: Chế tạo phôi -> Gia công tạo hình -> Xử lý bề mặt -> Lắp ráp và đóng gói."
  },
  {
    "id": 3,
    "question": "Chọn trường hợp đúng của quá trình công nghệ gia công cơ khí",
    "options": [
      "Chế tạo phôi, Gia công cắt gọt, Xử lý vào bảo vệ, Lắp ráp, Đóng gói sản phẩm",
      "Chế tạo phôi, Gia công cắt gọt, Xử lý và Bảo vệ, Lắp ráp, Đóng gói sản phẩm",
      "Gia công cắt gọt, Xử lý và Bảo vệ, Làm sạch, Lắp ráp và Đóng gói sản phẩm",
      "Chế tạo phôi, Gia công cắt gọt, Kiểm tra, Lắp ráp, Đóng gói sản phẩm"
    ],
    "correctIndex": 1,
    "correctAnswer": "Chế tạo phôi, Gia công cắt gọt, Xử lý và Bảo vệ, Lắp ráp, Đóng gói sản phẩm",
    "correctAnswerLetter": "B",
    "chapterId": "ch1",
    "chapterTitle": "Chương I: Tổng Quan",
    "explanation": "Quá trình công nghệ gia công cơ khí gồm các bước: Chế tạo phôi -> Gia công cắt gọt -> Xử lý và Bảo vệ -> Lắp ráp -> Đóng gói sản phẩm."
  },
  {
    "id": 4,
    "question": "Tiện thuộc quá trình công nghệ nào?",
    "options": [
      "Xử lý và bảo vệ",
      "Gia công cắt gọt",
      "Lắp ráp và đóng gói sản phẩm",
      "Chế tạo phôi"
    ],
    "correctIndex": 1,
    "correctAnswer": "Gia công cắt gọt",
    "correctAnswerLetter": "B",
    "chapterId": "ch1",
    "chapterTitle": "Chương I: Tổng Quan",
    "explanation": "Tiện là phương pháp gia công cơ khí cắt gọt phoi bằng chuyển động quay tròn của phôi và chuyển động tịnh tiến của dao tiện."
  },
  {
    "id": 5,
    "question": "Nhiệt luyện làm cứng con lăn thuộc quy trình nào của quá trình công nghệ?",
    "options": [
      "Chế tạo phôi",
      "Gia công cắt gọt",
      "Lắp ráp và đóng gói sản phẩm",
      "Xử lý và bảo vệ"
    ],
    "correctIndex": 3,
    "correctAnswer": "Xử lý và bảo vệ",
    "correctAnswerLetter": "D",
    "chapterId": "ch1",
    "chapterTitle": "Chương I: Tổng Quan",
    "explanation": "Nhiệt luyện (tôi, ram, ủ, thấm cacbon...) làm thay đổi cơ tính, tăng độ cứng và độ bền của chi tiết, thuộc khâu Xử lý và bảo vệ bề mặt."
  },
  {
    "id": 6,
    "question": "Bộ nhông xích xe máy bao gồm đĩa xích, dây xích và mayor. Trong đó, chi tiết máy là:",
    "options": [
      "Dây xích",
      "Đĩa xích",
      "Cả bộ nhông xích",
      "Mayor"
    ],
    "correctIndex": 1,
    "correctAnswer": "Đĩa xích",
    "correctAnswerLetter": "B",
    "chapterId": "ch1",
    "chapterTitle": "Chương I: Tổng Quan",
    "explanation": "Chi tiết máy là phần tử hoàn chỉnh đơn nhất, không thể tháo rời được nữa (như đĩa xích, bu lông, ốc vít...). Dây xích là cơ cấu/bộ truyền gồm nhiều mắt xích ghép lại."
  },
  {
    "id": 7,
    "question": "Bộ nhông xích xe máy bao gồm đĩa xích, dây xích và mayor. Trong đó, cơ cấu máy là:",
    "options": [
      "Đĩa xích",
      "Dây xích",
      "Cả bộ nhông xích",
      "Mayor"
    ],
    "correctIndex": 2,
    "correctAnswer": "Cả bộ nhông xích",
    "correctAnswerLetter": "C",
    "chapterId": "ch1",
    "chapterTitle": "Chương I: Tổng Quan",
    "explanation": "Cơ cấu máy là một tập hợp các chi tiết máy được liên kết động học với nhau để thực hiện một chuyển động xác định (cả bộ nhông xích)."
  },
  {
    "id": 8,
    "question": "Bánh xe đạp là:",
    "options": [
      "Máy hoàn chỉnh",
      "Bộ phận máy",
      "Cơ cấu máy",
      "Chi tiết máy"
    ],
    "correctIndex": 1,
    "correctAnswer": "Bộ phận máy",
    "correctAnswerLetter": "B",
    "chapterId": "ch1",
    "chapterTitle": "Chương I: Tổng Quan",
    "explanation": "Bánh xe đạp gồm vành, nan hoa, săm, lốp, moay-ơ ghép lại thành một cụm chức năng độc lập -> gọi là Bộ phận máy."
  },
  {
    "id": 9,
    "question": "Trong quá trình công nghệ gia công cơ khí, phôi là gì?",
    "options": [
      "Là vật tư đầu vào của một quá trình công nghệ",
      "Là sản phẩm đầu ra của một quá trình công nghệ",
      "Là phần nguyên liệu được hớt bỏ đi của quá trình công nghệ",
      "Là phần phần kim loại còn thừa xuất hiện trên sản phẩm"
    ],
    "correctIndex": 0,
    "correctAnswer": "Là vật tư đầu vào của một quá trình công nghệ",
    "correctAnswerLetter": "A",
    "chapterId": "ch1",
    "chapterTitle": "Chương I: Tổng Quan",
    "explanation": "Phôi là vật tư đầu vào của một quá trình công nghệ gia công, có hình dáng và kích thước gần giống chi tiết cần chế tạo."
  },
  {
    "id": 10,
    "question": "Sản phẩm cơ khí là:",
    "options": [
      "Các đáp án đưa ra đều đúng",
      "Một máy hoàn chỉnh",
      "Một bộ phận máy",
      "Một chi tiết máy"
    ],
    "correctIndex": 0,
    "correctAnswer": "Các đáp án đưa ra đều đúng",
    "correctAnswerLetter": "A",
    "chapterId": "ch1",
    "chapterTitle": "Chương I: Tổng Quan",
    "explanation": "Sản phẩm cơ khí có thể là một chi tiết máy độc lập, một bộ phận máy, hoặc một máy móc hoàn chỉnh hoàn thiện."
  },
  {
    "id": 11,
    "question": "Trong sản xuất cơ khí người ta phân ra bao nhiêu dạng sản xuất?",
    "options": [
      "5",
      "2",
      "4",
      "3"
    ],
    "correctIndex": 3,
    "correctAnswer": "3",
    "correctAnswerLetter": "D",
    "chapterId": "ch1",
    "chapterTitle": "Chương I: Tổng Quan",
    "explanation": "Trong sản xuất cơ khí có 3 dạng sản xuất chính: 1. Sản xuất đơn chiếc; 2. Sản xuất hàng loạt (loạt nhỏ, vừa, lớn); 3. Sản xuất hàng khối."
  },
  {
    "id": 12,
    "question": "Khi sản xuất mà số lượng sản phẩm hàng năm ít, sản phẩm không ổn định thì người ta gọi là dạng sản xuất:",
    "options": [
      "Hàng khối",
      "Hàng loạt lớn",
      "Đơn chiếc",
      "Hàng loạt nhỏ"
    ],
    "correctIndex": 2,
    "correctAnswer": "Đơn chiếc",
    "correctAnswerLetter": "C",
    "chapterId": "ch1",
    "chapterTitle": "Chương I: Tổng Quan",
    "explanation": "Sản xuất đơn chiếc: Số lượng sản phẩm hàng năm ít, chủng loại thay đổi liên tục, sản phẩm không có tính chu kỳ ổn định."
  },
  {
    "id": 13,
    "question": "Khi sản xuất theo đơn đặt hàng định kỳ, mỗi đơn hàng khoảng vài trăm chiếc thì người ta gọi là dạng sản xuất:",
    "options": [
      "Hàng loạt nhỏ",
      "Hàng loạt lớn",
      "Hàng khối",
      "Đơn chiếc"
    ],
    "correctIndex": 0,
    "correctAnswer": "Hàng loạt nhỏ",
    "correctAnswerLetter": "A",
    "chapterId": "ch1",
    "chapterTitle": "Chương I: Tổng Quan",
    "explanation": "Sản xuất hàng loạt nhỏ: Sản phẩm được đặt hàng định kỳ theo từng lô nhỏ khoảng vài chục đến vài trăm chiếc."
  },
  {
    "id": 14,
    "question": "Khi sản xuất theo đơn đặt hàng định kỳ, mỗi đơn hàng khoảng vài nghìn chiếc thì người ta gọi là dạng sản xuất:",
    "options": [
      "Hàng loạt nhỏ",
      "Đơn chiếc",
      "Hàng loạt lớn",
      "Hàng khối"
    ],
    "correctIndex": 2,
    "correctAnswer": "Hàng loạt lớn",
    "correctAnswerLetter": "C",
    "chapterId": "ch1",
    "chapterTitle": "Chương I: Tổng Quan",
    "explanation": "Sản xuất hàng loạt lớn: Sản phẩm được sản xuất theo lô định kỳ ổn định, mỗi đợt hàng khoảng vài nghìn chiếc trở lên."
  },
  {
    "id": 15,
    "question": "Khi sản xuất với số lượng sản phẩm hàng năm rất lớn, sản phẩm ổn định là dạng sản xuất:",
    "options": [
      "Hàng loạt lớn",
      "Hàng khối",
      "Đơn chiếc",
      "Hàng loạt nhỏ"
    ],
    "correctIndex": 1,
    "correctAnswer": "Hàng khối",
    "correctAnswerLetter": "B",
    "chapterId": "ch1",
    "chapterTitle": "Chương I: Tổng Quan",
    "explanation": "Sản xuất hàng khối: Số lượng sản phẩm hàng năm cực kỳ lớn, sản phẩm hoàn toàn ổn định qua nhiều năm (ví dụ bu lông, ốc vít, vòng bi...)."
  },
  {
    "id": 16,
    "question": "Để phân loại các dạng sản xuất người ta dựa vào:",
    "options": [
      "Sản lượng sản phẩm hàng năm và số lượng sản phẩm từng lần đặt hàng",
      "Số lượng sản phẩm trong lô hàng",
      "Mức độ ổn định và sản lượng hàng năm",
      "Mức độ ổn định của sản lượng và số lượng sản phẩm từng lô hàng"
    ],
    "correctIndex": 2,
    "correctAnswer": "Mức độ ổn định và sản lượng hàng năm",
    "correctAnswerLetter": "C",
    "chapterId": "ch1",
    "chapterTitle": "Chương I: Tổng Quan",
    "explanation": "Hai tiêu chí cốt lõi để phân loại dạng sản xuất là: Mức độ ổn định của sản phẩm và Sản lượng sản xuất hàng năm."
  },
  {
    "id": 17,
    "question": "Tổ chức sản xuất theo dây chuyền phù hợp với dạng sản xuất nào sau đây:",
    "options": [
      "Đơn chiếc",
      "Hàng loạt nhỏ",
      "Hàng loạt nhỏ, hàng loạt lớn",
      "Hàng khối, hàng loạt lớn"
    ],
    "correctIndex": 3,
    "correctAnswer": "Hàng khối, hàng loạt lớn",
    "correctAnswerLetter": "D",
    "chapterId": "ch1",
    "chapterTitle": "Chương I: Tổng Quan",
    "explanation": "Dây chuyền sản xuất đòi hỏi tính chuyên môn hóa cao, thiết bị chuyên dùng -> Chỉ phù hợp với dạng sản xuất Hàng khối và Hàng loạt lớn."
  },
  {
    "id": 18,
    "question": "Một xưởng sản xuất được trang bị toàn bộ các máy vạn năng thì phù hợp với dạng sản xuất nào:",
    "options": [
      "Đơn chiếc, hàng loạt nhỏ",
      "Hàng khối",
      "Hàng loạt nhỏ, hàng loạt lớn",
      "Hàng loạt lớn, hàng khối"
    ],
    "correctIndex": 0,
    "correctAnswer": "Đơn chiếc, hàng loạt nhỏ",
    "correctAnswerLetter": "A",
    "chapterId": "ch1",
    "chapterTitle": "Chương I: Tổng Quan",
    "explanation": "Máy công cụ vạn năng (tiện vạn năng, phay vạn năng) có tính linh hoạt cao, gia công được nhiều loại chi tiết -> Phù hợp với sản xuất Đơn chiếc và Hàng loạt nhỏ."
  },
  {
    "id": 19,
    "question": "Trong bản vẽ kỹ thuật cơ khí, nếu không thể hiện đơn vị thì hiểu đơn vị là gì?",
    "options": [
      "Inch",
      "m",
      "mm",
      "cm"
    ],
    "correctIndex": 2,
    "correctAnswer": "mm",
    "correctAnswerLetter": "C",
    "chapterId": "ch1",
    "chapterTitle": "Chương I: Tổng Quan",
    "explanation": "Theo tiêu chuẩn TCVN và ISO trong bản vẽ kỹ thuật cơ khí, nếu kích thước dài không ghi đơn vị đo thì mặc định là milimét (mm)."
  },
  {
    "id": 20,
    "question": "Kính thước danh nghĩa là:",
    "options": [
      "Kích thước thu được của chi tiết máy sau khi gia công chế tạo",
      "Kết quả thu được của quá trình tính toán, thiết kế",
      "Kích thước của chi tiết máy được lựa chọn phù hợp cho quá trình lắp ráp",
      "Kính thước được lựa chọn cho chi tiết máy trên cơ sở tính toán, thiết kế"
    ],
    "correctIndex": 3,
    "correctAnswer": "Kính thước được lựa chọn cho chi tiết máy trên cơ sở tính toán, thiết kế",
    "correctAnswerLetter": "D",
    "chapterId": "ch1",
    "chapterTitle": "Chương I: Tổng Quan",
    "explanation": "Kích thước danh nghĩa (d hoặc D) do Người thiết kế tính toán, lựa chọn dựa trên sức bền, chức năng làm việc và quy chuẩn hóa."
  },
  {
    "id": 21,
    "question": "Kích thước danh nghĩa được quyết định bởi:",
    "options": [
      "Người đặt hàng",
      "Người sản xuất",
      "Người thiết kế",
      "Người công nhân"
    ],
    "correctIndex": 2,
    "correctAnswer": "Người thiết kế",
    "correctAnswerLetter": "C",
    "chapterId": "ch1",
    "chapterTitle": "Chương I: Tổng Quan",
    "explanation": "Kích thước danh nghĩa (d hoặc D) do Người thiết kế tính toán, lựa chọn dựa trên sức bền, chức năng làm việc và quy chuẩn hóa."
  },
  {
    "id": 22,
    "question": "Nếu trên bản vẽ ghi kích thước là 20±0,05, câu câu khẳng định nào sau đây đúng",
    "options": [
      "Kính thước giới hạn là 20 mm",
      "Kích thước danh nghĩa là 20 mm",
      "Kích thước danh nghĩa là 20-0,05 mm",
      "Kích thước giới hạn là 20+0,05 mm"
    ],
    "correctIndex": 1,
    "correctAnswer": "Kích thước danh nghĩa là 20 mm",
    "correctAnswerLetter": "B",
    "chapterId": "ch1",
    "chapterTitle": "Chương I: Tổng Quan",
    "explanation": "Ký hiệu 20±0,05: 20 là kích thước danh nghĩa; +0,05 là sai lệch giới hạn trên; -0,05 là sai lệch giới hạn dưới."
  },
  {
    "id": 23,
    "question": "Kính thước thực là:",
    "options": [
      "Kích thước thu được của chi tiết máy sau khi gia công chế tạo",
      "Kích thước thực thường lớn hơn kích thước danh nghĩa",
      "Kích thước thực thường bằng kích thước danh nghĩa",
      "Kích thước thực thường nhỏ hơn kích thước danh nghĩa"
    ],
    "correctIndex": 0,
    "correctAnswer": "Kích thước thu được của chi tiết máy sau khi gia công chế tạo",
    "correctAnswerLetter": "A",
    "chapterId": "ch1",
    "chapterTitle": "Chương I: Tổng Quan",
    "explanation": "Kích thước thực là kích thước đo được trực tiếp trên chi tiết sau khi gia công xong với độ chính xác cho phép của dụng cụ đo. Kích thước thực không chắc chắn bằng kích thước danh nghĩa do có sai số gia công."
  },
  {
    "id": 24,
    "question": "So sánh giữa kích thước danh nghĩa và kích thước thực, khẳng định nào sau đâu đúng",
    "options": [
      "Kích thước thực không chắc bằng kích thước danh nghĩa",
      "Kích thước thực thường nhỏ hơn kích thước danh nghĩa",
      "Kích thước thực thường lớn hơn kích thước danh nghĩa",
      "Kích thước thực thường bằng kích thước danh nghĩa"
    ],
    "correctIndex": 0,
    "correctAnswer": "Kích thước thực không chắc bằng kích thước danh nghĩa",
    "correctAnswerLetter": "A",
    "chapterId": "ch1",
    "chapterTitle": "Chương I: Tổng Quan",
    "explanation": "Kích thước thực là kích thước đo được trực tiếp trên chi tiết sau khi gia công xong với độ chính xác cho phép của dụng cụ đo. Kích thước thực không chắc chắn bằng kích thước danh nghĩa do có sai số gia công."
  },
  {
    "id": 25,
    "question": "Kích thước giới hạn trên là:",
    "options": [
      "Là giá trị lớn nhất của kích thước danh nghĩa",
      "Là kích thước lớn nhất của một chi tiết máy",
      "Là kích thước giới hạn lớn nhất mà kích thước thực không được vượt qua",
      "Là kích thước lớn nhất có thể lựa chọn làm kích thước danh nghĩa"
    ],
    "correctIndex": 2,
    "correctAnswer": "Là kích thước giới hạn lớn nhất mà kích thước thực không được vượt qua",
    "correctAnswerLetter": "C",
    "chapterId": "ch1",
    "chapterTitle": "Chương I: Tổng Quan",
    "explanation": "Kích thước giới hạn trên (Dmax hoặc dmax) là kích thước lớn nhất cho phép mà kích thước thực của chi tiết không được phép vượt quá."
  },
  {
    "id": 26,
    "question": "Kích thước giới hạn trên là:",
    "options": [
      "Là giá trị lớn nhất của kích thước danh nghĩa",
      "Là kích thước lớn nhất của một chi tiết máy",
      "Là kích thước lớn nhất có thể lựa chọn làm kích thước danh nghĩa",
      "Là kích thước giới hạn lớn nhất mà kích thước thực không được vượt qua"
    ],
    "correctIndex": 3,
    "correctAnswer": "Là kích thước giới hạn lớn nhất mà kích thước thực không được vượt qua",
    "correctAnswerLetter": "D",
    "chapterId": "ch1",
    "chapterTitle": "Chương I: Tổng Quan",
    "explanation": "Kích thước giới hạn trên (Dmax hoặc dmax) là kích thước lớn nhất cho phép mà kích thước thực của chi tiết không được phép vượt quá."
  },
  {
    "id": 27,
    "question": "Kích thước giới hạn dưới là:",
    "options": [
      "Là kích thước nhỏ nhất của một chi tiết máy",
      "Là giá trị nhỏ nhất của kích thước danh nghĩa",
      "Là kích thước nhỏ nhất có thể lựa chọn làm kích thước danh nghĩa",
      "Là kích thước giới hạn nhỏ nhất mà kích thước thực không được vượt qua"
    ],
    "correctIndex": 3,
    "correctAnswer": "Là kích thước giới hạn nhỏ nhất mà kích thước thực không được vượt qua",
    "correctAnswerLetter": "D",
    "chapterId": "ch1",
    "chapterTitle": "Chương I: Tổng Quan",
    "explanation": "Kích thước giới hạn dưới (Dmin hoặc dmin) là kích thước nhỏ nhất cho phép mà kích thước thực của chi tiết không được phép nhỏ hơn."
  },
  {
    "id": 28,
    "question": "Kích thước đạt yêu cầu khi:",
    "options": [
      "Bằng với kích thước danh nghĩa",
      "Bằng với kích thước giới hạn trên",
      "Nằm trong miền giới hạn bởi kích thước giới hạn dưới và kích thước giới hạn trên",
      "Bằng với kích thước giới hạn dưới"
    ],
    "correctIndex": 2,
    "correctAnswer": "Nằm trong miền giới hạn bởi kích thước giới hạn dưới và kích thước giới hạn trên",
    "correctAnswerLetter": "C",
    "chapterId": "ch1",
    "chapterTitle": "Chương I: Tổng Quan",
    "explanation": "Chi tiết đạt yêu cầu khi kích thước thực nằm trong khoảng kích thước giới hạn: Dmin <= Dthực <= Dmax."
  },
  {
    "id": 29,
    "question": "Kích thước nào có sai lệch giới hạn trên lớn nhất",
    "options": [
      "50-0,05",
      "50+0,04",
      "50±0,02",
      "50-0,03"
    ],
    "correctIndex": 1,
    "correctAnswer": "50+0,04",
    "correctAnswerLetter": "B",
    "chapterId": "ch1",
    "chapterTitle": "Chương I: Tổng Quan",
    "explanation": "50+0,04 có sai lệch trên es = +0,04 mm (lớn nhất trong các kích thước so sánh: +0,04 > +0,02 > -0,03 > -0,05)."
  },
  {
    "id": 30,
    "question": "Kích thước nào có sai lệch giới hạn dưới lớn nhất",
    "options": [
      "50+0,04",
      "50-0,03",
      "50-0,05",
      "50±0,02"
    ],
    "correctIndex": 2,
    "correctAnswer": "50-0,05",
    "correctAnswerLetter": "C",
    "chapterId": "ch1",
    "chapterTitle": "Chương I: Tổng Quan",
    "explanation": "50+0,04 có sai lệch dưới ei = 0; 50±0,02 có ei = -0,02; 50-0,03 có ei = -0,03; 50-0,05 có ei = -0,05. Lưu ý: 0 > -0.02 > -0.03 > -0.05."
  },
  {
    "id": 31,
    "question": "Chọn trường hợp đúng khi kích thước loạt chi tiết cùng miền dung sai:",
    "options": [
      "Các đáp án đưa ra đều đúng",
      "Sai lệch nằm trong khoảng hai sai lệch giới hạn",
      "Kích thước nằm trong khoảng hai kích thước giới hạn",
      "Các kích thước không hoàn toàn bằng nhau"
    ],
    "correctIndex": 0,
    "correctAnswer": "Các đáp án đưa ra đều đúng",
    "correctAnswerLetter": "A",
    "chapterId": "ch1",
    "chapterTitle": "Chương I: Tổng Quan",
    "explanation": "Đáp án đúng là A: Các đáp án đưa ra đều đúng"
  },
  {
    "id": 32,
    "question": "Chọn trường hợp đúng khi loạt chi tiết cùng cấp chính xác:",
    "options": [
      "Có cùng trị số dung sai",
      "Có cùng sai lệch giới hạn dưới",
      "Các kích thước đều bằng nhau",
      "Có cùng sai lệch giới hạn trên"
    ],
    "correctIndex": 0,
    "correctAnswer": "Có cùng trị số dung sai",
    "correctAnswerLetter": "A",
    "chapterId": "ch1",
    "chapterTitle": "Chương I: Tổng Quan",
    "explanation": "Đáp án đúng là A: Có cùng trị số dung sai"
  },
  {
    "id": 33,
    "question": "Chọn trường hợp đúng khi biết miền dung sai của kích thước:",
    "options": [
      "Các đáp án đưa ra đều đúng",
      "Bết được cấp chính xác",
      "Biết được trị số dung sai",
      "Biết được cả hai sai lệch giới hạn"
    ],
    "correctIndex": 0,
    "correctAnswer": "Các đáp án đưa ra đều đúng",
    "correctAnswerLetter": "A",
    "chapterId": "ch1",
    "chapterTitle": "Chương I: Tổng Quan",
    "explanation": "Đáp án đúng là A: Các đáp án đưa ra đều đúng"
  },
  {
    "id": 34,
    "question": "Chọn trường hợp đúng đối với sai lệch giới hạn trên của chi tiết trục:",
    "options": [
      "= dmax-dmin",
      "= Dmax-Dmin",
      "Ký hiệu là es",
      "> 0"
    ],
    "correctIndex": 2,
    "correctAnswer": "Ký hiệu là es",
    "correctAnswerLetter": "C",
    "chapterId": "ch1",
    "chapterTitle": "Chương I: Tổng Quan",
    "explanation": "Sai lệch giới hạn trên của trục ký hiệu là 'es' (écart supérieur), của lỗ ký hiệu là 'ES'."
  },
  {
    "id": 35,
    "question": "Chọn trường hợp đúng với sai lệch cơ bản:",
    "options": [
      "Các đáp án đưa ra đều đúng",
      "Ký hiệu bằng 1 hoặc 2 chữ cái",
      "Cho biết vị trí của miền dung sai so với đường không",
      "Là một trong hai sai lệch giới hạn"
    ],
    "correctIndex": 0,
    "correctAnswer": "Các đáp án đưa ra đều đúng",
    "correctAnswerLetter": "A",
    "chapterId": "ch1",
    "chapterTitle": "Chương I: Tổng Quan",
    "explanation": "Sai lệch cơ bản là sai lệch dùng để xác định vị trí của miền dung sai so với đường không, ký hiệu bằng chữ cái Latinh."
  },
  {
    "id": 36,
    "question": "Vị trí miền dung sai 45H7 so với đường không:",
    "options": [
      "Đối xứng qua đường không",
      "Hoàn toàn nằm phía trên đường không",
      "Từ đường không trở xuống",
      "Từ đường không trở lên"
    ],
    "correctIndex": 3,
    "correctAnswer": "Từ đường không trở lên",
    "correctAnswerLetter": "D",
    "chapterId": "ch1",
    "chapterTitle": "Chương I: Tổng Quan",
    "explanation": "Miền dung sai H có sai lệch giới hạn dưới EI = 0, do đó miền dung sai nằm từ đường không trở lên phía trên."
  },
  {
    "id": 37,
    "question": "Trên bản vẽ ghi kích thước 40+0,025 thì sai lệch giới hạn dưới là:",
    "options": [
      "Không xác định được",
      "0,025 mm",
      "0 mm",
      "0,025 mm"
    ],
    "correctIndex": 2,
    "correctAnswer": "0 mm",
    "correctAnswerLetter": "C",
    "chapterId": "ch1",
    "chapterTitle": "Chương I: Tổng Quan",
    "explanation": "Ghi 40+0,025: Sai lệch trên ES = +0,025 mm, sai lệch dưới không ghi tức là EI = 0 mm."
  },
  {
    "id": 38,
    "question": "Trên bản vẽ ghi kích thước 40±0,01, hãy chọn trường hợp nào đúng:",
    "options": [
      "Sai lệch giới hạn trên = 0,01mm",
      "Sai lệch giới hạn trên = 0",
      "Sai lệch giới hạn dưới = 0",
      "Sai lệch giới hạn bằng nhau"
    ],
    "correctIndex": 0,
    "correctAnswer": "Sai lệch giới hạn trên = 0,01mm",
    "correctAnswerLetter": "A",
    "chapterId": "ch1",
    "chapterTitle": "Chương I: Tổng Quan",
    "explanation": "Ghi 40±0,01: Sai lệch giới hạn trên es = +0,01 mm; sai lệch giới hạn dưới ei = -0,01 mm."
  },
  {
    "id": 39,
    "question": "Trong ký hiệu  50H7/k6; ký hiệu \"H\" cho biết điều gi?",
    "options": [
      "Cấp chính xác của lỗ",
      "Cấp chính xác của trục",
      "Dung sai của trục",
      "Dung sai của lỗ"
    ],
    "correctIndex": 3,
    "correctAnswer": "Dung sai của lỗ",
    "correctAnswerLetter": "D",
    "chapterId": "ch1",
    "chapterTitle": "Chương I: Tổng Quan",
    "explanation": "Trong ký hiệu 50H7/k6: Chữ cái in hoa 'H' là miền dung sai của lỗ, số '7' là cấp chính xác của lỗ."
  },
  {
    "id": 40,
    "question": "Trong ký hiệu  50H7/k6; ký hiệu \"k\" cho biết điều gi?",
    "options": [
      "Dung sai của trục",
      "Cấp chính xác của lỗ",
      "Dung sai của lỗ",
      "Cấp chính xác của trục"
    ],
    "correctIndex": 0,
    "correctAnswer": "Dung sai của trục",
    "correctAnswerLetter": "A",
    "chapterId": "ch1",
    "chapterTitle": "Chương I: Tổng Quan",
    "explanation": "Trong ký hiệu 50H7/k6: Chữ cái thường 'k' là miền dung sai của trục, số '6' là cấp chính xác của trục."
  },
  {
    "id": 41,
    "question": "Trong ký hiệu  50H7/k6; số \"7\" trong H7 có nghĩa là gì?",
    "options": [
      "Dung sai của lỗ",
      "Cấp chính xác của trục",
      "Dung sai của trục",
      "Cấp chính xác của lỗ"
    ],
    "correctIndex": 3,
    "correctAnswer": "Cấp chính xác của lỗ",
    "correctAnswerLetter": "D",
    "chapterId": "ch1",
    "chapterTitle": "Chương I: Tổng Quan",
    "explanation": "Trong ký hiệu 50H7/k6: Chữ cái in hoa 'H' là miền dung sai của lỗ, số '7' là cấp chính xác của lỗ."
  },
  {
    "id": 42,
    "question": "Trong ký hiệu  50H7/k6; số \"6\" trong k6 có nghĩa là gì?",
    "options": [
      "Cấp chính xác của lỗ",
      "Dung sai của lỗ",
      "Dung sai của trục",
      "Cấp chính xác của trục"
    ],
    "correctIndex": 3,
    "correctAnswer": "Cấp chính xác của trục",
    "correctAnswerLetter": "D",
    "chapterId": "ch1",
    "chapterTitle": "Chương I: Tổng Quan",
    "explanation": "Trong ký hiệu 50H7/k6: Chữ cái thường 'k' là miền dung sai của trục, số '6' là cấp chính xác của trục."
  },
  {
    "id": 43,
    "question": "Miền dung sai \"H\" có đặc điểm là:",
    "options": [
      "Sai lệch giới hạn dưới bằng 0",
      "Sai lệch giới hạn trên bằng 0",
      "Sai lệch giới hạn dưới dương",
      "Sai lệch giới hạn trên âm"
    ],
    "correctIndex": 0,
    "correctAnswer": "Sai lệch giới hạn dưới bằng 0",
    "correctAnswerLetter": "A",
    "chapterId": "ch1",
    "chapterTitle": "Chương I: Tổng Quan",
    "explanation": "Miền dung sai lỗ cơ bản 'H' có đặc điểm chuẩn là sai lệch giới hạn dưới EI = 0."
  },
  {
    "id": 44,
    "question": "Miền dung sai \"D\" có đặc điểm là:",
    "options": [
      "Sai lệch giới hạn dưới bằng 0",
      "Sai lệch giới hạn trên bằng 0",
      "Sai lệch giới hạn trên âm",
      "Sai lệch giới hạn dưới dương"
    ],
    "correctIndex": 3,
    "correctAnswer": "Sai lệch giới hạn dưới dương",
    "correctAnswerLetter": "D",
    "chapterId": "ch1",
    "chapterTitle": "Chương I: Tổng Quan",
    "explanation": "Đáp án đúng là D: Sai lệch giới hạn dưới dương"
  },
  {
    "id": 45,
    "question": "Miền dung sai \"Js\" có đặc điểm là:",
    "options": [
      "Sai lệch giới hạn dưới bằng 0",
      "Sai lệch giới hạn trên âm",
      "Sai lệch giới hạn dưới dương",
      "Miền dung sai đối xứng qua đường không"
    ],
    "correctIndex": 3,
    "correctAnswer": "Miền dung sai đối xứng qua đường không",
    "correctAnswerLetter": "D",
    "chapterId": "ch1",
    "chapterTitle": "Chương I: Tổng Quan",
    "explanation": "Miền dung sai Js (lỗ) và js (trục) có miền dung sai phân bố đối xứng hoàn toàn qua đường không (ES = +IT/2, EI = -IT/2)."
  },
  {
    "id": 46,
    "question": "Miền dung sai \"h\" có đặc điểm là:",
    "options": [
      "Sai lệch giới hạn trên bằng 0",
      "Sai lệch giới hạn dưới dương",
      "Sai lệch giới hạn dưới bằng 0",
      "Sai lệch giới hạn trên âm"
    ],
    "correctIndex": 0,
    "correctAnswer": "Sai lệch giới hạn trên bằng 0",
    "correctAnswerLetter": "A",
    "chapterId": "ch1",
    "chapterTitle": "Chương I: Tổng Quan",
    "explanation": "Miền dung sai trục cơ bản 'h' có đặc điểm chuẩn là sai lệch giới hạn trên es = 0."
  },
  {
    "id": 47,
    "question": "Miền dung sai \"P\" có đặc điểm là:",
    "options": [
      "Sai lệch giới hạn trên âm",
      "Sai lệch giới hạn dưới bằng 0",
      "Sai lệch giới hạn dưới dương",
      "Sai lệch giới hạn trên bằng 0"
    ],
    "correctIndex": 0,
    "correctAnswer": "Sai lệch giới hạn trên âm",
    "correctAnswerLetter": "A",
    "chapterId": "ch1",
    "chapterTitle": "Chương I: Tổng Quan",
    "explanation": "Đáp án đúng là A: Sai lệch giới hạn trên âm"
  },
  {
    "id": 48,
    "question": "Miền dung sai \"f\" có đặc điểm là:",
    "options": [
      "Sai lệch giới hạn dưới dương",
      "Sai lệch giới hạn trên âm",
      "Sai lệch giới hạn dưới bằng 0",
      "Sai lệch giới hạn trên bằng 0"
    ],
    "correctIndex": 1,
    "correctAnswer": "Sai lệch giới hạn trên âm",
    "correctAnswerLetter": "B",
    "chapterId": "ch1",
    "chapterTitle": "Chương I: Tổng Quan",
    "explanation": "Đáp án đúng là B: Sai lệch giới hạn trên âm"
  },
  {
    "id": 49,
    "question": "Miền dung sai \"n\" có đặc điểm là:",
    "options": [
      "Sai lệch giới hạn dưới dương",
      "Sai lệch giới hạn trên âm",
      "Sai lệch giới hạn trên bằng 0",
      "Sai lệch giới hạn dưới bằng 0"
    ],
    "correctIndex": 0,
    "correctAnswer": "Sai lệch giới hạn dưới dương",
    "correctAnswerLetter": "A",
    "chapterId": "ch1",
    "chapterTitle": "Chương I: Tổng Quan",
    "explanation": "Đáp án đúng là A: Sai lệch giới hạn dưới dương"
  },
  {
    "id": 50,
    "question": "Kích thước nào sau đây có miền dung sai nhỏ nhất?",
    "options": [
      "50-0,05",
      "50+0,05",
      "50-0,03",
      "50±0,01"
    ],
    "correctIndex": 3,
    "correctAnswer": "50±0,01",
    "correctAnswerLetter": "D",
    "chapterId": "ch1",
    "chapterTitle": "Chương I: Tổng Quan",
    "explanation": "Đáp án đúng là D: 50±0,01"
  },
  {
    "id": 51,
    "question": "Kích thước nào sau đây có miền dung sai nhỏ nhất?",
    "options": [
      "50±0,02",
      "50-0,03",
      "50-0,05",
      "50+0,05"
    ],
    "correctIndex": 1,
    "correctAnswer": "50-0,03",
    "correctAnswerLetter": "B",
    "chapterId": "ch1",
    "chapterTitle": "Chương I: Tổng Quan",
    "explanation": "Đáp án đúng là B: 50-0,03"
  },
  {
    "id": 52,
    "question": "Kích thước nào sau đây có miền dung sai lớn nhất?",
    "options": [
      "50-0,05",
      "50-0,03",
      "50±0,02",
      "50+0,04"
    ],
    "correctIndex": 0,
    "correctAnswer": "50-0,05",
    "correctAnswerLetter": "A",
    "chapterId": "ch1",
    "chapterTitle": "Chương I: Tổng Quan",
    "explanation": "Đáp án đúng là A: 50-0,05"
  },
  {
    "id": 53,
    "question": "Cấp chính xác cao nhất là:",
    "options": [
      "18",
      "1",
      "20",
      "01"
    ],
    "correctIndex": 3,
    "correctAnswer": "01",
    "correctAnswerLetter": "D",
    "chapterId": "ch1",
    "chapterTitle": "Chương I: Tổng Quan",
    "explanation": "Tiêu chuẩn ISO/TCVN quy định 20 cấp chính xác từ cao đến thấp: 01, 0, 1, 2, ..., 18. Cấp chính xác cao nhất là 01."
  },
  {
    "id": 54,
    "question": "Cấp chính xác thấp nhất là:",
    "options": [
      "01",
      "20",
      "18",
      "1"
    ],
    "correctIndex": 2,
    "correctAnswer": "18",
    "correctAnswerLetter": "C",
    "chapterId": "ch1",
    "chapterTitle": "Chương I: Tổng Quan",
    "explanation": "Cấp chính xác thấp nhất theo tiêu chuẩn là cấp 18."
  },
  {
    "id": 55,
    "question": "Tổng số cấp độ chính xác là:",
    "options": [
      "10",
      "14",
      "20",
      "18"
    ],
    "correctIndex": 2,
    "correctAnswer": "20",
    "correctAnswerLetter": "C",
    "chapterId": "ch1",
    "chapterTitle": "Chương I: Tổng Quan",
    "explanation": "Tổng số cấp chính xác tiêu chuẩn là 20 cấp (01, 0, 1, 2, ..., 18)."
  },
  {
    "id": 56,
    "question": "Kích thước nào sau đây chính xác nhất?",
    "options": [
      "50M6",
      "50R10",
      "50H7",
      "50D8"
    ],
    "correctIndex": 0,
    "correctAnswer": "50M6",
    "correctAnswerLetter": "A",
    "chapterId": "ch1",
    "chapterTitle": "Chương I: Tổng Quan",
    "explanation": "Cấp chính xác có số càng nhỏ thì độ chính xác càng cao (cấp 6 chính xác hơn cấp 7, cấp 8, cấp 10)."
  },
  {
    "id": 57,
    "question": "Kích thước nào sau đây kém chính xác nhất",
    "options": [
      "50D8",
      "50M6",
      "50H7",
      "50R10"
    ],
    "correctIndex": 3,
    "correctAnswer": "50R10",
    "correctAnswerLetter": "D",
    "chapterId": "ch1",
    "chapterTitle": "Chương I: Tổng Quan",
    "explanation": "Đáp án đúng là D: 50R10"
  },
  {
    "id": 58,
    "question": "Trong mối ghép 45H7/k6, hãy chọn trường hợp đúng:",
    "options": [
      "Không so sánh được",
      "Độ chính xác bằng nhau",
      "Bề mặt trục có độ chính xác cao hơn",
      "Bề mặt lỗ có độ chính xác cao hơn"
    ],
    "correctIndex": 2,
    "correctAnswer": "Bề mặt trục có độ chính xác cao hơn",
    "correctAnswerLetter": "C",
    "chapterId": "ch1",
    "chapterTitle": "Chương I: Tổng Quan",
    "explanation": "Trong mối ghép 45H7/k6: Trục có cấp chính xác 6, lỗ có cấp chính xác 7. Số nhỏ hơn thì độ chính xác cao hơn -> Trục có độ chính xác cao hơn lỗ."
  },
  {
    "id": 59,
    "question": "Trường hợp kích thước nào sau đây có độ chính xác cao nhất?",
    "options": [
      "45k6",
      "45h9",
      "45N9",
      "45H7"
    ],
    "correctIndex": 0,
    "correctAnswer": "45k6",
    "correctAnswerLetter": "A",
    "chapterId": "ch1",
    "chapterTitle": "Chương I: Tổng Quan",
    "explanation": "Cấp chính xác có số càng nhỏ thì độ chính xác càng cao (cấp 6 chính xác hơn cấp 7, cấp 8, cấp 10)."
  },
  {
    "id": 60,
    "question": "Kích thước càng chính xác khi:",
    "options": [
      "Sai lệch giới hạn trên nhỏ",
      "Miền dung sai gần với kích thước danh nghĩa",
      "Sai lệch giới dưới nhỏ",
      "Miền dung sai nhỏ"
    ],
    "correctIndex": 3,
    "correctAnswer": "Miền dung sai nhỏ",
    "correctAnswerLetter": "D",
    "chapterId": "ch1",
    "chapterTitle": "Chương I: Tổng Quan",
    "explanation": "Kích thước càng chính xác khi trị số dung sai T càng nhỏ (miền dung sai càng hẹp)."
  },
  {
    "id": 61,
    "question": "Cấp độ bóng cao nhất là:",
    "options": [
      "01",
      "14",
      "20",
      "18"
    ],
    "correctIndex": 1,
    "correctAnswer": "14",
    "correctAnswerLetter": "B",
    "chapterId": "ch1",
    "chapterTitle": "Chương I: Tổng Quan",
    "explanation": "Tiêu chuẩn phân chia độ bóng bề mặt thành 14 cấp (từ cấp 1 đến cấp 14). Cấp độ bóng cao nhất là 14."
  },
  {
    "id": 62,
    "question": "Cấp độ bóng nào thấp nhất là:",
    "options": [
      "14",
      "20",
      "1",
      "18"
    ],
    "correctIndex": 2,
    "correctAnswer": "1",
    "correctAnswerLetter": "C",
    "chapterId": "ch1",
    "chapterTitle": "Chương I: Tổng Quan",
    "explanation": "Cấp độ bóng bề mặt thấp nhất (thô nhất) là cấp 1."
  },
  {
    "id": 63,
    "question": "Tổng số cấp độ bóng là:",
    "options": [
      "20",
      "10",
      "18",
      "14"
    ],
    "correctIndex": 3,
    "correctAnswer": "14",
    "correctAnswerLetter": "D",
    "chapterId": "ch1",
    "chapterTitle": "Chương I: Tổng Quan",
    "explanation": "Tiêu chuẩn phân chia độ bóng bề mặt thành 14 cấp (từ cấp 1 đến cấp 14). Cấp độ bóng cao nhất là 14."
  },
  {
    "id": 64,
    "question": "Số lượng chỉ số được sử dụng để đánh giá độ bóng bề mặt chi tiết máy là:",
    "options": [
      "1",
      "2",
      "4",
      "3"
    ],
    "correctIndex": 1,
    "correctAnswer": "2",
    "correctAnswerLetter": "B",
    "chapterId": "ch1",
    "chapterTitle": "Chương I: Tổng Quan",
    "explanation": "Có 2 chỉ tiêu chính đánh giá độ nhám bề mặt: 1. Sai lệch trung bình số học Ra; 2. Chiều cao mấp mô Rz."
  },
  {
    "id": 65,
    "question": "Chỉ số Ra được sử dụng để đánh giá độ bóng như sau:",
    "options": [
      "Các bề mặt có độ bóng rất cao",
      "Các bề mặt có độ bóng rất cao và các bề mặt có độ bóng rất thấp",
      "Các bề mặt có độ bóng rất thấp",
      "Các bề mặt có độ bóng trung bình"
    ],
    "correctIndex": 3,
    "correctAnswer": "Các bề mặt có độ bóng trung bình",
    "correctAnswerLetter": "D",
    "chapterId": "ch1",
    "chapterTitle": "Chương I: Tổng Quan",
    "explanation": "Chỉ số Ra (sai lệch trung bình số học) thường áp dụng đo độ bóng trung bình (từ cấp 6 đến cấp 12), còn Rz áp dụng cho bề mặt rất thô hoặc rất bóng."
  },
  {
    "id": 66,
    "question": "Sản phẩm đúc có đặc điểm là",
    "options": [
      "Có kích thước và hình dạng giống khuôn",
      "Có hình dạng giống với khuôn",
      "Có kích thước bằng với kích thước của khuôn",
      "Có kích thước và hình dạng giống lòng khuôn"
    ],
    "correctIndex": 3,
    "correctAnswer": "Có kích thước và hình dạng giống lòng khuôn",
    "correctAnswerLetter": "D",
    "chapterId": "ch2",
    "chapterTitle": "Chương II: Phương Pháp Đúc Kim Loại",
    "explanation": "Vật đúc là sản phẩm được tạo thành do kim loại lỏng điền đầy và đông đặc lại trong lòng khuôn, do đó có kích thước và hình dáng giống với lòng khuôn (có tính thêm lượng dư gia công và độ co rút)."
  },
  {
    "id": 67,
    "question": "Đúc kim loại là:",
    "options": [
      "Nghiền nhỏ kim loại trộn với nước rồi đổ vào khuôn",
      "Dùng lực ép kim loại vào khuôn ở nhiệt độ thường",
      "Nấu kim loại đến trạng thái chảy loãng rồi rót vào khuôn",
      "Nung nóng đỏ kim loại rồi ép vào khuôn"
    ],
    "correctIndex": 2,
    "correctAnswer": "Nấu kim loại đến trạng thái chảy loãng rồi rót vào khuôn",
    "correctAnswerLetter": "C",
    "chapterId": "ch2",
    "chapterTitle": "Chương II: Phương Pháp Đúc Kim Loại",
    "explanation": "Đúc là phương pháp nấu chảy kim loại thành trạng thái lỏng loãng, sau đó rót vào lòng khuôn có hình dáng định trước rồi để nguội kết tinh thành sản phẩm."
  },
  {
    "id": 68,
    "question": "Chọn trường hợp đúng cho vật liệu làm khuôn đúc?",
    "options": [
      "Dễ làm khuôn",
      "Chịu được nhiệt độ cao hơn nhiệt độ kim loại nóng chảy",
      "Đủ độ cứng, độ bền, dễ thoát khí",
      "Các đáp án đưa ra đều đúng"
    ],
    "correctIndex": 3,
    "correctAnswer": "Các đáp án đưa ra đều đúng",
    "correctAnswerLetter": "D",
    "chapterId": "ch2",
    "chapterTitle": "Chương II: Phương Pháp Đúc Kim Loại",
    "explanation": "Vật liệu làm khuôn đúc cần hội đủ các tính chất: dễ tạo hình khuôn, chịu được nhiệt độ cao của kim loại lỏng, có độ cứng, độ bền cơ học và đặc biệt là độ thông khí tốt để thoát hơi."
  },
  {
    "id": 69,
    "question": "Chọn trường hợp đúng so sánh tính đúc của gang?",
    "options": [
      "Khi chuyển sang đông đặc co ngót nhiều hơn",
      "Dễ điền đầy lòng khuôn",
      "Nhiệt độ nóng chảy cao hơn",
      "Tính chảy loãng kém"
    ],
    "correctIndex": 1,
    "correctAnswer": "Dễ điền đầy lòng khuôn",
    "correctAnswerLetter": "B",
    "chapterId": "ch2",
    "chapterTitle": "Chương II: Phương Pháp Đúc Kim Loại",
    "explanation": "Gang có nhiệt độ nóng chảy thấp hơn thép, độ chảy loãng cao và tính co ngót nhỏ nên tính đúc của gang rất tốt, rất dễ điền đầy lòng khuôn."
  },
  {
    "id": 70,
    "question": "Chọn phát biểu đúng về mẫu để làm khuôn cát?",
    "options": [
      "Mẫu có hình dạng giống hoàn toàn vật đúc",
      "Mẫu không liên quan tới vật đúc",
      "Mẫu không có lỗ rỗng như vật đúc",
      "Mẫu có lỗ rỗng như vật đúc"
    ],
    "correctIndex": 2,
    "correctAnswer": "Mẫu không có lỗ rỗng như vật đúc",
    "correctAnswerLetter": "C",
    "chapterId": "ch2",
    "chapterTitle": "Chương II: Phương Pháp Đúc Kim Loại",
    "explanation": "Mẫu dùng để tạo lòng khuôn (phần ngoài của vật đúc). Mẫu không có lỗ rỗng; phần rỗng hoặc lỗ bên trong vật đúc sẽ do lõi (ruột) đảm nhiệm."
  },
  {
    "id": 71,
    "question": "Chọn phát biểu đúng về lõi để làm khuôn cát?",
    "options": [
      "Lõi để chống đỡ khuôn",
      "Lõi có hình dạng như vật đúc",
      "Lõi để tạo ra phàn rỗng trong khuôn",
      "Lõi tạo ra phần rỗng trong vật đúc"
    ],
    "correctIndex": 3,
    "correctAnswer": "Lõi tạo ra phần rỗng trong vật đúc",
    "correctAnswerLetter": "D",
    "chapterId": "ch2",
    "chapterTitle": "Chương II: Phương Pháp Đúc Kim Loại",
    "explanation": "Lõi (ruột) được đặt vào trong lòng khuôn với công dụng chính là tạo ra phần rỗng hoặc lỗ bên trong vật đúc."
  },
  {
    "id": 72,
    "question": "Hệ thống rót của khuôn cát bao gồm:",
    "options": [
      "4 bộ phận chính",
      "2 bộ phận chính",
      "5 bộ phận chính",
      "3 bộ phận chính"
    ],
    "correctIndex": 0,
    "correctAnswer": "4 bộ phận chính",
    "correctAnswerLetter": "A",
    "chapterId": "ch2",
    "chapterTitle": "Chương II: Phương Pháp Đúc Kim Loại",
    "explanation": "Hệ thống rót trong khuôn cát thường bao gồm 4 bộ phận chính: Cốc rót (hoặc phễu rót), Ống rót, Rãnh lọc xỉ và Cửa rót."
  },
  {
    "id": 73,
    "question": "Vị trí hệ thống rót trong khuôn cát được bố trí ở vị trí nào?",
    "options": [
      "Phía trên lòng khuôn",
      "Ở hòm khuôn trên",
      "Ở hòm khuôn dưới",
      "Sát vách lòng khuôn"
    ],
    "correctIndex": 1,
    "correctAnswer": "Ở hòm khuôn trên",
    "correctAnswerLetter": "B",
    "chapterId": "ch2",
    "chapterTitle": "Chương II: Phương Pháp Đúc Kim Loại",
    "explanation": "Hệ thống rót thường được bố trí ở hòm khuôn trên để tận dụng trọng lực giúp kim loại lỏng chảy xuống điền đầy lòng khuôn bên dưới."
  },
  {
    "id": 74,
    "question": "Công dụng của đậu ngót để làm gì?",
    "options": [
      "Tự động bổ sung kim loại lỏng cho vật đúc khi co thể tích",
      "Rót thêm kim loại lỏng khi bị co ngót",
      "Quan sát kim loại lỏng trong khuôn",
      "Để không khí trong lòng khuôn thoát ra ngoài"
    ],
    "correctIndex": 0,
    "correctAnswer": "Tự động bổ sung kim loại lỏng cho vật đúc khi co thể tích",
    "correctAnswerLetter": "A",
    "chapterId": "ch2",
    "chapterTitle": "Chương II: Phương Pháp Đúc Kim Loại",
    "explanation": "Đậu ngót (riser) có công dụng dự trữ và tự động bổ sung kim loại lỏng cho vật đúc trong quá trình kim loại co ngót thể tích khi đông đặc, tránh tạo lỗ co rỗng."
  },
  {
    "id": 75,
    "question": "Đặc điểm nào sau đây không đúng với đặc điểm phương pháp đúc",
    "options": [
      "Cho độ chính xác và độ bóng cao",
      "Hao tổn kim loại nhiều hơn so với các phương pháp khác",
      "Có thể tạo hình được những chi tiết phức tạp",
      "Dễ gây khuyết tật bên trong"
    ],
    "correctIndex": 0,
    "correctAnswer": "Cho độ chính xác và độ bóng cao",
    "correctAnswerLetter": "A",
    "chapterId": "ch2",
    "chapterTitle": "Chương II: Phương Pháp Đúc Kim Loại",
    "explanation": "Phương pháp đúc thông thường (đặc biệt đúc khuôn cát) có độ chính xác kích thước và độ bóng bề mặt thấp, thường cần phải qua gia công cắt gọt."
  },
  {
    "id": 76,
    "question": "Đâu là ưu điểm của phương pháp đúc",
    "options": [
      "Tiết kiệm vật liệu",
      "Độ chính xác cao",
      "Có thể tạo hình được những chi tiết phức tạp",
      "Độ bóng bề mặt cao"
    ],
    "correctIndex": 2,
    "correctAnswer": "Có thể tạo hình được những chi tiết phức tạp",
    "correctAnswerLetter": "C",
    "chapterId": "ch2",
    "chapterTitle": "Chương II: Phương Pháp Đúc Kim Loại",
    "explanation": "Đúc có khả năng tạo hình được những chi tiết có kết cấu hình học bên trong và bên ngoài vô cùng phức tạp mà các phương pháp cán, rèn, dập không thể gia công được."
  },
  {
    "id": 77,
    "question": "Tính chất nào sau đây của vật liệu ảnh hưởng trực tiếp đến chất lượng của chất lượng vật đúc",
    "options": [
      "Khối lượng riêng, nhiệt dung riêng",
      "Nhiệt độ nóng chảy, khả năng dẫn nhiệt",
      "Độ cứng, độ bền",
      "Độ co gót, tính thiên tích, độ chảy loãng"
    ],
    "correctIndex": 3,
    "correctAnswer": "Độ co gót, tính thiên tích, độ chảy loãng",
    "correctAnswerLetter": "D",
    "chapterId": "ch2",
    "chapterTitle": "Chương II: Phương Pháp Đúc Kim Loại",
    "explanation": "Chất lượng vật đúc phụ thuộc trực tiếp vào độ co ngót (gây nứt, rỗ co), tính thiên tích (không đều thành phần hóa học) và độ chảy loãng (khả năng điền đầy lòng khuôn)."
  },
  {
    "id": 78,
    "question": "Khi vật liệu có tính chảy loãng thấp, phương pháp đúc nào sau đây cho chất lượng sản phẩm cao nhất?",
    "options": [
      "Đúc trong khuôn kim loại",
      "Đúc ly tâm",
      "Đúc áp lực",
      "Đúc trong khuôn cát"
    ],
    "correctIndex": 2,
    "correctAnswer": "Đúc áp lực",
    "correctAnswerLetter": "C",
    "chapterId": "ch2",
    "chapterTitle": "Chương II: Phương Pháp Đúc Kim Loại",
    "explanation": "Khi kim loại có độ chảy loãng thấp hoặc độ nhớt cao, phương pháp đúc áp lực dùng áp suất cưỡng bức để ép kim loại lỏng điền đầy mọi ngóc ngách của lòng khuôn."
  },
  {
    "id": 79,
    "question": "Khi đúc những chi tiết rất lớn người ta thường dùng phương pháp đúc nào",
    "options": [
      "Đúc trong khuôn kim loại",
      "Đúc áp lực",
      "Đức trong hòm khuôn",
      "Đúc trên nền xưởng"
    ],
    "correctIndex": 3,
    "correctAnswer": "Đúc trên nền xưởng",
    "correctAnswerLetter": "D",
    "chapterId": "ch2",
    "chapterTitle": "Chương II: Phương Pháp Đúc Kim Loại",
    "explanation": "Với những chi tiết có kích thước và khối lượng cực kỳ lớn (vài chục đến hàng trăm tấn), không thể đưa vào hòm khuôn thông thường mà người ta tiến hành đúc trực tiếp trên nền xưởng."
  },
  {
    "id": 80,
    "question": "Đâu không phải là ưu điểm của phương pháp đúc",
    "options": [
      "Coó thể đúc được cả",
      "Có thể gia công được những chi tiết rất lớn",
      "Tiết kiệm nguyên vật liệu",
      "Có thể gia công được những chi tiết nhỏ"
    ],
    "correctIndex": 2,
    "correctAnswer": "Tiết kiệm nguyên vật liệu",
    "correctAnswerLetter": "C",
    "chapterId": "ch2",
    "chapterTitle": "Chương II: Phương Pháp Đúc Kim Loại",
    "explanation": "Đúc hao tổn kim loại khá lớn do hệ thống rót, đậu ngót, đậu hơi và lượng dư gia công cắt gọt lớn, do đó 'Tiết kiệm nguyên vật liệu' KHÔNG phải là ưu điểm của đúc."
  },
  {
    "id": 81,
    "question": "Phương pháp đúc nào có thể đúc được những chi tiết có thành, cánh mỏng",
    "options": [
      "Đúc trong khuôn kim loại",
      "Đúc trong khuôn vỏ mỏng",
      "Đúc áp lực",
      "Đúc ly tâm"
    ],
    "correctIndex": 2,
    "correctAnswer": "Đúc áp lực",
    "correctAnswerLetter": "C",
    "chapterId": "ch2",
    "chapterTitle": "Chương II: Phương Pháp Đúc Kim Loại",
    "explanation": "Đúc áp lực ép kim loại lỏng dưới áp suất cao và tốc độ lớn, rất thích hợp đúc các chi tiết mỏng, cánh mỏng và gân mỏng mà kim loại thường khó điền đầy."
  },
  {
    "id": 82,
    "question": "Phương pháp đúc nào có thể đúc được những chi tiết có nhiều hốc, lỗ phức tạp",
    "options": [
      "Đúc áp lực",
      "Đúc ly tâm",
      "Đúc trong khuôn vỏ mỏng",
      "Đúc trong khuôn kim loại"
    ],
    "correctIndex": 2,
    "correctAnswer": "Đúc trong khuôn vỏ mỏng",
    "correctAnswerLetter": "C",
    "chapterId": "ch2",
    "chapterTitle": "Chương II: Phương Pháp Đúc Kim Loại",
    "explanation": "Đúc trong khuôn vỏ mỏng (Shell Molding) tạo ra thành khuôn mỏng bằng hỗn hợp cát - nhựa nhiệt rắn, cho độ chính xác cao và khả năng đúc được các chi tiết có hốc, lỗ phức tạp."
  },
  {
    "id": 83,
    "question": "Phương pháp đúc nào khuôn chỉ dùng được 1 lần",
    "options": [
      "Đúc trong khuôn kim loại",
      "Đúc áp lực",
      "Đúc trong khuôn cát",
      "Đúc ly tâm"
    ],
    "correctIndex": 2,
    "correctAnswer": "Đúc trong khuôn cát",
    "correctAnswerLetter": "C",
    "chapterId": "ch2",
    "chapterTitle": "Chương II: Phương Pháp Đúc Kim Loại",
    "explanation": "Khuôn cát là loại khuôn đúc một lần: sau khi kim loại đông đặc, người ta phải phá vỡ khuôn cát để lấy vật đúc ra."
  },
  {
    "id": 84,
    "question": "Phương pháp đúc nào khuôn có thể dùng nhiều lần",
    "options": [
      "Đúc trên nền xưởng",
      "Đúc trong khuôn vỏ mỏng",
      "Đúc trong khuôn cát",
      "Đúc áp lực"
    ],
    "correctIndex": 3,
    "correctAnswer": "Đúc áp lực",
    "correctAnswerLetter": "D",
    "chapterId": "ch2",
    "chapterTitle": "Chương II: Phương Pháp Đúc Kim Loại",
    "explanation": "Đúc áp lực sử dụng khuôn đúc bằng thép kim loại cao cấp nên khuôn có độ bền rất cao và có thể sử dụng được hàng chục nghìn lần."
  },
  {
    "id": 85,
    "question": "Loại khuôn nào dưới đây làm giảm mạnh nhất tính chảy loãng của hợp kim đúc",
    "options": [
      "Khuôn đất sét",
      "Khuôn kim loại",
      "Khuôn cát",
      "Khuôn mẫu chảy"
    ],
    "correctIndex": 1,
    "correctAnswer": "Khuôn kim loại",
    "correctAnswerLetter": "B",
    "chapterId": "ch2",
    "chapterTitle": "Chương II: Phương Pháp Đúc Kim Loại",
    "explanation": "Khuôn kim loại có hệ số dẫn nhiệt rất lớn làm kim loại lỏng nguội và đông đặc nhanh chóng, làm giảm mạnh tính chảy loãng của hợp kim so với khuôn cát cách nhiệt."
  },
  {
    "id": 86,
    "question": "Phương pháp đúc nào yêu cầu yêu cầu nhiệt độ nóng chảy của kim loại đúc phải nhỏ hơn nhiều lần vật liệu làm khuôn",
    "options": [
      "Đúc ly tâm",
      "Đúc trong khuôn cát",
      "Đúc trong khuôn vỏ mỏng",
      "Đúc áp lực"
    ],
    "correctIndex": 3,
    "correctAnswer": "Đúc áp lực",
    "correctAnswerLetter": "D",
    "chapterId": "ch2",
    "chapterTitle": "Chương II: Phương Pháp Đúc Kim Loại",
    "explanation": "Trong đúc áp lực, kim loại đúc tiếp xúc liên tục dưới áp suất với khuôn thép, do đó kim loại đúc phải có nhiệt độ nóng chảy thấp hơn nhiều so với nhiệt độ làm việc của khuôn kim loại (như hợp kim nhôm, kẽm, magie)."
  },
  {
    "id": 87,
    "question": "Phương pháp đúc nào yêu cầu yêu cầu nhiệt độ nóng chảy của kim loại đúc phải nhỏ hơn nhiều lần vật liệu làm khuôn",
    "options": [
      "Đúc trong khuôn vỏ mỏng",
      "Đúc trong khuôn kim loại",
      "Đúc ly tâm",
      "Đúc trong khuôn cát"
    ],
    "correctIndex": 1,
    "correctAnswer": "Đúc trong khuôn kim loại",
    "correctAnswerLetter": "B",
    "chapterId": "ch2",
    "chapterTitle": "Chương II: Phương Pháp Đúc Kim Loại",
    "explanation": "Đúc trong khuôn kim loại yêu cầu nhiệt độ nóng chảy của hợp kim đúc phải thấp hơn vật liệu khuôn để tránh làm chảy hoặc biến dạng lòng khuôn kim loại."
  },
  {
    "id": 88,
    "question": "Phần rỗng trong khuôn (lòng khuôn) trong khuôn cát được tạo ra bởi:",
    "options": [
      "Chốt định vị",
      "Lõi",
      "Thành khuôn (hòm khuôn)",
      "Mẫu"
    ],
    "correctIndex": 3,
    "correctAnswer": "Mẫu",
    "correctAnswerLetter": "D",
    "chapterId": "ch2",
    "chapterTitle": "Chương II: Phương Pháp Đúc Kim Loại",
    "explanation": "Lòng khuôn (phần rỗng nhận kim loại lỏng) trong khuôn cát được tạo ra bằng cách lèn chặt cát xung quanh Mẫu, sau đó rút mẫu ra khỏi khuôn."
  },
  {
    "id": 89,
    "question": "Đúc trong khuôn cát làm khuôn bằng tay phù hợp với:",
    "options": [
      "Vật đúc phức tạp",
      "Vật đúc quá lớn",
      "Đọ chính xác thấp",
      "Các đáp án đưa ra đều đúng"
    ],
    "correctIndex": 3,
    "correctAnswer": "Các đáp án đưa ra đều đúng",
    "correctAnswerLetter": "D",
    "chapterId": "ch2",
    "chapterTitle": "Chương II: Phương Pháp Đúc Kim Loại",
    "explanation": "Làm khuôn cát bằng tay có tính linh hoạt cao, phù hợp với vật đúc phức tạp, đơn chiếc, kích thước quá lớn hoặc không đòi hỏi độ chính xác cao."
  },
  {
    "id": 90,
    "question": "Chọn trường hợp đúng với mẫu là gỗ?",
    "options": [
      "Dùng được bền",
      "Dễ chế tạo",
      "Độ chính xác cao",
      "Các đáp án đưa ra đều đúng"
    ],
    "correctIndex": 1,
    "correctAnswer": "Dễ chế tạo",
    "correctAnswerLetter": "B",
    "chapterId": "ch2",
    "chapterTitle": "Chương II: Phương Pháp Đúc Kim Loại",
    "explanation": "Mẫu bằng gỗ có ưu điểm nổi bật là dễ gia công chế tạo, khối lượng nhẹ, giá thành rẻ, thích hợp cho sản xuất đơn chiếc hoặc hàng loạt nhỏ."
  },
  {
    "id": 91,
    "question": "Chọn trường hợp đúng với mẫu là kim loại?",
    "options": [
      "Khó chế tạo và đắt tiền",
      "Các đáp án đưa ra đều đúng",
      "Độ bóng và độ chính xác cao",
      "Dùng được lâu bền"
    ],
    "correctIndex": 1,
    "correctAnswer": "Các đáp án đưa ra đều đúng",
    "correctAnswerLetter": "B",
    "chapterId": "ch2",
    "chapterTitle": "Chương II: Phương Pháp Đúc Kim Loại",
    "explanation": "Mẫu kim loại có độ bóng và độ chính xác cao, dùng được lâu bền, nhưng chế tạo khó và đắt tiền, phù hợp sản xuất hàng khối."
  },
  {
    "id": 92,
    "question": "Vật liệu làm thành khuôn cát là:",
    "options": [
      "Gỗ",
      "Xi măng",
      "Thép",
      "Hỗn hợp cát-đất xét"
    ],
    "correctIndex": 3,
    "correctAnswer": "Hỗn hợp cát-đất xét",
    "correctAnswerLetter": "D",
    "chapterId": "ch2",
    "chapterTitle": "Chương II: Phương Pháp Đúc Kim Loại",
    "explanation": "Vật liệu làm khuôn cát là hỗn hợp cát - đất sét (trong đó đất sét đóng vai trò làm chất dính kết các hạt cát)."
  },
  {
    "id": 93,
    "question": "Khuôn cát thường được xăm các lỗ nhỏ mục đích để làm gì?",
    "options": [
      "Để trang trí cho đẹp",
      "Để thoát khí khỏi lòng khuôn",
      "Để nèn chặt khuôn",
      "Để thoát kim loại dư ra ngoài"
    ],
    "correctIndex": 1,
    "correctAnswer": "Để thoát khí khỏi lòng khuôn",
    "correctAnswerLetter": "B",
    "chapterId": "ch2",
    "chapterTitle": "Chương II: Phương Pháp Đúc Kim Loại",
    "explanation": "Khuôn cát thường dùng kim xăm tạo các lỗ nhỏ thông hơi để hơi nước và khí sinh ra trong lòng khuôn thoát ra ngoài, tránh gây rỗ khí cho vật đúc."
  },
  {
    "id": 94,
    "question": "Đúc trong khuôn cát, vật liệu chính để làm khuôn là:",
    "options": [
      "Cát",
      "Cát+đất sét+chất phụ gia+chất kết dính",
      "Cát+đất sét",
      "Cát+đất sét+chất phụ gia+chất kết dính+nước"
    ],
    "correctIndex": 1,
    "correctAnswer": "Cát+đất sét+chất phụ gia+chất kết dính",
    "correctAnswerLetter": "B",
    "chapterId": "ch2",
    "chapterTitle": "Chương II: Phương Pháp Đúc Kim Loại",
    "explanation": "Hỗn hợp làm khuôn cát gồm: Cát (thành phần chịu nhiệt chính) + Đất sét (chất kết dính) + Các chất phụ gia + Nước tạo độ dẻo."
  },
  {
    "id": 95,
    "question": "Công dụng chính của đậu ngót là:",
    "options": [
      "Thoát nhiệt cho vật đúc đông đặc nhanh hơn",
      "Thoát khí trong lòng khuôn",
      "Chứa phần kim loại dư thừa",
      "Dùng để bổ sung kim loại cho vật đúc khi đông đặc"
    ],
    "correctIndex": 3,
    "correctAnswer": "Dùng để bổ sung kim loại cho vật đúc khi đông đặc",
    "correctAnswerLetter": "D",
    "chapterId": "ch2",
    "chapterTitle": "Chương II: Phương Pháp Đúc Kim Loại",
    "explanation": "Công dụng chính của đậu ngót là bổ sung kim loại lỏng cho vật đúc bù đắp lượng thể tích bị co lại trong quá trình đông đặc."
  },
  {
    "id": 96,
    "question": "Đậu ngót thường đặt ở vị trí nào trong khuôn:",
    "options": [
      "Bố trí tại vị trí cao nhất trong khuôn",
      "Bố trí tại vị trí xa cửa rót nhất",
      "Bố trí tại vùng kết tinh sau cùng của vật đúc",
      "Bố trí tại vị trí thấp nhất trong lòng khuôn"
    ],
    "correctIndex": 2,
    "correctAnswer": "Bố trí tại vùng kết tinh sau cùng của vật đúc",
    "correctAnswerLetter": "C",
    "chapterId": "ch2",
    "chapterTitle": "Chương II: Phương Pháp Đúc Kim Loại",
    "explanation": "Đậu ngót được bố trí tại vùng kết tinh sau cùng của vật đúc (phần kim loại dày nhất) để giữ kim loại lỏng lâu nhất nhằm bù ngót hiệu quả."
  },
  {
    "id": 97,
    "question": "Công dụng chính của đậu hơi là:",
    "options": [
      "Chứa phần kim loại dư thừa",
      "Thoát nhiệt cho vật đúc đông đặc nhanh hơn",
      "Dùng để bổ sung kim loại cho vật đúc khi đông đặc",
      "Thoát khí trong lòng khuôn"
    ],
    "correctIndex": 3,
    "correctAnswer": "Thoát khí trong lòng khuôn",
    "correctAnswerLetter": "D",
    "chapterId": "ch2",
    "chapterTitle": "Chương II: Phương Pháp Đúc Kim Loại",
    "explanation": "Đậu hơi (đậu ngót hở/lỗ thoát khí) có công dụng chính là giúp khí và hơi trong lòng khuôn thoát nhanh ra ngoài khi kim loại lỏng dâng lên."
  },
  {
    "id": 98,
    "question": "Đậu hơi thường đặt ở vị trí nào trong khuôn:",
    "options": [
      "Bố trí tại vị trí xa cửa rót nhất",
      "Bố trí tại vị trí thấp nhất trong lòng khuôn",
      "Bố trí tại vùng kết tinh sau cùng của vật đúc",
      "Bố trí tại vị trí cao nhất trong khuôn"
    ],
    "correctIndex": 3,
    "correctAnswer": "Bố trí tại vị trí cao nhất trong khuôn",
    "correctAnswerLetter": "D",
    "chapterId": "ch2",
    "chapterTitle": "Chương II: Phương Pháp Đúc Kim Loại",
    "explanation": "Đậu hơi luôn được bố trí tại vị trí cao nhất của lòng khuôn để không khí và hơi nổi lên trên thoát ra ngoài dễ dàng nhất."
  },
  {
    "id": 99,
    "question": "Đúc trong khuôn cát phù hợp với dạng sản xuất nào",
    "options": [
      "Sản xuất đơn chiếc",
      "Sản xuất hàng loạt lớn",
      "Sản xuất hàng khối",
      "Sản xuất hàng loạt nhỏ"
    ],
    "correctIndex": 0,
    "correctAnswer": "Sản xuất đơn chiếc",
    "correctAnswerLetter": "A",
    "chapterId": "ch2",
    "chapterTitle": "Chương II: Phương Pháp Đúc Kim Loại",
    "explanation": "Đúc trong khuôn cát làm bằng tay năng suất thấp, độ chính xác không cao nên rất phù hợp cho dạng sản xuất đơn chiếc hoặc hàng loạt nhỏ."
  },
  {
    "id": 100,
    "question": "Hỗn hợp cát làm khuôn bao gồm những loại nào",
    "options": [
      "Các áo và cát đúc",
      "Cát đúc và cát đệm",
      "Cát áo và cát đệm",
      "Cát áo và cát đúc"
    ],
    "correctIndex": 2,
    "correctAnswer": "Cát áo và cát đệm",
    "correctAnswerLetter": "C",
    "chapterId": "ch2",
    "chapterTitle": "Chương II: Phương Pháp Đúc Kim Loại",
    "explanation": "Hỗn hợp cát làm khuôn gồm 2 lớp chính: Cát áo (lớp cát mịn tiếp xúc trực tiếp với mẫu) và Cát đệm (lớp cát lấp đầy phía sau tăng độ cứng vững và tiết kiệm)."
  },
  {
    "id": 101,
    "question": "Phương pháp gia công nào làm thay đổi cấu trúc vật liệu",
    "options": [
      "Cán kim loại",
      "Dập thể tích",
      "Rèn tự do",
      "Đúc kim loại"
    ],
    "correctIndex": 3,
    "correctAnswer": "Đúc kim loại",
    "correctAnswerLetter": "D",
    "chapterId": "ch2",
    "chapterTitle": "Chương II: Phương Pháp Đúc Kim Loại",
    "explanation": "Đúc kim loại làm thay đổi cấu trúc vật liệu do quá trình chuyển pha từ lỏng sang rắn, tạo nên cấu trúc tinh thể đúc dạng đuôi gai và phân vùng kết tinh."
  },
  {
    "id": 102,
    "question": "Vật liệu nào không được sử dụng làm mẫu trong phương pháp đúc trong khuôn cát?",
    "options": [
      "Sáp",
      "Gỗ",
      "Thạch cao",
      "Kim loại"
    ],
    "correctIndex": 0,
    "correctAnswer": "Sáp",
    "correctAnswerLetter": "A",
    "chapterId": "ch2",
    "chapterTitle": "Chương II: Phương Pháp Đúc Kim Loại",
    "explanation": "Trong phương pháp đúc khuôn cát thông thường, mẫu phải rút ra khỏi khuôn nên làm bằng gỗ, kim loại, thạch cao. Sáp được dùng cho khuôn mẫu chảy (mẫu sáp bị nung chảy thoát ra)."
  },
  {
    "id": 103,
    "question": "Đúc trong áp lực phù hợp với dạng sản xuất nào?",
    "options": [
      "Sản xuất hàng khối và hàng loạt lớn",
      "Sản xuất hàng loạt lớn và hàng loạt nhỏ",
      "Sản xuất hàng loạt nhỏ",
      "Sản xuất đơn chiếc"
    ],
    "correctIndex": 0,
    "correctAnswer": "Sản xuất hàng khối và hàng loạt lớn",
    "correctAnswerLetter": "A",
    "chapterId": "ch2",
    "chapterTitle": "Chương II: Phương Pháp Đúc Kim Loại",
    "explanation": "Đúc áp lực có chi phí chế tạo khuôn kim loại và máy móc rất đắt tiền, chỉ hiệu quả kinh tế khi áp dụng cho sản xuất hàng khối và hàng loạt lớn."
  },
  {
    "id": 104,
    "question": "Đúc áp lực có ưu điểm gì so với đúc trong khuôn cát?",
    "options": [
      "Có thể đúc được những vật đúc có khối lượng lớn",
      "Giá thành chế tạo khuôn thấp",
      "Tính lún và khả năng thoát khí tốt",
      "Độ bóng và độ chính xác bề mặt cao"
    ],
    "correctIndex": 3,
    "correctAnswer": "Độ bóng và độ chính xác bề mặt cao",
    "correctAnswerLetter": "D",
    "chapterId": "ch2",
    "chapterTitle": "Chương II: Phương Pháp Đúc Kim Loại",
    "explanation": "Đúc áp lực có ưu điểm vượt trội so với đúc khuôn cát là độ chính xác kích thước cao và độ bóng bề mặt rất nhẵn mịn."
  },
  {
    "id": 105,
    "question": "Đặc điểm nào sau đây không đúng với phương pháp đúc trong khuôn kim loại?",
    "options": [
      "Khuôn dùng được nhiều lần",
      "Dễ gây nứt sản phẩm đúc",
      "Đúc được dễ dàng sản phẩm thành mỏng và có kết cấu phức tạp",
      "Sản phẩm có độ chính xác và độ bóng cao"
    ],
    "correctIndex": 1,
    "correctAnswer": "Dễ gây nứt sản phẩm đúc",
    "correctAnswerLetter": "B",
    "chapterId": "ch2",
    "chapterTitle": "Chương II: Phương Pháp Đúc Kim Loại",
    "explanation": "Đặc điểm của đúc khuôn kim loại: khuôn dùng nhiều lần, sản phẩm chính xác bóng đẹp, khuôn làm nguội nhanh cản trở co ngót nên dễ gây nứt sản phẩm đúc."
  },
  {
    "id": 106,
    "question": "Đặc điểm nào sau đây không đúng với phương pháp đúc trong áp lực?",
    "options": [
      "Sản phẩm có độ chính xác và độ bóng cao",
      "Dễ gây nứt sản phẩm đúc",
      "Đúc được dễ dàng sản phẩm thành mỏng và có kết cấu phức tạp",
      "Khuôn dùng được nhiều lần"
    ],
    "correctIndex": 1,
    "correctAnswer": "Dễ gây nứt sản phẩm đúc",
    "correctAnswerLetter": "B",
    "chapterId": "ch2",
    "chapterTitle": "Chương II: Phương Pháp Đúc Kim Loại",
    "explanation": "Trong đúc áp lực, kim loại được điền đầy dưới áp suất cao, khuôn dùng nhiều lần, sản phẩm bóng đẹp chính xác cao; hiện tượng nứt sản phẩm là điểm cần lưu ý kiểm soát."
  },
  {
    "id": 107,
    "question": "Đặc điểm nào sau đây không đúng với phương pháp đúc ly tâm?",
    "options": [
      "Cơ tính sản phẩm đúc đồng đều, chất lượng bề mặt tốt",
      "Máy đúc phải kín và được cân bằng động cao",
      "Thích hợp với chi tiết có cánh mỏng",
      "Thích hợp với chi tiết tròn xoay rỗng"
    ],
    "correctIndex": 2,
    "correctAnswer": "Thích hợp với chi tiết có cánh mỏng",
    "correctAnswerLetter": "C",
    "chapterId": "ch2",
    "chapterTitle": "Chương II: Phương Pháp Đúc Kim Loại",
    "explanation": "Đúc ly tâm dựa vào lực ly tâm để ép kim loại vào thành khuôn tròn xoay, rất thích hợp cho chi tiết tròn xoay rỗng (ống, xilanh), KHÔNG thích hợp cho chi tiết có cánh mỏng."
  },
  {
    "id": 108,
    "question": "Đúc trong khuôn kim loại phù hợp với dạng sản xuất nào?",
    "options": [
      "Sản xuất hàng loạt lớn và hàng loạt nhỏ",
      "Sản xuất hàng loạt nhỏ",
      "Sản xuất hàng khối và hàng loạt lớn",
      "Sản xuất đơn chiếc"
    ],
    "correctIndex": 2,
    "correctAnswer": "Sản xuất hàng khối và hàng loạt lớn",
    "correctAnswerLetter": "C",
    "chapterId": "ch2",
    "chapterTitle": "Chương II: Phương Pháp Đúc Kim Loại",
    "explanation": "Đúc trong khuôn kim loại đòi hỏi chi phí đầu tư khuôn ban đầu lớn nên phù hợp với dạng sản xuất hàng khối và hàng loạt lớn."
  },
  {
    "id": 109,
    "question": "Phương pháp đúc trong khuôn kim loại chỉ nên dùng cho vật liệu đúc là:",
    "options": [
      "Gang",
      "Thép",
      "Đồng",
      "Hợp kim có nhiệt độ nóng chảy thấp"
    ],
    "correctIndex": 3,
    "correctAnswer": "Hợp kim có nhiệt độ nóng chảy thấp",
    "correctAnswerLetter": "D",
    "chapterId": "ch2",
    "chapterTitle": "Chương II: Phương Pháp Đúc Kim Loại",
    "explanation": "Khuôn kim loại thường được làm bằng thép, do đó chỉ nên đúc các hợp kim có nhiệt độ nóng chảy thấp hơn khuôn (như nhôm, đồng, kẽm, magie) để đảm bảo tuổi thọ khuôn."
  },
  {
    "id": 110,
    "question": "Phương pháp đúc áp lực chỉ nên dùng cho vật liệu đúc là:",
    "options": [
      "Hợp kim có nhiệt độ nóng chảy thấp",
      "Đồng",
      "Thép",
      "Gang"
    ],
    "correctIndex": 0,
    "correctAnswer": "Hợp kim có nhiệt độ nóng chảy thấp",
    "correctAnswerLetter": "A",
    "chapterId": "ch2",
    "chapterTitle": "Chương II: Phương Pháp Đúc Kim Loại",
    "explanation": "Phương pháp đúc áp lực chỉ dùng cho hợp kim có nhiệt độ nóng chảy thấp (Al, Zn, Mg) để tránh làm hỏng buồng ép và lòng khuôn kim loại."
  },
  {
    "id": 111,
    "question": "Khuôn nào sau đây không cần lõi mà vẫn có thể tạo được lỗ trong vật đúc?",
    "options": [
      "Khuôn đúc kim loại",
      "Khuôn đúc áp lực",
      "Khuôn đúc ly tâm",
      "Khuôn vỏ mỏng"
    ],
    "correctIndex": 2,
    "correctAnswer": "Khuôn đúc ly tâm",
    "correctAnswerLetter": "C",
    "chapterId": "ch2",
    "chapterTitle": "Chương II: Phương Pháp Đúc Kim Loại",
    "explanation": "Đúc ly tâm sử dụng lực ly tâm ép kim loại lỏng sát vào thành khuôn đang quay tròn, tạo ra lỗ rỗng bên trong mà hoàn toàn không cần đặt lõi (ruột)."
  },
  {
    "id": 112,
    "question": "Mẫu sử dụng trong phương pháp đúc bằng mẫu chảy được làm bằng vật liệu?",
    "options": [
      "Sáp",
      "Kim loại",
      "Gỗ",
      "Thạch cao"
    ],
    "correctIndex": 0,
    "correctAnswer": "Sáp",
    "correctAnswerLetter": "A",
    "chapterId": "ch2",
    "chapterTitle": "Chương II: Phương Pháp Đúc Kim Loại",
    "explanation": "Phương pháp đúc bằng mẫu chảy (Investment Casting) sử dụng mẫu bằng sáp (paraffin/stearin) có nhiệt độ nóng chảy thấp để sấy chảy thoát ra khỏi khuôn."
  },
  {
    "id": 113,
    "question": "Khuôn được dùng cho đúc áp lực:",
    "options": [
      "Khuôn bằng xi măng",
      "Khuôn cát làm khuôn bằng tay",
      "Khuôn kim loại",
      "Khuôn cát làm khuôn bằng máy"
    ],
    "correctIndex": 2,
    "correctAnswer": "Khuôn kim loại",
    "correctAnswerLetter": "C",
    "chapterId": "ch2",
    "chapterTitle": "Chương II: Phương Pháp Đúc Kim Loại",
    "explanation": "Đúc áp lực sử dụng áp suất cơ khí đẩy kim loại vào khuôn, do đó bắt buộc phải sử dụng khuôn bằng kim loại (thép chịu nhiệt)."
  },
  {
    "id": 114,
    "question": "Chọn trường hợp đúng với khuôn mẫu chảy?",
    "options": [
      "Không phải tháo khuôn để lấy mẫu",
      "Sấy khuôn làm mẫu chảy loãng và tháo ra ngoài",
      "Các đáp án đưa ra đều đúng",
      "Vật liệu làm mẫu có nhiệt độ nóng chảy thấp"
    ],
    "correctIndex": 2,
    "correctAnswer": "Các đáp án đưa ra đều đúng",
    "correctAnswerLetter": "C",
    "chapterId": "ch2",
    "chapterTitle": "Chương II: Phương Pháp Đúc Kim Loại",
    "explanation": "Đúc mẫu chảy không cần mở khuôn để lấy mẫu: sau khi tạo khuôn gốm bao quanh mẫu sáp, người ta đem sấy nung để sáp chảy ra ngoài, để lại lòng khuôn nguyên vẹn."
  },
  {
    "id": 115,
    "question": "Để chế tạo ống gang có đường kính lớn nên sử dụng phương pháp nào sau đây:",
    "options": [
      "Kéo",
      "Ép",
      "Cán",
      "Đúc ly tâm"
    ],
    "correctIndex": 3,
    "correctAnswer": "Đúc ly tâm",
    "correctAnswerLetter": "D",
    "chapterId": "ch2",
    "chapterTitle": "Chương II: Phương Pháp Đúc Kim Loại",
    "explanation": "Để đúc các loại ống gang có đường kính lớn và dài, phương pháp tối ưu nhất là đúc ly tâm (cho thành dày đều, không rỗ khí, không cần dùng lõi dài phức tạp)."
  },
  {
    "id": 116,
    "question": "Phương pháp nào sau đây có thể đúc được các chi tiết có hình dáng phức tạp?",
    "options": [
      "Đúc trong khuôn vỏ mỏng",
      "Đúc trong khuôn kim loại",
      "Đúc trong khuôn cát",
      "Đúc áp lực"
    ],
    "correctIndex": 0,
    "correctAnswer": "Đúc trong khuôn vỏ mỏng",
    "correctAnswerLetter": "A",
    "chapterId": "ch2",
    "chapterTitle": "Chương II: Phương Pháp Đúc Kim Loại",
    "explanation": "Đúc trong khuôn vỏ mỏng (Shell Molding) sử dụng khuôn mỏng cứng vững, cho phép đúc được các chi tiết có hình dáng phức tạp với độ chính xác cao."
  },
  {
    "id": 117,
    "question": "Chọn phương pháp hợp lý để đúc ống gang dài 2 m đường kính 500 mm?",
    "options": [
      "Đúc trong khuôn kim loại",
      "Đúc ly tâm",
      "Đúc áp lực",
      "Đúc trong khuôn cát"
    ],
    "correctIndex": 1,
    "correctAnswer": "Đúc ly tâm",
    "correctAnswerLetter": "B",
    "chapterId": "ch2",
    "chapterTitle": "Chương II: Phương Pháp Đúc Kim Loại",
    "explanation": "Ống gang dài 2m đường kính 500mm là chi tiết dạng trụ rỗng dài, phương pháp hợp lý và tiết kiệm nhất là đúc ly tâm trục ngang."
  },
  {
    "id": 118,
    "question": "Khi vật liệu có tính thiên tích lớn không nên tiến hành đúc bằng phương pháp nào? sau đây?",
    "options": [
      "Đúc ly tâm",
      "Đúc áp lực",
      "Đúc trong khuôn kim loại",
      "Đúc trong khuôn cát"
    ],
    "correctIndex": 0,
    "correctAnswer": "Đúc ly tâm",
    "correctAnswerLetter": "A",
    "chapterId": "ch2",
    "chapterTitle": "Chương II: Phương Pháp Đúc Kim Loại",
    "explanation": "Khi hợp kim có tính thiên tích lớn (các nguyên tố có khối lượng riêng chênh lệch nhau nhiều), lực ly tâm sẽ tách các pha nặng ra ngoài và pha nhẹ vào trong gây mất đồng nhất, do đó không nên đúc ly tâm."
  },
  {
    "id": 119,
    "question": "Phương pháp đúc nào nên được lựa chọn để đúc các chi tiết rỗng có dạng tròn xoay mà không cần lõi?",
    "options": [
      "Đúc áp lực",
      "Đúc trong khuôn kim loại",
      "Đúc ly tâm",
      "Đúc trong khuôn vỏ mỏng"
    ],
    "correctIndex": 2,
    "correctAnswer": "Đúc ly tâm",
    "correctAnswerLetter": "C",
    "chapterId": "ch2",
    "chapterTitle": "Chương II: Phương Pháp Đúc Kim Loại",
    "explanation": "Đúc ly tâm là giải pháp hoàn hảo để chế tạo các chi tiết tròn xoay rỗng (ống nước, bạc lót, sơ mi xilanh) mà không cần chế tạo và định vị lõi."
  },
  {
    "id": 120,
    "question": "Một chi tiết bằng hợp kim đồng, có nhiều thành cánh mỏng thì nên đúc bằng thì nên chọn phương pháp đúc nào là tốt nhất?",
    "options": [
      "Đúc trong khuôn vỏ mỏng",
      "Đúc trong khuôn kim loại",
      "Đúc áp lực",
      "Đúc trong khuôn cát"
    ],
    "correctIndex": 2,
    "correctAnswer": "Đúc áp lực",
    "correctAnswerLetter": "C",
    "chapterId": "ch2",
    "chapterTitle": "Chương II: Phương Pháp Đúc Kim Loại",
    "explanation": "Chi tiết hợp kim đồng có thành và cánh mỏng cần dùng áp suất để điền đầy khuôn nhanh chóng trước khi đông đặc, do đó chọn đúc áp lực là tốt nhất."
  },
  {
    "id": 121,
    "question": "Một chi tiết bằng hợp nhôm, có nhiều thành cánh mỏng thì nên đúc bằng thì nên chọn phương pháp đúc nào là tốt nhất?",
    "options": [
      "Đúc trong khuôn vỏ mỏng",
      "Đúc trong khuôn kim loại",
      "Đúc ly tâm",
      "Đúc áp lực"
    ],
    "correctIndex": 3,
    "correctAnswer": "Đúc áp lực",
    "correctAnswerLetter": "D",
    "chapterId": "ch2",
    "chapterTitle": "Chương II: Phương Pháp Đúc Kim Loại",
    "explanation": "Chi tiết hợp kim nhôm có nhiều thành cánh mỏng đòi hỏi khả năng điền đầy cao dưới áp lực cơ học, đúc áp lực là phương pháp tối ưu nhất."
  },
  {
    "id": 122,
    "question": "Để chế tạo ra những sợ thép có có đường kính  F10mm, có chiều dài 6m thì nên chọn phương pháp gia công nào là tốt nhất?",
    "options": [
      "Kéo kim loại",
      "Cán kim loại",
      "Đúc liên tục",
      "Ép kim loại"
    ],
    "correctIndex": 2,
    "correctAnswer": "Đúc liên tục",
    "correctAnswerLetter": "C",
    "chapterId": "ch2",
    "chapterTitle": "Chương II: Phương Pháp Đúc Kim Loại",
    "explanation": "Để sản xuất sợi thép hoặc phôi dài liên tục F10mm dài 6m với năng suất cực cao trong luyện kim hiện đại, phương pháp tối ưu là đúc liên tục (Continuous Casting)."
  },
  {
    "id": 123,
    "question": "Đâu là khuyết tật của đúc?",
    "options": [
      "Cong vênh",
      "Các đáp án đưa ra đều đúng",
      "Rỗ khí, rỗ xỉ",
      "Lệch khuôn"
    ],
    "correctIndex": 1,
    "correctAnswer": "Các đáp án đưa ra đều đúng",
    "correctAnswerLetter": "B",
    "chapterId": "ch2",
    "chapterTitle": "Chương II: Phương Pháp Đúc Kim Loại",
    "explanation": "Các khuyết tật phổ biến của vật đúc bao gồm: rỗ khí, rỗ xỉ, nứt, cong vênh, lệch khuôn, thiếu hụt thể tích."
  },
  {
    "id": 124,
    "question": "Đâu là khuyết tật của đúc?",
    "options": [
      "Vật đúc không đầy đủ (bị khuyết)",
      "Các đáp án đưa ra đều đúng",
      "Ngậm xỉ",
      "Vật đúc bị nứt, sứt"
    ],
    "correctIndex": 1,
    "correctAnswer": "Các đáp án đưa ra đều đúng",
    "correctAnswerLetter": "B",
    "chapterId": "ch2",
    "chapterTitle": "Chương II: Phương Pháp Đúc Kim Loại",
    "explanation": "Các khuyết tật của vật đúc bao gồm: vật đúc không đầy đủ (chảy thiếu), ngậm xỉ, nứt nẻ, co ngót cục bộ."
  },
  {
    "id": 125,
    "question": "Chốt định vị giữa hai hòm khuôn có tác dụng gi?",
    "options": [
      "Để hai hòm khuôn không bị bung ra trong quá trình đúc",
      "Để hai lòng khuôn không bị lệch",
      "Để dẫn hướng cho quá trình lắp khuôn",
      "Để kẹp chặt hai nửa khuôn"
    ],
    "correctIndex": 1,
    "correctAnswer": "Để hai lòng khuôn không bị lệch",
    "correctAnswerLetter": "B",
    "chapterId": "ch2",
    "chapterTitle": "Chương II: Phương Pháp Đúc Kim Loại",
    "explanation": "Chốt định vị giữa hai nửa hòm khuôn (trên và dưới) có tác dụng định vị chính xác vị trí hai nửa khuôn, đảm bảo hai lòng khuôn không bị xê dịch lệch nhau."
  },
  {
    "id": 126,
    "question": "Thông thường, mục đích của gia công áp lực là gì?",
    "options": [
      "Tạo hình",
      "Tạo hình và tăng cơ tính",
      "Tăng cơ tính",
      "Làm biến dạng chi tiết"
    ],
    "correctIndex": 1,
    "correctAnswer": "Tạo hình và tăng cơ tính",
    "correctAnswerLetter": "B",
    "chapterId": "ch3",
    "chapterTitle": "Chương III: Phương Pháp Gia Công Kim Loại Bằng Áp Lực",
    "explanation": "Gia công áp lực là phương pháp dùng ngoại lực làm kim loại biến dạng dẻo để tạo hình dáng, kích thước mong muốn, đồng thời làm sít chặt kim loại, vỡ hạt và tạo thớ giúp nâng cao cơ tính sản phẩm."
  },
  {
    "id": 127,
    "question": "Trong quá trình gia công áp lực, kim loại trong khuôn ở trạng thái nào sau đây?",
    "options": [
      "Biến dạng đàn hồi",
      "Trạng thái nóng chảy",
      "Biến dạng dẻo",
      "Trạng thái phá hủy"
    ],
    "correctIndex": 2,
    "correctAnswer": "Biến dạng dẻo",
    "correctAnswerLetter": "C",
    "chapterId": "ch3",
    "chapterTitle": "Chương III: Phương Pháp Gia Công Kim Loại Bằng Áp Lực",
    "explanation": "Gia công áp lực yêu cầu kim loại phải đạt tới trạng thái biến dạng dẻo (vượt quá giới hạn đàn hồi nhưng không vượt quá giới hạn bền) để duy trì hình dạng mới sau khi thôi tác dụng lực."
  },
  {
    "id": 128,
    "question": "Đặc điểm nào sau đây của phương pháp gia công áp lực là có lợi nhất?",
    "options": [
      "Không bị ô xi hóa",
      "Dễ biến cứng",
      "Dễ nứt",
      "Độ chính xác không cao"
    ],
    "correctIndex": 1,
    "correctAnswer": "Dễ biến cứng",
    "correctAnswerLetter": "B",
    "chapterId": "ch3",
    "chapterTitle": "Chương III: Phương Pháp Gia Công Kim Loại Bằng Áp Lực",
    "explanation": "Hiện tượng biến cứng (tăng độ bền, độ cứng sau khi biến dạng dẻo ở trạng thái nguội) là đặc điểm có lợi nhất, giúp chi tiết sau gia công áp lực có độ bền vượt trội."
  },
  {
    "id": 129,
    "question": "Đâu không phải là những ưu điểm của phương pháp gia công áp lực?",
    "options": [
      "Nâng cao cơ tính của chi tiết máy",
      "Khử được những khuyết tật như rỗ khí, rỗ co",
      "Nâng cao tuổi bền của chi tiết máy",
      "Khử được ứng suất dư trong chi tiết máy"
    ],
    "correctIndex": 3,
    "correctAnswer": "Khử được ứng suất dư trong chi tiết máy",
    "correctAnswerLetter": "D",
    "chapterId": "ch3",
    "chapterTitle": "Chương III: Phương Pháp Gia Công Kim Loại Bằng Áp Lực",
    "explanation": "Gia công áp lực không khử được ứng suất dư mà thường sinh thêm ứng suất dư do biến dạng không đều (sau gia công thường phải ủ để khử ứng suất dư)."
  },
  {
    "id": 130,
    "question": "Đặc điểm nào sau đây không đúng với phương pháp gia công áp lực?",
    "options": [
      "Gia công được cả vật liệu dẻo và vật liệu giòn",
      "Không gia công được sản phẩm có hình dáng phức tạp",
      "Chỉ gia công được vật liệu có tính dẻo",
      "Sản phẩm có cơ tính tốt hơn so với phương pháp đúc"
    ],
    "correctIndex": 0,
    "correctAnswer": "Gia công được cả vật liệu dẻo và vật liệu giòn",
    "correctAnswerLetter": "A",
    "chapterId": "ch3",
    "chapterTitle": "Chương III: Phương Pháp Gia Công Kim Loại Bằng Áp Lực",
    "explanation": "Gia công áp lực chỉ thực hiện được với vật liệu có tính dẻo (thép, đồng, nhôm...). Vật liệu giòn (như gang) không thể biến dạng dẻo mà sẽ bị nứt, vỡ vụn ngay."
  },
  {
    "id": 131,
    "question": "Phương pháp gia công áp lực làm thay đổi tính chất nào?",
    "options": [
      "Khối lượng riêng",
      "Thành phần hóa học",
      "Cơ tính",
      "Nhiệt độ nóng chảy"
    ],
    "correctIndex": 2,
    "correctAnswer": "Cơ tính",
    "correctAnswerLetter": "C",
    "chapterId": "ch3",
    "chapterTitle": "Chương III: Phương Pháp Gia Công Kim Loại Bằng Áp Lực",
    "explanation": "Biến dạng dẻo làm vỡ nhỏ các hạt tinh thể và định hướng thớ kim loại, từ đó làm thay đổi rõ rệt cơ tính (tăng độ bền, độ cứng) trong khi thành phần hóa học không đổi."
  },
  {
    "id": 132,
    "question": "Để cán, người người ta lợi dụng tính chất nào của kim loại?",
    "options": [
      "Độ dẻo",
      "Đàn hồi",
      "Độ dai va chạm",
      "Độ co"
    ],
    "correctIndex": 0,
    "correctAnswer": "Độ dẻo",
    "correctAnswerLetter": "A",
    "chapterId": "ch3",
    "chapterTitle": "Chương III: Phương Pháp Gia Công Kim Loại Bằng Áp Lực",
    "explanation": "Quá trình cán kim loại dựa trên tính biến dạng dẻo của kim loại dưới tác dụng của lực ép từ các trục cán quay ngược chiều nhau."
  },
  {
    "id": 133,
    "question": "Phương pháp cán kim loại phù hợp với dạng sản xuất nào?",
    "options": [
      "Sản xuất đơn chiếc",
      "Sản xuất hàng khối và sản xuất hàng loạt lớn",
      "Sản xuất hàng loạt nhỏ và sản xuất đơn chiếc",
      "Sản xuất hàng loạt lớn và sản xuất hàng loạt nhỏ"
    ],
    "correctIndex": 1,
    "correctAnswer": "Sản xuất hàng khối và sản xuất hàng loạt lớn",
    "correctAnswerLetter": "B",
    "chapterId": "ch3",
    "chapterTitle": "Chương III: Phương Pháp Gia Công Kim Loại Bằng Áp Lực",
    "explanation": "Máy cán và trục cán có chi phí đầu tư rất lớn, năng suất làm việc cực cao nên chỉ phù hợp và mang lại hiệu quả kinh tế trong sản xuất hàng loạt lớn và hàng khối."
  },
  {
    "id": 134,
    "question": "Khi gia công một ống thép có đường kính 0,2m, chiều dài 6m thì nên sử dụng phương pháp nào?",
    "options": [
      "Đúc ly tâm",
      "Ép kim loại",
      "Cán",
      "Rèn tự do"
    ],
    "correctIndex": 2,
    "correctAnswer": "Cán",
    "correctAnswerLetter": "C",
    "chapterId": "ch3",
    "chapterTitle": "Chương III: Phương Pháp Gia Công Kim Loại Bằng Áp Lực",
    "explanation": "Phương pháp cán ống không mối hàn (cán xuyên lỗ phôi tròn rồi cán thon/cán định cỡ) là phương pháp tối ưu và phổ biến nhất để chế tạo ống thép dài 6m, đường kính 200mm."
  },
  {
    "id": 135,
    "question": "Phương pháp gia công nào cho sản phẩm dạng tấm?",
    "options": [
      "Kéo",
      "Cán",
      "Rèn tự do",
      "Dập thể tích"
    ],
    "correctIndex": 1,
    "correctAnswer": "Cán",
    "correctAnswerLetter": "B",
    "chapterId": "ch3",
    "chapterTitle": "Chương III: Phương Pháp Gia Công Kim Loại Bằng Áp Lực",
    "explanation": "Cán tấm (cán nóng, cán nguội qua các trục cán phẳng) là phương pháp chủ yếu và duy nhất chuyên dùng để sản xuất phôi dạng tấm, dải, lá kim loại."
  },
  {
    "id": 136,
    "question": "Để chế tạo ống thép hợp kim có đường kính lớn nên sử dụng phương pháp nào sau đây?",
    "options": [
      "Kéo",
      "Ép",
      "Đúc ly tâm",
      "Cán"
    ],
    "correctIndex": 3,
    "correctAnswer": "Cán",
    "correctAnswerLetter": "D",
    "chapterId": "ch3",
    "chapterTitle": "Chương III: Phương Pháp Gia Công Kim Loại Bằng Áp Lực",
    "explanation": "Để sản xuất ống thép hợp kim đường kính lớn, phương pháp cán ống (hoặc cán uốn tấm rồi hàn) là phương pháp chủ đạo trong công nghiệp chế tạo ống."
  },
  {
    "id": 137,
    "question": "Trong các phương pháp gia công kim loại, phương pháp nào cho tổ chức dạng thớ?",
    "options": [
      "Đúc",
      "Cán",
      "Cắt kim loại bằng khí",
      "Hàn"
    ],
    "correctIndex": 1,
    "correctAnswer": "Cán",
    "correctAnswerLetter": "B",
    "chapterId": "ch3",
    "chapterTitle": "Chương III: Phương Pháp Gia Công Kim Loại Bằng Áp Lực",
    "explanation": "Trong quá trình cán, kim loại bị kéo dài theo hướng cán, làm các hạt tinh thể và tạp chất bị kéo dài tạo thành tổ chức thớ uốn lượn liên tục dọc theo hướng cán."
  },
  {
    "id": 138,
    "question": "Chọn phương pháp gia công thích hợp để tạo phôi từ thép thanh tròn đường kính 50, chiều dài 500 thành thép thanh vuông mà không hao tổn vật liệu?",
    "options": [
      "Rèn khuôn",
      "Phay",
      "Cán",
      "Đúc"
    ],
    "correctIndex": 2,
    "correctAnswer": "Cán",
    "correctAnswerLetter": "C",
    "chapterId": "ch3",
    "chapterTitle": "Chương III: Phương Pháp Gia Công Kim Loại Bằng Áp Lực",
    "explanation": "Cán qua lỗ hình vuông sẽ biến đổi tiết diện từ tròn sang vuông dọc theo chiều dài thanh mà không làm sinh phoi vụn hao tổn vật liệu như phương pháp gia công cắt gọt (phay)."
  },
  {
    "id": 139,
    "question": "Phương pháp ép kim loại phù hợp để gia công vật liệu nào sau đây?",
    "options": [
      "Gang",
      "Hợp kim màu",
      "Thép hợp kim cứng",
      "Hợp kim cứng"
    ],
    "correctIndex": 1,
    "correctAnswer": "Hợp kim màu",
    "correctAnswerLetter": "B",
    "chapterId": "ch3",
    "chapterTitle": "Chương III: Phương Pháp Gia Công Kim Loại Bằng Áp Lực",
    "explanation": "Phương pháp ép chảy (extrusion) đặc biệt phù hợp và ứng dụng rộng rãi nhất cho kim loại và hợp kim màu (nhôm, đồng) nhờ độ dẻo cao và nhiệt độ gia công vừa phải."
  },
  {
    "id": 140,
    "question": "Phương pháp ép kim loại phù hợp với dạng sản xuất nào?",
    "options": [
      "Sản xuất đơn chiếc",
      "Sản xuất hàng loạt nhỏ và sản xuất đơn chiếc",
      "Sản xuất hàng khối và sản xuất hàng loạt lớn",
      "Sản xuất hàng loạt lớn và sản xuất hàng loạt nhỏ"
    ],
    "correctIndex": 2,
    "correctAnswer": "Sản xuất hàng khối và sản xuất hàng loạt lớn",
    "correctAnswerLetter": "C",
    "chapterId": "ch3",
    "chapterTitle": "Chương III: Phương Pháp Gia Công Kim Loại Bằng Áp Lực",
    "explanation": "Hệ thống máy ép thủy lực và khuôn ép chuyên dùng có chi phí chế tạo lớn, chỉ phát huy hiệu quả kinh tế trong sản xuất hàng loạt lớn và hàng khối."
  },
  {
    "id": 141,
    "question": "Chọn phương pháp gia công phù hợp để chế tạo một sợi nhôm dài có đường kính 10mm?",
    "options": [
      "Cán",
      "Kéo",
      "Đúc áp lực",
      "Ép"
    ],
    "correctIndex": 3,
    "correctAnswer": "Ép",
    "correctAnswerLetter": "D",
    "chapterId": "ch3",
    "chapterTitle": "Chương III: Phương Pháp Gia Công Kim Loại Bằng Áp Lực",
    "explanation": "Phương pháp ép chảy (extrusion) từ thỏi nhôm qua lỗ khuôn tròn là phương pháp năng suất cao và chính xác nhất để tạo các thanh tròn, sợi nhôm đường kính 10mm."
  },
  {
    "id": 142,
    "question": "Đâu không phải là đặc điểm của phương pháp ép kim loại?",
    "options": [
      "Tạo hình được nhiều loại thanh định hình, có năng suất cao",
      "Có thể ép được nhiều loại vật liệu khác nhau",
      "Độ chính xác và nhẵn bóng cao, nâng cao tính dẻo của sản phẩm",
      "Kết cấu phức tạp, khuôn cần có tính chống mòn cao"
    ],
    "correctIndex": 1,
    "correctAnswer": "Có thể ép được nhiều loại vật liệu khác nhau",
    "correctAnswerLetter": "B",
    "chapterId": "ch3",
    "chapterTitle": "Chương III: Phương Pháp Gia Công Kim Loại Bằng Áp Lực",
    "explanation": "Ép kim loại tạo ra áp lực ma sát và ứng suất rất lớn lên khuôn, chỉ áp dụng tốt cho các vật liệu dẻo (nhôm, đồng, một số hợp kim dẻo), không thể ép tùy tiện nhiều loại vật liệu khác nhau."
  },
  {
    "id": 143,
    "question": "Để chế tạo các thanh hợp kim nhôm định hình tiết diện cắt ngang 20 mm x 20 mm nên sử dụng phương pháp nào sau đây?",
    "options": [
      "Cán",
      "Kéo",
      "Ép",
      "Đúc áp lực"
    ],
    "correctIndex": 2,
    "correctAnswer": "Ép",
    "correctAnswerLetter": "C",
    "chapterId": "ch3",
    "chapterTitle": "Chương III: Phương Pháp Gia Công Kim Loại Bằng Áp Lực",
    "explanation": "Thanh nhôm định hình (profile nhôm) có tiết diện phức tạp hoặc vuông nhỏ 20x20mm chủ yếu được sản xuất bằng phương pháp ép chảy qua khuôn định hình."
  },
  {
    "id": 144,
    "question": "Đặc điểm nào sau đây không đúng với phương pháp dập khuôn?",
    "options": [
      "Dùng trong sản xuất hàng loạt và hàng khối",
      "Có thể tạo sản phẩm có hình dạng phức tạp",
      "Chất lượng sản phẩm cao, đồng đều",
      "Độ chính xác và chất lượng bề mặt không cao"
    ],
    "correctIndex": 3,
    "correctAnswer": "Độ chính xác và chất lượng bề mặt không cao",
    "correctAnswerLetter": "D",
    "chapterId": "ch3",
    "chapterTitle": "Chương III: Phương Pháp Gia Công Kim Loại Bằng Áp Lực",
    "explanation": "Dập khuôn (dập thể tích) cho sản phẩm có độ chính xác kích thước và độ nhẵn bóng bề mặt cao hơn rất nhiều so với rèn tự do, nên nhận định 'độ chính xác không cao' là sai."
  },
  {
    "id": 145,
    "question": "Đâu không phải là đặc điểm của phương pháp dập khuôn?",
    "options": [
      "Độ chính xác và độ bóng bề mặt phôi cao",
      "Chất lượng các phần chi tiết không đồng đều, phụ thuộc vào tay nghề công nhân",
      "Có thể tạo phôi có hình dạng phức tạp",
      "Năng suất cao, dễ cơ khí hóa và tự động hóa"
    ],
    "correctIndex": 1,
    "correctAnswer": "Chất lượng các phần chi tiết không đồng đều, phụ thuộc vào tay nghề công nhân",
    "correctAnswerLetter": "B",
    "chapterId": "ch3",
    "chapterTitle": "Chương III: Phương Pháp Gia Công Kim Loại Bằng Áp Lực",
    "explanation": "Trong dập khuôn, lòng khuôn quyết định chính xác hình dáng kích thước sản phẩm và máy ép thực hiện tự động, do đó chất lượng rất đồng đều, ít phụ thuộc tay nghề công nhân."
  },
  {
    "id": 146,
    "question": "Phương pháp dập khuôn thường qua các nguyên công nào?",
    "options": [
      "Dập thô, dập tinh",
      "Dập định hình, dập lần cuối",
      "Dập sơ bộ, dập bán tinh, dập tinh",
      "Tạo hình sản phẩm thông qua một lần dập"
    ],
    "correctIndex": 2,
    "correctAnswer": "Dập sơ bộ, dập bán tinh, dập tinh",
    "correctAnswerLetter": "C",
    "chapterId": "ch3",
    "chapterTitle": "Chương III: Phương Pháp Gia Công Kim Loại Bằng Áp Lực",
    "explanation": "Quy trình dập khuôn nhiều bước gồm các lòng khuôn: dập sơ bộ (chuẩn bị phôi), dập bán tinh (tạo hình dáng sơ bộ), và dập tinh (hoàn thiện kích thước chính xác)."
  },
  {
    "id": 147,
    "question": "Phương pháp dập khuôn phù hợp với dạng sản xuất nào?",
    "options": [
      "Sản xuất đơn chiếc",
      "Sản xuất hàng loạt nhỏ và sản xuất đơn chiếc",
      "Sản xuất hàng khối và sản xuất hàng loạt lớn",
      "Sản xuất hàng loạt lớn và sản xuất hàng loạt nhỏ"
    ],
    "correctIndex": 2,
    "correctAnswer": "Sản xuất hàng khối và sản xuất hàng loạt lớn",
    "correctAnswerLetter": "C",
    "chapterId": "ch3",
    "chapterTitle": "Chương III: Phương Pháp Gia Công Kim Loại Bằng Áp Lực",
    "explanation": "Bộ khuôn dập thể tích gia công rất đắt tiền và chế tạo phức tạp, chỉ đem lại hiệu quả kinh tế khi số lượng sản phẩm lớn (hàng loạt lớn và hàng khối)."
  },
  {
    "id": 148,
    "question": "Phương pháp dập tấm phù hợp với dạng sản xuất nào nhất?",
    "options": [
      "Sản xuất đơn chiếc",
      "Sản xuất hàng khối và sản xuất hàng loạt lớn",
      "Sản xuất hàng loạt nhỏ và sản xuất đơn chiếc",
      "Sản xuất hàng loạt lớn và sản xuất hàng loạt nhỏ"
    ],
    "correctIndex": 1,
    "correctAnswer": "Sản xuất hàng khối và sản xuất hàng loạt lớn",
    "correctAnswerLetter": "B",
    "chapterId": "ch3",
    "chapterTitle": "Chương III: Phương Pháp Gia Công Kim Loại Bằng Áp Lực",
    "explanation": "Khuôn dập tấm (chày, cối) và máy dập tốc độ cao có năng suất cực lớn, phù hợp và hiệu quả nhất trong sản xuất hàng khối và hàng loạt lớn."
  },
  {
    "id": 149,
    "question": "Đâu không phải là đặc điểm của phương pháp dập tấm?",
    "options": [
      "Chất lượng sản phẩm không ổn định",
      "Năng suất cao",
      "Dễ tự động hóa",
      "Dễ vận hành"
    ],
    "correctIndex": 0,
    "correctAnswer": "Chất lượng sản phẩm không ổn định",
    "correctAnswerLetter": "A",
    "chapterId": "ch3",
    "chapterTitle": "Chương III: Phương Pháp Gia Công Kim Loại Bằng Áp Lực",
    "explanation": "Dập tấm cho sản phẩm có độ đồng đều kích thước rất cao, bề mặt nhẵn bóng và chất lượng vô cùng ổn định giữa các sản phẩm."
  },
  {
    "id": 150,
    "question": "Khẳng định nào dưới đây mô tả các nhóm nguyên công của phương pháp dập tấm?",
    "options": [
      "Cắt đứt, dập sơ bộ, dập tinh",
      "Cắt đứt, dập tạo hình",
      "Cắt đứt, dập thô, dập tinh",
      "Cắt đứt, dập sơ bộ, dập tạo hình"
    ],
    "correctIndex": 1,
    "correctAnswer": "Cắt đứt, dập tạo hình",
    "correctAnswerLetter": "B",
    "chapterId": "ch3",
    "chapterTitle": "Chương III: Phương Pháp Gia Công Kim Loại Bằng Áp Lực",
    "explanation": "Các nguyên công dập tấm được chia thành hai nhóm chính: nhóm nguyên công cắt đứt (cắt phôi, đột lỗ) và nhóm nguyên công dập tạo hình (uốn, vuốt, dập nổi, tóp mép)."
  },
  {
    "id": 151,
    "question": "Phương pháp dập tấm thường ứng dụng phổ biến trong ngành công nghiệp nào?",
    "options": [
      "Chế tạo bồn bể",
      "Sản xuất thân vỏ ô tô",
      "Chế tạo đường ống",
      "Công nghiệp chế tạo khung vỏ xe máy"
    ],
    "correctIndex": 1,
    "correctAnswer": "Sản xuất thân vỏ ô tô",
    "correctAnswerLetter": "B",
    "chapterId": "ch3",
    "chapterTitle": "Chương III: Phương Pháp Gia Công Kim Loại Bằng Áp Lực",
    "explanation": "Ngành công nghiệp ô tô là lĩnh vực ứng dụng dập tấm lớn nhất (chế tạo nắp capo, cánh cửa, nóc xe, các tấm ốp thân vỏ ngoài xe ô tô)."
  },
  {
    "id": 152,
    "question": "Trong các phương pháp gia công kim loại sau, phương pháp nào tạo được tính chất dạng thớ?",
    "options": [
      "Đúc",
      "Hàn",
      "Dập khuôn",
      "Nhiệt luyện"
    ],
    "correctIndex": 2,
    "correctAnswer": "Dập khuôn",
    "correctAnswerLetter": "C",
    "chapterId": "ch3",
    "chapterTitle": "Chương III: Phương Pháp Gia Công Kim Loại Bằng Áp Lực",
    "explanation": "Dập khuôn (gia công áp lực) làm kim loại biến dạng dẻo trong lòng khuôn kín, các hạt tinh thể và tạp chất bị uốn lượn theo biên dạng chi tiết tạo thành tổ chức thớ liên tục, nâng cao khả năng chịu tải."
  },
  {
    "id": 153,
    "question": "Phương pháp gia công áp lực nào sau đây là gia công nguội?",
    "options": [
      "Dập thể tích",
      "Ép kim loại",
      "Rèn tự do",
      "Dập cắt nóng"
    ],
    "correctIndex": 1,
    "correctAnswer": "Ép kim loại",
    "correctAnswerLetter": "B",
    "chapterId": "ch3",
    "chapterTitle": "Chương III: Phương Pháp Gia Công Kim Loại Bằng Áp Lực",
    "explanation": "Theo phân loại bài học, ép kim loại (ép chảy nguội - cold extrusion các hợp kim dẻo như nhôm, đồng) được tiến hành ở nhiệt độ môi trường, dưới nhiệt độ kết tinh lại."
  },
  {
    "id": 154,
    "question": "Đặc điểm nào sau đây không đúng với phương pháp rèn tự do?",
    "options": [
      "Chất lượng sản phẩm phụ thuộc vào tay nghề của công nhân",
      "Thiết bị và dụng cụ rèn tự do đơn giản",
      "Chất lượng và tính chất kim loại từng phần của chi tiết đồng đều",
      "Độ chính xác, độ bóng bề mặt chi tiết không cao, năng suất thấp"
    ],
    "correctIndex": 2,
    "correctAnswer": "Chất lượng và tính chất kim loại từng phần của chi tiết đồng đều",
    "correctAnswerLetter": "C",
    "chapterId": "ch3",
    "chapterTitle": "Chương III: Phương Pháp Gia Công Kim Loại Bằng Áp Lực",
    "explanation": "Trong rèn tự do, mức độ biến dạng ở từng vị trí trên phôi là khác nhau nên tổ chức hạt và tính chất cơ học không đồng đều giữa các phần của chi tiết."
  },
  {
    "id": 155,
    "question": "Nguyên công chồn dùng để:",
    "options": [
      "Tăng chiều ngang, giảm chiều cao",
      "Tăng chiều cao, giảm chiều ngang",
      "Tăng chiều dài, giảm chiều rộng",
      "Tăng chiều rộng, giảm chiều dài"
    ],
    "correctIndex": 0,
    "correctAnswer": "Tăng chiều ngang, giảm chiều cao",
    "correctAnswerLetter": "A",
    "chapterId": "ch3",
    "chapterTitle": "Chương III: Phương Pháp Gia Công Kim Loại Bằng Áp Lực",
    "explanation": "Chồn (upsetting) là nguyên công làm giảm chiều cao của phôi dưới tác dụng của tải trọng ép dọc trục nhằm làm tăng diện tích tiết diện ngang (chiều ngang/đường kính)."
  },
  {
    "id": 156,
    "question": "Nguyên công vuốt phẳng dùng để:",
    "options": [
      "Tăng chiều rộng, giảm chiều dài",
      "Tăng chiều dài, giảm chiều cao",
      "Tăng chiều dài, giảm chiều rộng",
      "Tăng chiều rộng, giảm chiều dài"
    ],
    "correctIndex": 1,
    "correctAnswer": "Tăng chiều dài, giảm chiều cao",
    "correctAnswerLetter": "B",
    "chapterId": "ch3",
    "chapterTitle": "Chương III: Phương Pháp Gia Công Kim Loại Bằng Áp Lực",
    "explanation": "Vuốt (drawing out) là nguyên công rèn làm tăng chiều dài phôi và giảm diện tích tiết diện ngang (giảm chiều cao, chiều dày phôi)."
  },
  {
    "id": 157,
    "question": "Phương pháp rèn tự do phù hợp với dạng sản xuất nào?",
    "options": [
      "Sản xuất hàng loạt nhỏ và loạt lớn",
      "Sản xuất hàng loạt lớn và hàng khối",
      "Sản xuất đơn chiếc và loạt nhỏ",
      "Sản xuất hàng khối"
    ],
    "correctIndex": 2,
    "correctAnswer": "Sản xuất đơn chiếc và loạt nhỏ",
    "correctAnswerLetter": "C",
    "chapterId": "ch3",
    "chapterTitle": "Chương III: Phương Pháp Gia Công Kim Loại Bằng Áp Lực",
    "explanation": "Rèn tự do có trang thiết bị đơn giản, năng suất thấp nhưng linh hoạt cao, không tốn tiền khuôn nên thích hợp nhất cho dạng sản xuất đơn chiếc và hàng loạt nhỏ."
  },
  {
    "id": 158,
    "question": "Chọn phương pháp gia công để tăng đường kính ống thép Φ200, L = 500 mà không hao phí vật liệu?",
    "options": [
      "Tiện",
      "Kéo",
      "Rèn tự do",
      "Rèn khuôn"
    ],
    "correctIndex": 2,
    "correctAnswer": "Rèn tự do",
    "correctAnswerLetter": "C",
    "chapterId": "ch3",
    "chapterTitle": "Chương III: Phương Pháp Gia Công Kim Loại Bằng Áp Lực",
    "explanation": "Rèn tự do sử dụng nguyên công nong lỗ/nong ống (lồng ống lên trục đe rồi rèn xung quanh) làm mỏng thành ống và tăng đường kính ống mà không làm phoi vụn hao tổn kim loại."
  },
  {
    "id": 159,
    "question": "Những dụng cụ đo như dưỡng, thước lá, compa thường dùng trong quá trình gia công của phương pháp nào?",
    "options": [
      "Dập khuôn",
      "Rèn tự do",
      "Dập tấm",
      "Cán kim loại"
    ],
    "correctIndex": 1,
    "correctAnswer": "Rèn tự do",
    "correctAnswerLetter": "B",
    "chapterId": "ch3",
    "chapterTitle": "Chương III: Phương Pháp Gia Công Kim Loại Bằng Áp Lực",
    "explanation": "Do không có lòng khuôn định hình cố định, thợ rèn tự do phải liên tục sử dụng các dụng cụ đo thủ công như dưỡng, thước lá, compa để kiểm tra kích thước phôi rèn."
  },
  {
    "id": 160,
    "question": "Phương pháp gia công nào chất lượng sản phẩm phụ thuộc nhiều vào tay nghề công nhân?",
    "options": [
      "Dập khuôn",
      "Dập tấm",
      "Ép kim loại",
      "Rèn tự do"
    ],
    "correctIndex": 3,
    "correctAnswer": "Rèn tự do",
    "correctAnswerLetter": "D",
    "chapterId": "ch3",
    "chapterTitle": "Chương III: Phương Pháp Gia Công Kim Loại Bằng Áp Lực",
    "explanation": "Rèn tự do không có khuôn khống chế hình dạng, mọi thao tác vung búa, xoay lật phôi đều do công nhân điều khiển nên chất lượng phụ thuộc hoàn toàn vào tay nghề thợ."
  },
  {
    "id": 161,
    "question": "Những dụng cụ công nghệ cơ bản như các loại đe, búa, bàn là, bàn tóp, sấn, chặt, mũi đột thường dùng trong phương pháp gia công nào?",
    "options": [
      "Dập khuôn",
      "Dập tấm",
      "Ép kim loại",
      "Rèn tự do"
    ],
    "correctIndex": 3,
    "correctAnswer": "Rèn tự do",
    "correctAnswerLetter": "D",
    "chapterId": "ch3",
    "chapterTitle": "Chương III: Phương Pháp Gia Công Kim Loại Bằng Áp Lực",
    "explanation": "Đe, búa, bàn là phẳng, bàn tóp, dao xấn, dao chặt, mũi đột là bộ trang bị dụng cụ gia công truyền thống của phương pháp rèn tự do."
  },
  {
    "id": 162,
    "question": "Phương pháp gia công nào chuẩn bị gia công đơn giản nhất?",
    "options": [
      "Dập khuôn",
      "Dập tấm",
      "Rèn tự do",
      "Ép kim loại"
    ],
    "correctIndex": 2,
    "correctAnswer": "Rèn tự do",
    "correctAnswerLetter": "C",
    "chapterId": "ch3",
    "chapterTitle": "Chương III: Phương Pháp Gia Công Kim Loại Bằng Áp Lực",
    "explanation": "Rèn tự do chỉ sử dụng các công cụ vạn năng sẵn có (lò nung, búa, đe), không mất thời gian và chi phí thiết kế, gia công lòng khuôn đắt tiền nên chuẩn bị sản xuất đơn giản nhất."
  },
  {
    "id": 163,
    "question": "Phương pháp gia công nào phù hợp với sản xuất đơn chiếc?",
    "options": [
      "Dập khuôn",
      "Rèn tự do",
      "Dập tấm",
      "Ép kim loại"
    ],
    "correctIndex": 1,
    "correctAnswer": "Rèn tự do",
    "correctAnswerLetter": "B",
    "chapterId": "ch3",
    "chapterTitle": "Chương III: Phương Pháp Gia Công Kim Loại Bằng Áp Lực",
    "explanation": "Rèn tự do có tính linh hoạt cao, chế tạo được phôi có kích thước lớn với số lượng ít mà không cần chế tạo khuôn mẫu đắt đỏ."
  },
  {
    "id": 164,
    "question": "Trong các phương pháp gia công sau, phương pháp gia công nào sản phẩm có độ chính xác, độ bóng bề mặt chi tiết không cao, năng suất thấp nhất?",
    "options": [
      "Dập khuôn",
      "Dập tấm",
      "Ép kim loại",
      "Rèn tự do"
    ],
    "correctIndex": 3,
    "correctAnswer": "Rèn tự do",
    "correctAnswerLetter": "D",
    "chapterId": "ch3",
    "chapterTitle": "Chương III: Phương Pháp Gia Công Kim Loại Bằng Áp Lực",
    "explanation": "Rèn tự do thao tác thủ công, phôi nung bị oxy hóa tạo vảy và không có lòng khuôn khống chế nên độ chính xác, độ bóng bề mặt và năng suất đều thấp nhất."
  },
  {
    "id": 165,
    "question": "Trong gia công nóng, phôi được gia nhiệt đến nhiệt độ nào?",
    "options": [
      "Gần bằng nhiệt độ nóng chảy",
      "Lớn hơn nhiệt độ kết tinh lại",
      "Nhỏ hơn nhiệt độ kết tinh lại",
      "Bằng nhiệt độ kết tinh lại"
    ],
    "correctIndex": 1,
    "correctAnswer": "Lớn hơn nhiệt độ kết tinh lại",
    "correctAnswerLetter": "B",
    "chapterId": "ch3",
    "chapterTitle": "Chương III: Phương Pháp Gia Công Kim Loại Bằng Áp Lực",
    "explanation": "Gia công áp lực nóng là quá trình biến dạng dẻo được thực hiện ở nhiệt độ cao hơn nhiệt độ kết tinh lại của kim loại (T > T_ktl), giúp kim loại liên tục kết tinh lại, triệt tiêu biến cứng và duy trì độ dẻo cao."
  },
  {
    "id": 166,
    "question": "Vị trí không gian của mối hàn nào sau đây gọi là hàn trần?",
    "options": [
      "Góc nghiêng tầm hàn so với mặt phẳng φ=120-180º, que hàn nằm dưới , tấm hàn nằm trên",
      "Góc nghiêng tầm hàn so với mặt phẳng φ=110-180º, que hàn nằm dưới , tấm hàn nằm trên",
      "Góc nghiêng tầm hàn so với mặt phẳng φ=100-160º, que hàn nằm dưới , tấm hàn nằm trên",
      "Góc nghiêng tầm hàn so với mặt phẳng φ=120-160º, que hàn nằm dưới , tấm hàn nằm trên"
    ],
    "correctIndex": 0,
    "correctAnswer": "Góc nghiêng tầm hàn so với mặt phẳng φ=120-180º, que hàn nằm dưới , tấm hàn nằm trên",
    "correctAnswerLetter": "A",
    "chapterId": "ch4",
    "chapterTitle": "Chương IV: Phương Pháp Hàn Kim Loại",
    "explanation": "Hàn trần (hàn ngửa) là vị trí hàn khó nhất, góc nghiêng so với mặt phẳng nằm ngang φ = 120º - 180º, que hàn nằm bên dưới hướng lên tấm hàn nằm phía trên."
  },
  {
    "id": 167,
    "question": "Đặc điểm nào sau đây không đúng với phương pháp hàn?",
    "options": [
      "Tiết kiệm kim loại so với các phương pháp khác",
      "Tốn nhiều vật liệu so với phương pháp khác",
      "Tiết kiệm chi phí hơn so với các phương pháp khác",
      "Chế tạo được các kết cấu phức tạp mà các phương pháp khác không làm được"
    ],
    "correctIndex": 1,
    "correctAnswer": "Tốn nhiều vật liệu so với phương pháp khác",
    "correctAnswerLetter": "B",
    "chapterId": "ch4",
    "chapterTitle": "Chương IV: Phương Pháp Hàn Kim Loại",
    "explanation": "Hàn là phương pháp nối liền kim loại không thể tháo rời, giúp tiết kiệm 10 - 25% khối lượng kim loại so với tán đinh hoặc đúc/gia công cơ. Nhận định 'tốn nhiều vật liệu' là không đúng."
  },
  {
    "id": 168,
    "question": "Các phương pháp hàn được phân loại thành mấy nhóm chính?",
    "options": [
      "3",
      "4",
      "2",
      "5"
    ],
    "correctIndex": 2,
    "correctAnswer": "2",
    "correctAnswerLetter": "C",
    "chapterId": "ch4",
    "chapterTitle": "Chương IV: Phương Pháp Hàn Kim Loại",
    "explanation": "Các phương pháp hàn được phân loại thành 2 nhóm chính: Nhóm hàn nóng chảy (fusion welding) và nhóm hàn áp lực (pressure welding)."
  },
  {
    "id": 169,
    "question": "Phương pháp nào sau đây thuộc nhóm phương pháp hàn nóng chảy?",
    "options": [
      "Hàn hồ quang",
      "Hàn điện tiếp xúc",
      "Hàn ma sát",
      "Hàn siêu âm"
    ],
    "correctIndex": 0,
    "correctAnswer": "Hàn hồ quang",
    "correctAnswerLetter": "A",
    "chapterId": "ch4",
    "chapterTitle": "Chương IV: Phương Pháp Hàn Kim Loại",
    "explanation": "Hàn hồ quang sử dụng nhiệt lượng của hồ quang điện đốt nóng chảy kim loại vật hàn và que hàn tại vũng hàn, thuộc nhóm hàn nóng chảy. Hàn tiếp xúc, ma sát, siêu âm thuộc nhóm hàn áp lực."
  },
  {
    "id": 170,
    "question": "Phương pháp nào sau đây thuộc nhóm phương pháp hàn áp lực?",
    "options": [
      "Hàn hồ quang",
      "Hàn điện tiếp xúc",
      "Hàn khí",
      "Hàn điện xỉ"
    ],
    "correctIndex": 1,
    "correctAnswer": "Hàn điện tiếp xúc",
    "correctAnswerLetter": "B",
    "chapterId": "ch4",
    "chapterTitle": "Chương IV: Phương Pháp Hàn Kim Loại",
    "explanation": "Hàn điện tiếp xúc (tiếp xúc điểm, tiếp xúc đường, tiếp xúc giáp mối) sử dụng nhiệt điện trở kết hợp với lực ép cơ học để ép dính kim loại ở trạng thái dẻo, thuộc nhóm hàn áp lực."
  },
  {
    "id": 171,
    "question": "Phương pháp hàn nào kim loại tại vị trí mối hàn không ở trạng thái nóng chảy trong quá trình hàn?",
    "options": [
      "Hàn hồ quang",
      "Hàn MIG",
      "Hàn điện tiếp xúc",
      "Hàn TIG"
    ],
    "correctIndex": 2,
    "correctAnswer": "Hàn điện tiếp xúc",
    "correctAnswerLetter": "C",
    "chapterId": "ch4",
    "chapterTitle": "Chương IV: Phương Pháp Hàn Kim Loại",
    "explanation": "Trong hàn điện tiếp xúc (hoặc hàn ma sát), kim loại vùng tiếp xúc được nung nóng đến trạng thái dẻo rồi ép chặt lại bằng lực ép cơ học chứ không nóng chảy hoàn toàn thành vũng lỏng."
  },
  {
    "id": 172,
    "question": "Phương pháp hàn hồ quang tay được ứng dụng chủ yếu trong lĩnh vực nào?",
    "options": [
      "Trong công nghiệp ô tô",
      "Trong công nghiệp chế tạo máy",
      "Trong công nghiệp sản xuất khung xe máy",
      "Ứng dụng trong cơ khí xây dựng"
    ],
    "correctIndex": 3,
    "correctAnswer": "Ứng dụng trong cơ khí xây dựng",
    "correctAnswerLetter": "D",
    "chapterId": "ch4",
    "chapterTitle": "Chương IV: Phương Pháp Hàn Kim Loại",
    "explanation": "Hàn hồ quang tay (SMAW) có tính vạn năng cao, thiết bị gọn nhẹ cơ động nên được ứng dụng phổ biến và chủ yếu nhất trong cơ khí xây dựng, dựng lắp khung nhà xưởng và kết cấu thép."
  },
  {
    "id": 173,
    "question": "Hàn điện tiếp xúc được ứng dụng chủ yếu trong lĩnh vực nào?",
    "options": [
      "Trong công nghiệp ô tô",
      "Ứng dụng trong cơ khí xây dựng",
      "Trong công nghiệp chế tạo máy",
      "Trong công nghiệp sản xuất khung xe máy"
    ],
    "correctIndex": 0,
    "correctAnswer": "Trong công nghiệp ô tô",
    "correctAnswerLetter": "A",
    "chapterId": "ch4",
    "chapterTitle": "Chương IV: Phương Pháp Hàn Kim Loại",
    "explanation": "Hàn điện tiếp xúc (hàn điểm tự động bằng robot) là công nghệ then chốt chiếm tỷ trọng lớn nhất trong dây chuyền sản xuất thân vỏ xe ô tô từ các tấm thép mỏng."
  },
  {
    "id": 174,
    "question": "Tác dụng của thuốc hàn hay khí bảo vệ là:",
    "options": [
      "Làm cho nhiệt hàn cao",
      "Bảo vệ mối hàn không tiếp xúc với oxy",
      "Bảo vệ mối hàn không bị thoát nhiệt",
      "Bảo vệ cho vật liệu nóng chảy tại mối hàn không rơi vãi ra xung quanh"
    ],
    "correctIndex": 1,
    "correctAnswer": "Bảo vệ mối hàn không tiếp xúc với oxy",
    "correctAnswerLetter": "B",
    "chapterId": "ch4",
    "chapterTitle": "Chương IV: Phương Pháp Hàn Kim Loại",
    "explanation": "Khí bảo vệ (Ar, CO2) hoặc thuốc hàn bọc tạo môi trường cách ly vũng kim loại lỏng khỏi tác động oxy hóa và nitơ hóa của không khí xung quanh, chống rỗ khí và xỉ."
  },
  {
    "id": 175,
    "question": "Khí bảo vệ khi hàn có đặc điểm nào sau đây?",
    "options": [
      "Tác dụng được với kim loại nền",
      "Tác dụng được với kim loại của que hàn",
      "Là một loại khí trơ",
      "Tác dụng với các loại khí ở môi trường xung quanh"
    ],
    "correctIndex": 2,
    "correctAnswer": "Là một loại khí trơ",
    "correctAnswerLetter": "C",
    "chapterId": "ch4",
    "chapterTitle": "Chương IV: Phương Pháp Hàn Kim Loại",
    "explanation": "Khí bảo vệ trong hàn TIG/MIG (như Argon, Heli) là khí trơ, hoàn toàn không phản ứng hay tác dụng hóa học với kim loại nóng chảy ở nhiệt độ cao."
  },
  {
    "id": 176,
    "question": "Vật liệu nào sau đây có tính hàn tốt nhất?",
    "options": [
      "Thép",
      "Hợp kim đồng",
      "Hợp kim nhôm",
      "Gang"
    ],
    "correctIndex": 0,
    "correctAnswer": "Thép",
    "correctAnswerLetter": "A",
    "chapterId": "ch4",
    "chapterTitle": "Chương IV: Phương Pháp Hàn Kim Loại",
    "explanation": "Thép carbon thấp (C < 0,25%) có tính hàn tốt nhất, mối hàn dẻo dai, không bị tôi cứng nứt nẻ. Trong khi đó gang và hợp kim màu khó hàn hơn nhiều."
  },
  {
    "id": 177,
    "question": "Phương pháp hàn TIG dùng loại điện cực hàn nào:",
    "options": [
      "Cuộn dây thép",
      "Điện cực Vonphram",
      "Que hàn thép",
      "Điện cực đồng"
    ],
    "correctIndex": 1,
    "correctAnswer": "Điện cực Vonphram",
    "correctAnswerLetter": "B",
    "chapterId": "ch4",
    "chapterTitle": "Chương IV: Phương Pháp Hàn Kim Loại",
    "explanation": "Hàn TIG (Tungsten Inert Gas) sử dụng điện cực không nóng chảy bằng kim loại Vonfram (W) có nhiệt độ nóng chảy rất cao (~3422°C)."
  },
  {
    "id": 178,
    "question": "Đâu không phải là ưu điểm của phương pháp hàn hồ quang tay?",
    "options": [
      "Có tính vạn năng, linh hoạt, tiện lợi",
      "Cho phép thực hiện được các mối hàn ở các vị trí khác nhau trong không gian",
      "Thiết bị đơn giản, dễ vận hành, sửa chữa, chi phí đầu tư không cao",
      "Năng suất cao, chất lượng mối hàn tốt"
    ],
    "correctIndex": 3,
    "correctAnswer": "Năng suất cao, chất lượng mối hàn tốt",
    "correctAnswerLetter": "D",
    "chapterId": "ch4",
    "chapterTitle": "Chương IV: Phương Pháp Hàn Kim Loại",
    "explanation": "Hàn hồ quang tay có năng suất thấp do tốc độ chậm và phải dừng thay que hàn, đồng thời chất lượng phụ thuộc vào tay nghề thợ hàn. Do đó đây không phải là ưu điểm."
  },
  {
    "id": 179,
    "question": "Đâu không phải là nhược điểm của phương pháp hàn hồ quang tay?",
    "options": [
      "Thiết bị hàn tương đối đắt",
      "Chất lượng và năng suất hàn phụ thuộc vào trình độ tay nghề của người thợ hàn",
      "Năng suất tương đối thấp",
      "Điều kiện làm việc của thợ hàn không tốt, nguy hiểm và độc hại"
    ],
    "correctIndex": 0,
    "correctAnswer": "Thiết bị hàn tương đối đắt",
    "correctAnswerLetter": "A",
    "chapterId": "ch4",
    "chapterTitle": "Chương IV: Phương Pháp Hàn Kim Loại",
    "explanation": "Máy hàn hồ quang tay có cấu tạo rất đơn giản, giá thành rẻ nhất trong các thiết bị hàn, do đó 'thiết bị tương đối đắt' không phải là nhược điểm của nó."
  },
  {
    "id": 180,
    "question": "Đâu không phải là một dạng mối hàn?",
    "options": [
      "Mối hàn đối đầu",
      "Mối hàn sấp",
      "Mối hàn gấp mép",
      "Mối hàn chồng"
    ],
    "correctIndex": 1,
    "correctAnswer": "Mối hàn sấp",
    "correctAnswerLetter": "B",
    "chapterId": "ch4",
    "chapterTitle": "Chương IV: Phương Pháp Hàn Kim Loại",
    "explanation": "Hàn sấp (hàn bằng) là vị trí không gian của mối hàn. Các dạng liên kết mối hàn gồm có: giáp mối (đối đầu), hàn chồng, hàn góc, hàn gấp mép."
  },
  {
    "id": 181,
    "question": "Đặc điểm đường chuyển động nào sau đây không mô tả dạng đường chạy đầu que hàn?",
    "options": [
      "Hình thoi",
      "Hình tam giác",
      "Hình vuông",
      "Hình số 8"
    ],
    "correctIndex": 2,
    "correctAnswer": "Hình vuông",
    "correctAnswerLetter": "C",
    "chapterId": "ch4",
    "chapterTitle": "Chương IV: Phương Pháp Hàn Kim Loại",
    "explanation": "Các dạng dao động ngang của đầu que hàn gồm: ziczac, răng cưa, hình số 8, tam giác, hình thoi/xoắn ốc. Không sử dụng chuyển động gấp khúc góc vuông (hình vuông)."
  },
  {
    "id": 182,
    "question": "Đặc điểm đường chuyển động nào sau đây không mô tả dạng đường chạy đầu que hàn?",
    "options": [
      "Đường cong",
      "Đường thẳng",
      "Đường zic zắc",
      "Đường răng cưa"
    ],
    "correctIndex": 0,
    "correctAnswer": "Đường cong",
    "correctAnswerLetter": "A",
    "chapterId": "ch4",
    "chapterTitle": "Chương IV: Phương Pháp Hàn Kim Loại",
    "explanation": "Trong kỹ thuật hàn que, các đường chạy tiêu chuẩn là: đường thẳng, đường ziczac, đường răng cưa, đường vòng xoắn. 'Đường cong' không phải là thuật ngữ kỹ thuật chỉ kiểu dao động đầu que hàn."
  },
  {
    "id": 183,
    "question": "Phương pháp hàn nào sau đây có điện cực không nóng chảy?",
    "options": [
      "Hàn MIG",
      "Hàn MAG",
      "Hàn SAW",
      "Hàn TIG"
    ],
    "correctIndex": 3,
    "correctAnswer": "Hàn TIG",
    "correctAnswerLetter": "D",
    "chapterId": "ch4",
    "chapterTitle": "Chương IV: Phương Pháp Hàn Kim Loại",
    "explanation": "Hàn TIG sử dụng điện cực Vonfram không nóng chảy. Hàn MIG, MAG, SAW đều dùng cuộn dây kim loại nóng chảy liên tục thành mối hàn."
  },
  {
    "id": 184,
    "question": "Hàn hồ quang tay thường không được ứng dụng hàn ở đâu?",
    "options": [
      "Thép các bon và thép hợp kim",
      "Kim loại màu và hợp kim màu",
      "Công nghiệp sửa chữa và phục hồi",
      "Sản xuất kết cấu thép có chiều dày nhỏ và trung bình"
    ],
    "correctIndex": 1,
    "correctAnswer": "Kim loại màu và hợp kim màu",
    "correctAnswerLetter": "B",
    "chapterId": "ch4",
    "chapterTitle": "Chương IV: Phương Pháp Hàn Kim Loại",
    "explanation": "Hàn hồ quang tay khó hàn kim loại màu (nhôm, đồng, titan) vì thuốc bọc thông thường không bảo vệ tốt kim loại màu khỏi oxy hóa nhanh ở nhiệt độ cao (thường phải dùng hàn TIG/MIG)."
  },
  {
    "id": 185,
    "question": "Phương pháp hàn hơi dùng nhiệt từ hỗn hợp cháy giữa:",
    "options": [
      "Ôxi và axêtilen",
      "Ôxi và Hidro",
      "Ôxi và Etilen",
      "Oxi và khí Gas"
    ],
    "correctIndex": 0,
    "correctAnswer": "Ôxi và axêtilen",
    "correctAnswerLetter": "A",
    "chapterId": "ch4",
    "chapterTitle": "Chương IV: Phương Pháp Hàn Kim Loại",
    "explanation": "Hàn hơi (hàn khí) phổ biến nhất sử dụng nhiệt phản ứng cháy giữa khí Ôxi (O2) và Axêtilen (C2H2) cho nhiệt độ ngọn lửa cao nhất (~3150°C)."
  },
  {
    "id": 186,
    "question": "Đặc điểm nào không phải là đặc điểm của hàn khí?",
    "options": [
      "Hàn được nhiều loại kim loại và hợp kim, có thể hàn được tấm mỏng",
      "Vật hàn bị nung nóng nhiều dẫn đến cơ tính giảm",
      "Năng suất cao",
      "Thiết bị gọn, nhẹ, đơn giản, vốn đầu tư thấp, không cần nguồn điện"
    ],
    "correctIndex": 2,
    "correctAnswer": "Năng suất cao",
    "correctAnswerLetter": "C",
    "chapterId": "ch4",
    "chapterTitle": "Chương IV: Phương Pháp Hàn Kim Loại",
    "explanation": "Hàn khí có tốc độ hàn chậm, vùng ảnh hưởng nhiệt rất rộng làm nung nóng vật hàn nhiều, do đó năng suất thấp chứ không thể có năng suất cao."
  },
  {
    "id": 187,
    "question": "Ngọn lửa hàn khí bình thường khi tỷ lệ giữa ô xi (O2) và axetilen (C2H2) là:",
    "options": [
      "Nhỏ hơn 1",
      "Trong khoảng 1-1,2",
      "Lớn hơn 1,2",
      "Lớn hơn 2"
    ],
    "correctIndex": 1,
    "correctAnswer": "Trong khoảng 1-1,2",
    "correctAnswerLetter": "B",
    "chapterId": "ch4",
    "chapterTitle": "Chương IV: Phương Pháp Hàn Kim Loại",
    "explanation": "Ngọn lửa trung hòa (ngọn lửa bình thường) có tỷ lệ thể tích VO2 / VC2H2 nằm trong khoảng 1,0 đến 1,2."
  },
  {
    "id": 188,
    "question": "Ngọn lửa hàn khí các bon hóa có tỷ lệ giữa ô xi (O2) và axetilen (C2H2) là:",
    "options": [
      "Lớn hơn 1,2",
      "Nhỏ hơn 1",
      "Trong khoảng 1-1,2",
      "Lớn hơn 2"
    ],
    "correctIndex": 0,
    "correctAnswer": "Lớn hơn 1,2",
    "correctAnswerLetter": "A",
    "chapterId": "ch4",
    "chapterTitle": "Chương IV: Phương Pháp Hàn Kim Loại",
    "explanation": "Theo đáp án ngân hàng câu hỏi môn học: Chọn 'Lớn hơn 1,2' (tính theo tỷ lệ thừa C2H2). Lưu ý lý thuyết chuẩn: nếu tính theo tỷ lệ VO2/VC2H2 thì ngọn lửa thừa cacbon có tỷ lệ < 1."
  },
  {
    "id": 189,
    "question": "Ngọn lửa hàn khí Ô xy hóa có tỷ lệ giữa ô xi (O2) và axetilen (C2H2) là:",
    "options": [
      "Lớn hơn 1,2",
      "Nhỏ hơn 1",
      "Trong khoảng 1-1,2",
      "Lớn hơn 2"
    ],
    "correctIndex": 1,
    "correctAnswer": "Nhỏ hơn 1",
    "correctAnswerLetter": "B",
    "chapterId": "ch4",
    "chapterTitle": "Chương IV: Phương Pháp Hàn Kim Loại",
    "explanation": "Theo đáp án ngân hàng câu hỏi môn học: Chọn 'Nhỏ hơn 1'. Lưu ý lý thuyết chuẩn: nếu tính theo hệ số VO2/VC2H2 thì ngọn lửa oxy hóa có tỷ lệ > 1,2."
  },
  {
    "id": 190,
    "question": "Ngọn lửa hàn khí bình thường được phân ra làm mấy vùng?",
    "options": [
      "2",
      "4",
      "3",
      "5"
    ],
    "correctIndex": 2,
    "correctAnswer": "3",
    "correctAnswerLetter": "C",
    "chapterId": "ch4",
    "chapterTitle": "Chương IV: Phương Pháp Hàn Kim Loại",
    "explanation": "Ngọn lửa hàn khí bình thường (ngọn lửa trung hòa) phân thành 3 vùng: Nhân ngọn lửa (sáng trắng), Vùng hoàn nguyên (vùng làm việc nhiệt độ cao nhất ~3150°C), và Đuôi ngọn lửa."
  },
  {
    "id": 191,
    "question": "Ngọn lửa hàn khí dùng để hàn khí hợp kim đồng như Latong, tỷ lệ giữa ô xi (O2) và axetilen (C2H2) nên sử dụng là:",
    "options": [
      "Nhỏ hơn 1",
      "Trong khoảng 1-1,2",
      "Sử dụng tỷ lệ nào cũng được",
      "Lớn hơn 1,2"
    ],
    "correctIndex": 3,
    "correctAnswer": "Lớn hơn 1,2",
    "correctAnswerLetter": "D",
    "chapterId": "ch4",
    "chapterTitle": "Chương IV: Phương Pháp Hàn Kim Loại",
    "explanation": "Hàn đồng thau (Latong) dùng ngọn lửa oxy hóa (tỷ lệ > 1,2) để tạo lớp màng mỏng oxit kẽm bảo vệ bề mặt vũng hàn, ngăn chặn kẽm bốc hơi độc hại."
  },
  {
    "id": 192,
    "question": "Ngọn lửa hàn khí dùng để tẩy sạch bề mặt, tỷ lệ giữa ô xi (O2) và axetilen (C2H2) nên sử dụng là:",
    "options": [
      "Lớn hơn 1,2",
      "Nhỏ hơn 1",
      "Trong khoảng 1-1,2",
      "Sử dụng tỷ lệ nào cũng được"
    ],
    "correctIndex": 0,
    "correctAnswer": "Lớn hơn 1,2",
    "correctAnswerLetter": "A",
    "chapterId": "ch4",
    "chapterTitle": "Chương IV: Phương Pháp Hàn Kim Loại",
    "explanation": "Dùng ngọn lửa oxy hóa thừa oxy (tỷ lệ > 1,2) để oxy hóa nhanh và thiêu đốt các lớp gỉ sét, dầu mỡ bám trên bề mặt kim loại trước khi gia công."
  },
  {
    "id": 193,
    "question": "Ngọn lửa hàn khí dùng để hàn khí thép hợp kim, tỷ lệ giữa ô xi (O2) và axetilen (C2H2) nên sử dụng là:",
    "options": [
      "Lớn hơn 1,2",
      "Nhỏ hơn 1",
      "Trong khoảng 1-1,2",
      "Sử dụng tỷ lệ nào cũng được"
    ],
    "correctIndex": 1,
    "correctAnswer": "Nhỏ hơn 1",
    "correctAnswerLetter": "B",
    "chapterId": "ch4",
    "chapterTitle": "Chương IV: Phương Pháp Hàn Kim Loại",
    "explanation": "Hàn thép hợp kim cần ngọn lửa hoàn nguyên (tỷ lệ < 1) để tránh oxy hóa và cháy mất các nguyên tố hợp kim quý trong thép."
  },
  {
    "id": 194,
    "question": "Ngọn lửa hàn khí dùng để hàn khí thép gió, tỷ lệ giữa ô xi (O2) và axetilen (C2H2) nên sử dụng là:",
    "options": [
      "Lớn hơn 1,2",
      "Trong khoảng 1-1,2",
      "Nhỏ hơn 1",
      "Sử dụng tỷ lệ nào cũng được"
    ],
    "correctIndex": 2,
    "correctAnswer": "Nhỏ hơn 1",
    "correctAnswerLetter": "C",
    "chapterId": "ch4",
    "chapterTitle": "Chương IV: Phương Pháp Hàn Kim Loại",
    "explanation": "Thép gió chứa nhiều W, Cr, V, C nên cần ngọn lửa hoàn nguyên (tỷ lệ < 1) để giữ nguyên hàm lượng cacbon và các nguyên tố tạo cacbit cứng."
  },
  {
    "id": 195,
    "question": "Chọn phương pháp hàn phù hợp để hàn Gang",
    "options": [
      "Hàn khí",
      "Hàn hồ quang",
      "Hàn plasma",
      "Hàn điện tiếp xúc"
    ],
    "correctIndex": 0,
    "correctAnswer": "Hàn khí",
    "correctAnswerLetter": "A",
    "chapterId": "ch4",
    "chapterTitle": "Chương IV: Phương Pháp Hàn Kim Loại",
    "explanation": "Gang rất giòn và dễ bị nứt khi nguội nhanh. Phương pháp hàn khí có tốc độ nguội chậm và truyền nhiệt êm dịu nên rất phù hợp để hàn gang."
  },
  {
    "id": 196,
    "question": "Ngọn lửa hàn khí dùng để hàn khí gang, tỷ lệ giữa ô xi (O2) và axetilen (C2H2) nên sử dụng là:",
    "options": [
      "Lớn hơn 1,2",
      "Nhỏ hơn 1",
      "Trong khoảng 1-1,2",
      "Sử dụng tỷ lệ nào cũng được"
    ],
    "correctIndex": 1,
    "correctAnswer": "Nhỏ hơn 1",
    "correctAnswerLetter": "B",
    "chapterId": "ch4",
    "chapterTitle": "Chương IV: Phương Pháp Hàn Kim Loại",
    "explanation": "Hàn gang cần dùng ngọn lửa cacbon hóa thừa axetylen (tỷ lệ < 1) để bổ sung thêm cacbon bù vào phần bị cháy, chống hình thành gang trắng gây giòn nứt."
  },
  {
    "id": 197,
    "question": "Phương pháp hàn ma sát có thể thực hiện trên thiết bị nào sau đây?",
    "options": [
      "Máy tiện",
      "Máy phay",
      "Máy mài",
      "Máy bào"
    ],
    "correctIndex": 0,
    "correctAnswer": "Máy tiện",
    "correctAnswerLetter": "A",
    "chapterId": "ch4",
    "chapterTitle": "Chương IV: Phương Pháp Hàn Kim Loại",
    "explanation": "Hàn ma sát xoay cần một chi tiết quay tròn tốc độ cao và một chi tiết tịnh tiến ép sát, nguyên lý hoàn toàn phù hợp để thực hiện trên máy tiện."
  },
  {
    "id": 198,
    "question": "Năng lượng sử dụng để sinh nhiệt trong phương pháp hàn ma sát là:",
    "options": [
      "Năng lượng điện",
      "Công của lực ma sát",
      "Hồ quang điện",
      "Nhiệt sinh ra do điện trở của vật hàn"
    ],
    "correctIndex": 1,
    "correctAnswer": "Công của lực ma sát",
    "correctAnswerLetter": "B",
    "chapterId": "ch4",
    "chapterTitle": "Chương IV: Phương Pháp Hàn Kim Loại",
    "explanation": "Nhiệt hàn sinh ra từ công của lực ma sát giữa hai bề mặt tiếp xúc chuyển động tương đối ép sát với nhau ở tốc độ cao, nung dẻo mép hàn trước khi ép dính."
  },
  {
    "id": 199,
    "question": "Năng lượng sử dụng để sinh nhiệt trong phương pháp hàn điện tiếp xúc là:",
    "options": [
      "Năng lượng cơ năng",
      "Công của lực ma sát",
      "Nhiệt sinh ra do điện trở của vật hàn",
      "Hồ quang điện"
    ],
    "correctIndex": 2,
    "correctAnswer": "Nhiệt sinh ra do điện trở của vật hàn",
    "correctAnswerLetter": "C",
    "chapterId": "ch4",
    "chapterTitle": "Chương IV: Phương Pháp Hàn Kim Loại",
    "explanation": "Theo định luật Jun-Lenx (Q = I^2*R*t), dòng điện lớn chạy qua vùng tiếp xúc có điện trở tiếp xúc R lớn sẽ sinh ra nhiệt lượng cực lớn làm nóng dẻo kim loại hàn."
  },
  {
    "id": 200,
    "question": "Trong phương pháp hàn điện tiếp xúc, điện cực hàn thường làm bằng vật liệu gì?",
    "options": [
      "Thép các bon",
      "Than chì (graphit)",
      "Thép hợp kim",
      "Đồng và hợp kim đồng"
    ],
    "correctIndex": 3,
    "correctAnswer": "Đồng và hợp kim đồng",
    "correctAnswerLetter": "D",
    "chapterId": "ch4",
    "chapterTitle": "Chương IV: Phương Pháp Hàn Kim Loại",
    "explanation": "Điện cực hàn tiếp xúc cần dẫn điện và dẫn nhiệt cực tốt (để không bị dính nóng chảy vào vật hàn) và có độ bền cơ học cao, do đó làm bằng đồng hoặc hợp kim đồng (Cu-Cr, Cu-Be)."
  },
  {
    "id": 201,
    "question": "Đặc điểm nào không phải là đặc điểm của phương pháp hàn điện tiếp xúc?",
    "options": [
      "Mối hàn chất lượng không cao, không đẹp",
      "Thời gian hàn ngắn, năng suất cao, dễ tự động hóa",
      "Công suất máy lớn, đầu tư đắt tiền",
      "Thường chỉ dùng cho vật có chiều dày mỏng"
    ],
    "correctIndex": 0,
    "correctAnswer": "Mối hàn chất lượng không cao, không đẹp",
    "correctAnswerLetter": "A",
    "chapterId": "ch4",
    "chapterTitle": "Chương IV: Phương Pháp Hàn Kim Loại",
    "explanation": "Hàn điện tiếp xúc (hàn điểm, hàn đường) cho mối hàn rất chắc chắn, bề mặt phẳng đẹp và năng suất cao. Nhận định 'chất lượng không cao, không đẹp' là sai."
  },
  {
    "id": 202,
    "question": "Nguyên nhân xuất hiện ứng suất dư trong kết cấu hàn là:",
    "options": [
      "Nung nóng đều kim loại vật liệu hàn",
      "Nung nóng không đều vật liệu hàn",
      "Chịu tác dụng của ngoại lực",
      "Nhiệt hàn quá lớn"
    ],
    "correctIndex": 1,
    "correctAnswer": "Nung nóng không đều vật liệu hàn",
    "correctAnswerLetter": "B",
    "chapterId": "ch4",
    "chapterTitle": "Chương IV: Phương Pháp Hàn Kim Loại",
    "explanation": "Khi hàn, sự phân bố nhiệt cục bộ không đồng đều khiến vùng mối hàn nóng dãn nở bị cản trở bởi vùng kim loại nguội xung quanh, khi nguội co ngót lại sinh ra ứng suất dư nội tại."
  },
  {
    "id": 203,
    "question": "Kết cấu hàn thường bị cong vênh do:",
    "options": [
      "Nung nóng đều kim loại vật liệu hàn",
      "Chịu tác dụng của ngoại lực",
      "Nung nóng không đều vật liệu hàn",
      "Nhiệt hàn quá lớn"
    ],
    "correctIndex": 2,
    "correctAnswer": "Nung nóng không đều vật liệu hàn",
    "correctAnswerLetter": "C",
    "chapterId": "ch4",
    "chapterTitle": "Chương IV: Phương Pháp Hàn Kim Loại",
    "explanation": "Nung nóng và làm nguội không đều làm co ngót kim loại không đồng nhất, sinh ra ứng suất dư vượt quá giới hạn chảy gây biến dạng cong vênh kết cấu."
  },
  {
    "id": 204,
    "question": "Phương pháp hàn nào que hàn chỉ có nhiệm vụ gây hồ quang?",
    "options": [
      "Hàn TIG",
      "Hàn MIG",
      "Hàn MAG",
      "Hàn hồ quang tay"
    ],
    "correctIndex": 0,
    "correctAnswer": "Hàn TIG",
    "correctAnswerLetter": "A",
    "chapterId": "ch4",
    "chapterTitle": "Chương IV: Phương Pháp Hàn Kim Loại",
    "explanation": "Trong hàn TIG, điện cực Vonfram không tự nóng chảy mà chỉ đóng vai trò phóng tia hồ quang điện để làm nóng chảy mép hàn."
  },
  {
    "id": 205,
    "question": "Phương pháp hàn nào sau đây không dùng que hàn?",
    "options": [
      "Hàn khí",
      "Hàn điện tiếp xúc",
      "Hàn hồ quang tay",
      "Hàn hồ quang có khí bảo vệ"
    ],
    "correctIndex": 1,
    "correctAnswer": "Hàn điện tiếp xúc",
    "correctAnswerLetter": "B",
    "chapterId": "ch4",
    "chapterTitle": "Chương IV: Phương Pháp Hàn Kim Loại",
    "explanation": "Hàn điện tiếp xúc chỉ ép hai tấm kim loại vào nhau và cho dòng điện nung nóng dẻo điểm tiếp xúc rồi ép dính, hoàn toàn không cần que hàn hay kim loại phụ."
  },
  {
    "id": 206,
    "question": "Vật liệu của chi tiết gia công tại vị trí lưỡi cắt ở trạng thái nào?",
    "options": [
      "Trạng thái chảy",
      "Trạng thái phá hủy",
      "Trạng thái đàn hồi",
      "Trạng thái biến dạng"
    ],
    "correctIndex": 1,
    "correctAnswer": "Trạng thái phá hủy",
    "correctAnswerLetter": "B",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Tại vị trí lưỡi cắt, ứng suất trong vật liệu vượt quá giới hạn bền phá hủy, làm kim loại bị trượt, tách rời tạo thành phoi."
  },
  {
    "id": 207,
    "question": "Chế độ cắt bao gồm các thông số sau:",
    "options": [
      "Chuyển động chính, chuyển động chạy dao",
      "Vận tốc cắt, vận tốc tiến dao, chiều sâu cắt",
      "Chuyển động chính, chuyển động chạy dao, chiều sâu cắt",
      "Vận tốc cắt, chuyển động chính, chiều sâu cắt"
    ],
    "correctIndex": 1,
    "correctAnswer": "Vận tốc cắt, vận tốc tiến dao, chiều sâu cắt",
    "correctAnswerLetter": "B",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Chế độ cắt gồm 3 thông số cơ bản: Vận tốc cắt v (m/phút), lượng chạy dao / vận tốc tiến dao s (mm/vòng hoặc mm/phút), và chiều sâu cắt t (mm)."
  },
  {
    "id": 208,
    "question": "Năng suất và chất lượng sẽ thay đổi như thế nào khi tăng vận tốc cắt?",
    "options": [
      "Năng suất giảm và chất lượng giảm",
      "Năng suất tăng và chất lượng giảm",
      "Năng suất tăng và chất lượng sản phẩm tăng",
      "Năng suất giảm và chất lượng tăng"
    ],
    "correctIndex": 2,
    "correctAnswer": "Năng suất tăng và chất lượng sản phẩm tăng",
    "correctAnswerLetter": "C",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Tăng vận tốc cắt v giúp bóc tách phoi nhanh hơn (tăng năng suất), đồng thời triệt tiêu lẹo dao và giảm lực cắt, làm bề mặt bóng đẹp hơn (tăng chất lượng)."
  },
  {
    "id": 209,
    "question": "Năng suất và chất lượng sẽ thay đổi như thế nào khi giảm vận tốc cắt?",
    "options": [
      "Năng suất giảm và chất lượng tăng",
      "Năng suất giảm và chất lượng giảm",
      "Năng suất tăng và chất lượng giảm",
      "Năng suất tăng và chất lượng sản phẩm tăng"
    ],
    "correctIndex": 1,
    "correctAnswer": "Năng suất giảm và chất lượng giảm",
    "correctAnswerLetter": "B",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Giảm vận tốc cắt v làm kéo dài thời gian gia công (giảm năng suất), đồng thời dễ sinh hiện tượng lẹo dao làm bề mặt thô ráp (giảm chất lượng)."
  },
  {
    "id": 210,
    "question": "Năng suất và chất lượng sẽ thay đổi như thế nào khi tăng vận tốc tiến dao?",
    "options": [
      "Năng suất tăng và chất lượng giảm",
      "Năng suất giảm và chất lượng giảm",
      "Năng suất giảm và chất lượng tăng",
      "Năng suất tăng và chất lượng sản phẩm tăng"
    ],
    "correctIndex": 0,
    "correctAnswer": "Năng suất tăng và chất lượng giảm",
    "correctAnswerLetter": "A",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Tăng vận tốc tiến dao s giúp rút ngắn hành trình gia công (tăng năng suất), nhưng làm chiều cao nhấp nhô bề mặt Rz tăng lên (giảm chất lượng bề mặt)."
  },
  {
    "id": 211,
    "question": "Năng suất và chất lượng sẽ thay đổi như thế nào khi giảm vận tốc tiến dao?",
    "options": [
      "Năng suất tăng và chất lượng giảm",
      "Năng suất giảm và chất lượng giảm",
      "Năng suất tăng và chất lượng sản phẩm tăng",
      "Năng suất giảm và chất lượng tăng"
    ],
    "correctIndex": 3,
    "correctAnswer": "Năng suất giảm và chất lượng tăng",
    "correctAnswerLetter": "D",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Giảm lượng tiến dao s làm giảm các vệt gợn nhấp nhô của mũi dao trên bề mặt chi tiết (tăng độ bóng), nhưng tốc độ bóc phoi chậm hơn (giảm năng suất)."
  },
  {
    "id": 212,
    "question": "Năng suất và chất lượng sẽ thay đổi như thế nào khi tăng chiều sâu cắt?",
    "options": [
      "Năng suất giảm và chất lượng tăng",
      "Năng suất giảm và chất lượng giảm",
      "Năng suất tăng và chất lượng sản phẩm tăng",
      "Năng suất tăng và chất lượng giảm"
    ],
    "correctIndex": 3,
    "correctAnswer": "Năng suất tăng và chất lượng giảm",
    "correctAnswerLetter": "D",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Tăng chiều sâu cắt t giúp hớt được lượng kim loại lớn trong một lượt dao (tăng năng suất), nhưng lực cắt tăng mạnh gây rung động và biến dạng đàn hồi (giảm chất lượng)."
  },
  {
    "id": 213,
    "question": "Năng suất và chất lượng sẽ thay đổi như thế nào khi giảm chiều sâu cắt?",
    "options": [
      "Năng suất tăng và chất lượng sản phẩm tăng",
      "Năng suất tăng và chất lượng giảm",
      "Năng suất giảm và chất lượng tăng",
      "Năng suất giảm và chất lượng giảm"
    ],
    "correctIndex": 2,
    "correctAnswer": "Năng suất giảm và chất lượng tăng",
    "correctAnswerLetter": "C",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Giảm chiều sâu cắt t làm lực cắt nhỏ, giảm rung động, đạt độ chính xác kích thước và độ bóng cao (tăng chất lượng), nhưng bóc được ít phoi hơn mỗi lượt (giảm năng suất)."
  },
  {
    "id": 214,
    "question": "Điều chỉnh chế độ cắt như thế nào thì phù hợp với cắt thô?",
    "options": [
      "Giảm chiều sâu cắt, tăng tốc độ tiến dao, tăng vận tốc cắt",
      "Giảm chiều sâu cắt, giảm tốc độ tiến dao, tăng vận tốc cắt",
      "Tăng chiều sâu cắt, tăng tốc độ tiến dao, tăng vận tốc cắt",
      "Giảm chiều sâu cắt, tăng tốc độ tiến dao, giảm vận tốc cắt"
    ],
    "correctIndex": 3,
    "correctAnswer": "Giảm chiều sâu cắt, tăng tốc độ tiến dao, giảm vận tốc cắt",
    "correctAnswerLetter": "D",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Theo đáp án ngân hàng câu hỏi môn học: Cắt thô chọn 'Giảm chiều sâu cắt, tăng tốc độ tiến dao, giảm vận tốc cắt' để nâng cao năng suất tiến dao và bảo vệ tuổi bền dụng cụ cắt."
  },
  {
    "id": 215,
    "question": "Điều chỉnh chế độ cắt như thế nào thì phù hợp với cắt tinh?",
    "options": [
      "Giảm chiều sâu cắt, tăng tốc độ tiến dao, tăng vận tốc cắt",
      "Giảm chiều sâu cắt, tăng tốc độ tiến dao, giảm vận tốc cắt",
      "Tăng chiều sâu cắt, tăng tốc độ tiến dao, tăng vận tốc cắt",
      "Giảm chiều sâu cắt, giảm tốc độ tiến dao, tăng vận tốc cắt"
    ],
    "correctIndex": 3,
    "correctAnswer": "Giảm chiều sâu cắt, giảm tốc độ tiến dao, tăng vận tốc cắt",
    "correctAnswerLetter": "D",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Cắt tinh cần giảm chiều sâu cắt t và giảm tiến dao s để giảm nhấp nhô bề mặt, đồng thời tăng vận tốc cắt v để triệt tiêu lẹo dao và bề mặt đạt độ bóng tối đa."
  },
  {
    "id": 216,
    "question": "Điều chỉnh chế độ cắt như thế nào thì phù hợp với cắt bán tinh?",
    "options": [
      "Giảm chiều sâu cắt, tăng tốc độ tiến dao, giảm vận tốc cắt",
      "Giảm chiều sâu cắt, tăng tốc độ tiến dao, tăng vận tốc cắt",
      "Giảm chiều sâu cắt, giảm tốc độ tiến dao, tăng vận tốc cắt",
      "Tăng chiều sâu cắt, tăng tốc độ tiến dao, tăng vận tốc cắt"
    ],
    "correctIndex": 3,
    "correctAnswer": "Tăng chiều sâu cắt, tăng tốc độ tiến dao, tăng vận tốc cắt",
    "correctAnswerLetter": "D",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Theo chuẩn đáp án trắc nghiệm môn học: Cắt bán tinh chọn 'Tăng chiều sâu cắt, tăng tốc độ tiến dao, tăng vận tốc cắt'."
  },
  {
    "id": 217,
    "question": "Nguyên công được đặc trưng bởi yếu tố nào sau đây:",
    "options": [
      "Thực hiện liên tục tại một vị trí làm việc",
      "Thực hiện liên tục trên một đối tượng sản phẩm",
      "Do một hoặc một nhóm công nhân thực hiện",
      "Cả ba yếu tố đã nêu"
    ],
    "correctIndex": 3,
    "correctAnswer": "Cả ba yếu tố đã nêu",
    "correctAnswerLetter": "D",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Nguyên công là phần cơ bản của quá trình công nghệ được hoàn thành liên tục tại một vị trí làm việc, do một hoặc một nhóm công nhân thực hiện trên một đối tượng chi tiết."
  },
  {
    "id": 218,
    "question": "Trong quá trình gia công cắt gọt, thay đổi yếu tố nào sau đây thì sẽ chuyển sang nguyên công mới:",
    "options": [
      "Mặt gia công",
      "Chế độ cắt",
      "Chi tiết gia công",
      "Dụng cụ cắt"
    ],
    "correctIndex": 2,
    "correctAnswer": "Chi tiết gia công",
    "correctAnswerLetter": "C",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Khi thay đổi đối tượng sản phẩm gia công hoặc chuyển sang máy khác thì quy trình công nghệ sẽ chuyển sang một nguyên công mới."
  },
  {
    "id": 219,
    "question": "Trong quá trình gia công cắt gọt, thay đổi yếu tố nào sau đây thì sẽ chuyển sang nguyên công mới:",
    "options": [
      "Mặt gia công",
      "Dụng cụ cắt",
      "Công nhân thực hiện",
      "Chế độ cắt"
    ],
    "correctIndex": 2,
    "correctAnswer": "Công nhân thực hiện",
    "correctAnswerLetter": "C",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Nguyên công do một hoặc một nhóm công nhân phụ trách; khi thay đổi công nhân thực hiện độc lập tại trạm mới thì tính là nguyên công mới."
  },
  {
    "id": 220,
    "question": "Trong gia công cắt gọt thay đổi yếu tố nào sau đây thì sẽ chuyển sang nguyên công mới:",
    "options": [
      "Mặt gia công",
      "Dụng cụ cắt",
      "Chế độ cắt",
      "Máy thực hiện"
    ],
    "correctIndex": 3,
    "correctAnswer": "Máy thực hiện",
    "correctAnswerLetter": "D",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Nguyên công được thực hiện tại một chỗ làm việc cố định (một máy công cụ). Khi chi tiết được chuyển sang máy khác thì chuyển sang nguyên công mới."
  },
  {
    "id": 221,
    "question": "Trong gia công cắt gọt thay đổi yếu tố nào sau đây thì sẽ chuyển sang bước mới:",
    "options": [
      "Chế độ cắt",
      "Thay đổi một trong ba yếu tố trên",
      "Thay đổi bề mặt gia công",
      "Dụng cụ cắt"
    ],
    "correctIndex": 1,
    "correctAnswer": "Thay đổi một trong ba yếu tố trên",
    "correctAnswerLetter": "B",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Bước là một phần của nguyên công. Thay đổi bề mặt gia công, hoặc thay đổi dụng cụ cắt, hoặc thay đổi chế độ cắt đều tạo thành bước công nghệ mới."
  },
  {
    "id": 222,
    "question": "Động tác được thực hiện bởi:",
    "options": [
      "Tổ trưởng sản xuất",
      "Quản đốc phân xưởng",
      "Kỹ thuật viên",
      "Công nhân vận hành máy"
    ],
    "correctIndex": 3,
    "correctAnswer": "Công nhân vận hành máy",
    "correctAnswerLetter": "D",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Động tác là tập hợp các cử động làm việc có mục đích của người công nhân trực tiếp vận hành máy (bật máy, gạt tay gạt, kẹp phôi)."
  },
  {
    "id": 223,
    "question": "Những yêu cầu cơ bản của vật liệu làm lưỡi cắt là:",
    "options": [
      "Khả năng chịu lực va đập, khả năng chịu nhiệt tốt, khả năng chịu mài mòn, dẫn nhiệt tốt",
      "Độ cứng cao, khả năng chịu nhiệt tốt, khả năng chịu mài mòn, dẫn nhiệt tốt",
      "Độ đàn hồi cao, khả năng chịu nhiệt tốt, khả năng chịu mài mòn, dẫn nhiệt tốt",
      "Độ bền cao, khả năng chịu nhiệt tốt, khả năng chịu mài mòn, dẫn nhiệt tốt"
    ],
    "correctIndex": 1,
    "correctAnswer": "Độ cứng cao, khả năng chịu nhiệt tốt, khả năng chịu mài mòn, dẫn nhiệt tốt",
    "correctAnswerLetter": "B",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Vật liệu làm lưỡi cắt phải có: Độ cứng cao (>= 60 HRC), Độ bền nhiệt (chịu nhiệt), Tính chống mài mòn cao và Tính dẫn nhiệt tốt để tản nhiệt cắt."
  },
  {
    "id": 224,
    "question": "Loại dao nào có một lưỡi cắt chính?",
    "options": [
      "Mũi Khoét",
      "Dao tiện",
      "Mũi khoan",
      "Mũi Taro"
    ],
    "correctIndex": 1,
    "correctAnswer": "Dao tiện",
    "correctAnswerLetter": "B",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Dao tiện là loại dụng cụ cắt một lưỡi điển hình (gồm 1 lưỡi cắt chính và 1 lưỡi cắt phụ). Mũi khoan có 2 lưỡi, mũi khoét có 3-4 lưỡi, taro có nhiều lưỡi."
  },
  {
    "id": 225,
    "question": "Loại dao nào có hai lưỡi cắt chính?",
    "options": [
      "Mũi khoan",
      "Mũi Khoét",
      "Dao tiện",
      "Taro"
    ],
    "correctIndex": 0,
    "correctAnswer": "Mũi khoan",
    "correctAnswerLetter": "A",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Mũi khoan xoắn ruột gà có cấu tạo gồm 2 lưỡi cắt chính đối xứng nhau qua lõi mũi khoan."
  },
  {
    "id": 226,
    "question": "Trong các loại dao sau đây, loại nào có nhiều lưỡi cắt chính nhất?",
    "options": [
      "Dao xọc",
      "Dao tiện",
      "Dao bào",
      "Taro"
    ],
    "correctIndex": 3,
    "correctAnswer": "Taro",
    "correctAnswerLetter": "D",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Mũi taro dùng để cắt ren trong lỗ, có từ 3 - 4 rãnh dọc và mỗi rãnh chứa nhiều răng cắt ren, do đó có số lượng lưỡi cắt nhiều nhất trong các loại dao trên."
  },
  {
    "id": 227,
    "question": "Trong các loại dao sau đây, loại nào có nhiều lưỡi cắt chính nhất?",
    "options": [
      "Mũi khoan",
      "Mũi Khoét",
      "Mũi Taro",
      "Đá mài"
    ],
    "correctIndex": 3,
    "correctAnswer": "Đá mài",
    "correctAnswerLetter": "D",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Đá mài được cấu tạo từ hàng triệu hạt mài liên kết bằng chất dính kết, mỗi hạt mài là một lưỡi cắt siêu nhỏ độc lập (vô số lưỡi cắt)."
  },
  {
    "id": 228,
    "question": "Tính chất vật liệu trên dụng cụ cắt như thế nào là tốt nhất?",
    "options": [
      "Thân dao có độ cứng cao, lưỡi cắt có độ đàn hồi cao",
      "Thân dao có độ đàn hồi, lưỡi cắt có độ đàn hồi cao",
      "Thân dao có độ cứng cao, lưỡi cắt có độ cứng cao",
      "Lưỡi cắt có độ cứng cao, thân dao có độ đàn hồi"
    ],
    "correctIndex": 3,
    "correctAnswer": "Lưỡi cắt có độ cứng cao, thân dao có độ đàn hồi",
    "correctAnswerLetter": "D",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Lưỡi cắt cần độ cứng rất cao để cắt gọt kim loại, trong khi phần thân dao cần độ đàn hồi và dẻo dai để chịu lực uốn và hấp thụ rung động."
  },
  {
    "id": 229,
    "question": "Khi dao tiện làm bằng cùng một loại vật liệu, khi tôi cứng nên tôi như thế nào?",
    "options": [
      "Chỉ tôi cứng phần lưỡi cắt",
      "Tôi cứng toàn bộ thân giao",
      "Tôi cứng một nửa phần chuôi dao",
      "Tôi cứng một nửa phần lưỡi cắt"
    ],
    "correctIndex": 0,
    "correctAnswer": "Chỉ tôi cứng phần lưỡi cắt",
    "correctAnswerLetter": "A",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Chỉ tôi cứng phần đầu lưỡi cắt để đạt độ cứng cao hớt phoi, giữ cho thân dao có độ dẻo dai không bị giòn gãy khi tiện."
  },
  {
    "id": 230,
    "question": "Khi dao mũi khoan làm bằng cùng một loại vật liệu, khi tôi cứng nên tôi như thế nào?",
    "options": [
      "Tôi cứng một nửa phần chuôi dao",
      "Tôi cứng toàn bộ thân giao",
      "Tôi toàn bộ phần ruột gà",
      "Chỉ tôi cứng phần lưỡi cắt"
    ],
    "correctIndex": 3,
    "correctAnswer": "Chỉ tôi cứng phần lưỡi cắt",
    "correctAnswerLetter": "D",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Mũi khoan chỉ cần tôi cứng phần làm việc của lưỡi cắt, phần chuôi khoan cần dẻo dai để truyền mô-men xoắn mà không gãy."
  },
  {
    "id": 231,
    "question": "Vật liệu hợp kim cứng thường được sử dụng để chế tạo phần nào của dao?",
    "options": [
      "Chế tạo phần thân dao",
      "Chế tạo toàn bộ con dao",
      "Chế tạo lưỡi cắt",
      "Chế tạo phần chuôi dao"
    ],
    "correctIndex": 2,
    "correctAnswer": "Chế tạo lưỡi cắt",
    "correctAnswerLetter": "C",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Hợp kim cứng (carbide) rất đắt tiền và giòn, do đó chỉ được chế tạo thành các mảnh hạt dao (insert) hàn hoặc kẹp vào phần lưỡi cắt của thân dao bằng thép kết cấu."
  },
  {
    "id": 232,
    "question": "Từ \"giường\" trong tên gọi của các máy công cụ như máy bào giường, máy phay giường,... muốn nói lên điều gì?",
    "options": [
      "Máy đó to bằng cái giường",
      "Máy đó được đặt nằm",
      "Đó là một máy rất lớn",
      "Hình dạng cái máy đó như cái giường"
    ],
    "correctIndex": 2,
    "correctAnswer": "Đó là một máy rất lớn",
    "correctAnswerLetter": "C",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Từ 'giường' chỉ các máy công cụ hạng nặng, kích thước rất lớn với băng máy dài vững chắc để gia công các chi tiết khổ lớn và nặng."
  },
  {
    "id": 233,
    "question": "Từ \"đứng\" trong tên gọi của các máy công cụ như máy tiện đứng, máy phay đứng,... muốn nói lên điều gì?",
    "options": [
      "Máy đó có chiều cao lớn hơn các kính thước dài rộng",
      "Máy đó rất lớn",
      "Máy đó rất cao",
      "Trục chính nằm theo phương thẳng đứng"
    ],
    "correctIndex": 3,
    "correctAnswer": "Trục chính nằm theo phương thẳng đứng",
    "correctAnswerLetter": "D",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Tên gọi 'đứng' trong máy công cụ quy ước trục chính mang dao hoặc mang phôi được bố trí theo phương thẳng đứng."
  },
  {
    "id": 234,
    "question": "Từ \"ngang\" trong tên gọi của các máy công cụ như máy phay ngang,... muốn nói lên điều gì?",
    "options": [
      "Trục chính nằm theo phương nằm ngang",
      "Máy đó rất dài",
      "Máy đó rất lớn",
      "Máy đó có chiều dài lớn hơn các kính thước chiều cao và chiều rộng"
    ],
    "correctIndex": 0,
    "correctAnswer": "Trục chính nằm theo phương nằm ngang",
    "correctAnswerLetter": "A",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Máy phay ngang có trục chính lắp dao phay nằm theo phương song song với mặt đất (phương nằm ngang)."
  },
  {
    "id": 235,
    "question": "Máy nào kém linh hoạt (gia công được nhiều loại sản phẩm) nhất?",
    "options": [
      "Máy tiện vạn năng",
      "Máy phay vạn năng",
      "Máy CNC",
      "Máy chuyên dụng"
    ],
    "correctIndex": 3,
    "correctAnswer": "Máy chuyên dụng",
    "correctAnswerLetter": "D",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Máy chuyên dùng chỉ được chế tạo để gia công một bề mặt hoặc một chi tiết nhất định, không thể dùng linh hoạt cho các sản phẩm khác."
  },
  {
    "id": 236,
    "question": "Máy công cụ được phân loại theo mấy cách?",
    "options": [
      "4",
      "3",
      "2",
      "5"
    ],
    "correctIndex": 0,
    "correctAnswer": "4",
    "correctAnswerLetter": "A",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Máy công cụ được phân loại theo 4 cách chính: Theo công dụng, theo cấp chính xác, theo khối lượng/kích cỡ, và theo mức độ tự động hóa."
  },
  {
    "id": 237,
    "question": "Theo Tiêu chuẩn Việt Nam quy định mấy cấp chính xác cho máy công cụ?",
    "options": [
      "3",
      "4",
      "5",
      "6"
    ],
    "correctIndex": 2,
    "correctAnswer": "5",
    "correctAnswerLetter": "C",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "TCVN quy định 5 cấp chính xác cho máy công cụ: Cấp N (bình thường), Cấp P (chính xác), Cấp V (chính xác cao), Cấp A (đặc biệt chính xác) và Cấp S (siêu chính xác)."
  },
  {
    "id": 238,
    "question": "Kiểu truyền dẫn tập trung trong máy công cụ là:",
    "options": [
      "Nhiều động cơ truyền động cho một chuyển động của máy công cụ",
      "Một động cơ truyền động cho một nhóm chuyển động trong máy công cụ",
      "Một đồng cơ truyền động cho một chuyển động của máy công cụ",
      "Một động cơ truyền động cho tất cả các chuyển động của máy công cụ"
    ],
    "correctIndex": 3,
    "correctAnswer": "Một động cơ truyền động cho tất cả các chuyển động của máy công cụ",
    "correctAnswerLetter": "D",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Truyền dẫn tập trung dùng duy nhất một động cơ điện chính truyền lực tới toàn bộ các cơ cấu chuyển động của máy qua các hộp số."
  },
  {
    "id": 239,
    "question": "Kiểu truyền dẫn phân nhóm trong máy công cụ là:",
    "options": [
      "Một đồng cơ truyền động cho một chuyển động của máy công cụ",
      "Một động cơ truyền động cho tất cả các chuyển động của máy công cụ",
      "Một động cơ truyền động cho một nhóm chuyển động trong máy công cụ",
      "Nhiều động cơ truyền động cho một chuyển động của máy công cụ"
    ],
    "correctIndex": 2,
    "correctAnswer": "Một động cơ truyền động cho một nhóm chuyển động trong máy công cụ",
    "correctAnswerLetter": "C",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Truyền dẫn phân nhóm dùng từng động cơ riêng cho từng cụm nhóm chuyển động (ví dụ động cơ chuyển động chính riêng, động cơ nhóm chạy dao riêng)."
  },
  {
    "id": 240,
    "question": "Kiểu truyền dẫn độc lập trong máy công cụ là:",
    "options": [
      "Một động cơ truyền động cho tất cả các chuyển động của máy công cụ",
      "Nhiều động cơ truyền động cho một chuyển động của máy công cụ",
      "Một đồng cơ truyền động cho một chuyển động của máy công cụ",
      "Một động cơ truyền động cho một nhóm chuyển động trong máy công cụ"
    ],
    "correctIndex": 2,
    "correctAnswer": "Một đồng cơ truyền động cho một chuyển động của máy công cụ",
    "correctAnswerLetter": "C",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Truyền dẫn độc lập trang bị động cơ riêng rẽ cho từng trục chuyển động (như các động cơ servo trong máy điều khiển số CNC)."
  },
  {
    "id": 241,
    "question": "Trong máy công cụ cần có bao nhiêu chuyển động?",
    "options": [
      "Tối thiểu hai chuyển động",
      "Hai chuyển động",
      "Ba Chuyển động",
      "Một chuyển động"
    ],
    "correctIndex": 0,
    "correctAnswer": "Tối thiểu hai chuyển động",
    "correctAnswerLetter": "A",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Để tạo hình chi tiết cắt gọt, máy công cụ tối thiểu phải có 2 chuyển động: Chuyển động chính (tạo phoi) và Chuyển động chạy dao (duy trì quá trình cắt liên tục)."
  },
  {
    "id": 242,
    "question": "Khái niệm Máy CNC n trục, ví dụ Máy CNC 3 trục, Máy CNC 4 trục, Máy CNC 5 trục … có nghĩa là gì?",
    "options": [
      "Máy đó có n cái trục",
      "Máy đó có n lưỡi cắt",
      "Máy đó có n chuyển động",
      "Giữa dao và phôi có khả năng thực hiện n chuyển động tương đối"
    ],
    "correctIndex": 3,
    "correctAnswer": "Giữa dao và phôi có khả năng thực hiện n chuyển động tương đối",
    "correctAnswerLetter": "D",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Số trục của máy CNC thể hiện số bậc tự do chuyển động tương đối được nội suy đồng thời giữa dụng cụ cắt và phôi (tịnh tiến X, Y, Z hoặc xoay A, B, C)."
  },
  {
    "id": 243,
    "question": "Công dụng chính của đồ gá là:",
    "options": [
      "Dùng để định vị phôi",
      "Dùng để định vị và kẹp chặt dao",
      "Dùng để kẹp chặt phôi",
      "Dùng để xác định vị trí của phôi so với dụng cụ cắt và giữ chặt phôi ở vị trí dưới tác dụng của lực cắt trong khi gia công"
    ],
    "correctIndex": 3,
    "correctAnswer": "Dùng để xác định vị trí của phôi so với dụng cụ cắt và giữ chặt phôi ở vị trí dưới tác dụng của lực cắt trong khi gia công",
    "correctAnswerLetter": "D",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Đồ gá có 2 nhiệm vụ then chốt: Định vị (xác định tọa độ vị trí chính xác của phôi so với dao) và Kẹp chặt (cố định phôi chống lại lực cắt khi gia công)."
  },
  {
    "id": 244,
    "question": "Mâm cặp 3 chấu là đồ gá của máy nào:",
    "options": [
      "Máy phay",
      "Máy tiện",
      "Máy bào",
      "Máy khoan"
    ],
    "correctIndex": 1,
    "correctAnswer": "Máy tiện",
    "correctAnswerLetter": "B",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Mâm cặp 3 chấu tự định tâm là đồ gá tiêu chuẩn phổ biến nhất được gắn trên trục chính máy tiện để kẹp chặt phôi tròn xoay."
  },
  {
    "id": 245,
    "question": "Trong gia công tiện, khi bề mặt định vị bị lệch tâm với bề mặt gia công ta nên chọn loại đồ gá loại đồ gá nào?",
    "options": [
      "Mâm cặp 4 chấu",
      "Mâm cặp 3 chấu",
      "Chọn mâm cặp 3 chấu hay mâm cặp 4 chấu đều được",
      "Không dùng được mâm cặp 3 chấu hay 4 chấu"
    ],
    "correctIndex": 0,
    "correctAnswer": "Mâm cặp 4 chấu",
    "correctAnswerLetter": "A",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Mâm cặp 4 chấu có 4 chấu dịch chuyển độc lập, cho phép điều chỉnh tâm quay lệch so với bề mặt ngoài để gia công các chi tiết lệch tâm."
  },
  {
    "id": 246,
    "question": "Trong gia công tiện, khi bề mặt định vị không tròn ta chọn loại đồ gá loại đồ gá nào?",
    "options": [
      "Không dùng được mâm cặp 3 chấu hay 4 chấu",
      "Mâm cặp 4 chấu",
      "Mâm cặp 3 chấu",
      "Chọn mâm cặp 3 chấu hay mâm cặp 4 chấu đều được"
    ],
    "correctIndex": 1,
    "correctAnswer": "Mâm cặp 4 chấu",
    "correctAnswerLetter": "B",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Phôi có tiết diện không tròn (vuông, chữ nhật, đa giác hoặc dị hình) bắt buộc dùng mâm cặp 4 chấu điều chỉnh từng chấu riêng biệt."
  },
  {
    "id": 247,
    "question": "Trong gia công tiện, khi bề mặt định vị bị tròn và đồng tâm với bề mặt gia công ta nên chọn loại đồ gá loại đồ gá nào?",
    "options": [
      "Chọn mâm cặp 3 chấu hay mâm cặp 4 chấu đều được",
      "Mâm cặp 4 chấu",
      "Không dùng được mâm cặp 3 chấu hay 4 chấu",
      "Mâm cặp 3 chấu"
    ],
    "correctIndex": 3,
    "correctAnswer": "Mâm cặp 3 chấu",
    "correctAnswerLetter": "D",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Phôi tròn xoay đồng tâm nên dùng mâm cặp 3 chấu tự định tâm vì gá đặt nhanh, các chấu cùng tiến lùi đồng thời."
  },
  {
    "id": 248,
    "question": "Công dụng của luynet để làm gì?",
    "options": [
      "Dùng để đỡ những chi tiết nặng",
      "Dùng để tăng độ cứng vững cho chi tiết gia công dạng trụ dài hoặc đỡ những chi tiết nặng",
      "Dùng để tăng độ cứng vững cho chi tiết dài",
      "Dùng để truyền động cho chi tiết gia công"
    ],
    "correctIndex": 1,
    "correctAnswer": "Dùng để tăng độ cứng vững cho chi tiết gia công dạng trụ dài hoặc đỡ những chi tiết nặng",
    "correctAnswerLetter": "B",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Luynet là đồ gá phụ dùng để chống võng, tăng độ cứng vững cho chi tiết dạng trục dài (L/D > 10) hoặc đỡ các phôi nặng trên máy tiện."
  },
  {
    "id": 249,
    "question": "Công dụng của luynet tĩnh để làm gì?",
    "options": [
      "Dùng để đỡ những chi tiết nặng",
      "Dùng để tăng độ cứng vững cho chi tiết gia công dạng trụ dài hoặc đỡ những chi tiết nặng",
      "Dùng để tăng độ cứng vững cho chi tiết dài",
      "Dùng để truyền động cho chi tiết gia công"
    ],
    "correctIndex": 0,
    "correctAnswer": "Dùng để đỡ những chi tiết nặng",
    "correctAnswerLetter": "A",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Luynet tĩnh được kẹp cố định trên băng máy, có công dụng chính là để đỡ những chi tiết trục dài và nặng hoặc khi gia công mặt đầu của phôi dài."
  },
  {
    "id": 250,
    "question": "Công dụng của luynet động để làm gì?",
    "options": [
      "Dùng để truyền động cho chi tiết gia công",
      "Dùng để đỡ những chi tiết nặng",
      "Dùng để tăng độ cứng vững cho chi tiết gia công dạng trụ dài hoặc đỡ những chi tiết nặng",
      "Dùng để tăng độ cứng vững cho chi tiết dài"
    ],
    "correctIndex": 3,
    "correctAnswer": "Dùng để tăng độ cứng vững cho chi tiết dài",
    "correctAnswerLetter": "D",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Luynet động được gắn trên bàn xe dao và di chuyển cùng dao, có tác dụng đỡ ngay sát điểm cắt để tăng độ cứng vững cho chi tiết trục dài."
  },
  {
    "id": 251,
    "question": "Khi cần tiện mặt ngoài của một chi tiết dạng trụ có đường kính nhỏ và chiều dài lớn nên sử dụng loại luynet nào?",
    "options": [
      "Dùng luynet động",
      "Dùng luynet tĩnh",
      "Dùng luynet động hay luynet tĩnh đều được",
      "Không cần dùng luynet nào"
    ],
    "correctIndex": 0,
    "correctAnswer": "Dùng luynet động",
    "correctAnswerLetter": "A",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Tiện ngoài suốt chiều dài trục nhỏ và dài cần luynet động chạy cùng dao để chống uốn võng ngay tại vị trí tác dụng lực cắt."
  },
  {
    "id": 252,
    "question": "Khi cần tiện mặt trong của một chi tiết dạng trụ có đường kính lớn và chiều dài lớn nên sử dụng loại luynet nào?",
    "options": [
      "Không cần dùng luynet nào",
      "Dùng luynet tĩnh",
      "Dùng luynet động hay luynet tĩnh đều được",
      "Dùng luynet động"
    ],
    "correctIndex": 1,
    "correctAnswer": "Dùng luynet tĩnh",
    "correctAnswerLetter": "B",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Khi tiện/khoét lỗ mặt trong, dao tiện phải luồn vào trong lỗ phôi nên phải dùng luynet tĩnh cố định trên băng máy để đỡ mặt ngoài chi tiết."
  },
  {
    "id": 253,
    "question": "Luynet tĩnh thường được gá đặt ở đâu?",
    "options": [
      "Bàn xe dao",
      "Bàn máy",
      "Băng máy",
      "Ụ động"
    ],
    "correctIndex": 2,
    "correctAnswer": "Băng máy",
    "correctAnswerLetter": "C",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Luynet tĩnh được kẹp chặt cố định trên sống trượt của băng máy tiện."
  },
  {
    "id": 254,
    "question": "Luynet động thường được gá đặt ở đâu?",
    "options": [
      "Băng máy",
      "Bàn xe dao",
      "Bàn máy",
      "Ụ động"
    ],
    "correctIndex": 1,
    "correctAnswer": "Bàn xe dao",
    "correctAnswerLetter": "B",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Luynet động được lắp cố định trên bàn xe dao để cùng tịnh tiến dọc theo phôi với dụng cụ cắt."
  },
  {
    "id": 255,
    "question": "Máy nào thường không sử dụng đồ gá Ê tô?",
    "options": [
      "Máy tiện",
      "Máy phay",
      "Máy khoan",
      "Máy bào"
    ],
    "correctIndex": 0,
    "correctAnswer": "Máy tiện",
    "correctAnswerLetter": "A",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Máy phay, khoan, bào thường dùng êtô kẹp phôi phẳng/hộp. Máy tiện phôi quay tròn nên dùng mâm cặp hoặc chống tâm chứ không dùng êtô."
  },
  {
    "id": 256,
    "question": "Mũi chống tâm thường được gá ở đâu?",
    "options": [
      "Bàn máy",
      "Bàn xe dao",
      "Băng máy",
      "Ụ động"
    ],
    "correctIndex": 3,
    "correctAnswer": "Ụ động",
    "correctAnswerLetter": "D",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Mũi chống tâm được lắp vào lỗ côn nòng của ụ động (ụ sau) máy tiện để chống đỡ tâm phôi."
  },
  {
    "id": 257,
    "question": "Máy công cụ có chuyển động chính là chuyển động thẳng qua lại của dao. Hỏi máy đó thuộc nhóm máy nào sau đây:",
    "options": [
      "Phay",
      "Tiện",
      "Khoan, khoét, doa",
      "Bào, xọc"
    ],
    "correctIndex": 3,
    "correctAnswer": "Bào, xọc",
    "correctAnswerLetter": "D",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Máy bào ngang và máy xọc có chuyển động chính là chuyển động tịnh tiến thẳng khứ hồi (qua lại) của đầu dao."
  },
  {
    "id": 258,
    "question": "Máy nào có chuyển động chính và chuyển động chạy dao đều do dao thực hiện?",
    "options": [
      "Xọc",
      "Tiện",
      "Bào, xọc",
      "Khoan"
    ],
    "correctIndex": 3,
    "correctAnswer": "Khoan",
    "correctAnswerLetter": "D",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Trên máy khoan, phôi cố định; mũi khoan vừa quay tròn (chuyển động chính) vừa tịnh tiến đi xuống (chuyển động chạy dao)."
  },
  {
    "id": 259,
    "question": "Máy nào có chuyển động chính là chuyển động quay tròn do dao thực hiện?",
    "options": [
      "Tiện",
      "Bào",
      "Xọc",
      "Phay"
    ],
    "correctIndex": 3,
    "correctAnswer": "Phay",
    "correctAnswerLetter": "D",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Máy phay có dao phay quay tròn quanh trục chính (chuyển động chính), phôi gắn trên bàn máy tịnh tiến (chuyển động chạy dao)."
  },
  {
    "id": 260,
    "question": "Máy nào có chuyển động chính là chuyển động quay tròn do phôi thực hiện?",
    "options": [
      "Tiện",
      "Xọc",
      "Bào",
      "Phay"
    ],
    "correctIndex": 0,
    "correctAnswer": "Tiện",
    "correctAnswerLetter": "A",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Trên máy tiện, phôi kẹp trên mâm cặp quay tròn (chuyển động chính), dao tiện dịch chuyển tịnh tiến dọc/ngang (chuyển động chạy dao)."
  },
  {
    "id": 261,
    "question": "Để gia công rãnh then cho lỗ thì chọn máy nào sau đây?",
    "options": [
      "Xọc",
      "Phay",
      "Bào",
      "Tiện"
    ],
    "correctIndex": 0,
    "correctAnswer": "Xọc",
    "correctAnswerLetter": "A",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Rãnh then trong lỗ (moay-ơ bánh răng, puli) là không gian kín trong lỗ sâu, phương pháp gia công tối ưu nhất là dùng máy xọc (hoặc máy chuốt)."
  },
  {
    "id": 262,
    "question": "Loại máy nào sau đây không thể gia công được mặt tròn xoay?",
    "options": [
      "Máy phay",
      "Máy tiện",
      "Máy mài",
      "Máy bào"
    ],
    "correctIndex": 3,
    "correctAnswer": "Máy bào",
    "correctAnswerLetter": "D",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Máy bào chỉ chuyển động tịnh tiến thẳng, gia công được mặt phẳng và rãnh thẳng, không thể tạo hình mặt tròn xoay kín."
  },
  {
    "id": 263,
    "question": "Máy công cụ nào sau đây có thể gia công được lỗ ren?",
    "options": [
      "Máy mài phẳng",
      "Máy xọc",
      "Máy bào ngang",
      "Máy khoan cần"
    ],
    "correctIndex": 3,
    "correctAnswer": "Máy khoan cần",
    "correctAnswerLetter": "D",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Máy khoan cần có hộp tốc độ và cơ cấu đảo chiều quay trục chính, cho phép taro gia công các lỗ ren ren trong một cách dễ dàng."
  },
  {
    "id": 264,
    "question": "Có thể chọn nhóm máy nào sau đây để gia công ren?",
    "options": [
      "Máy tiện, máy phay",
      "Máy doa, máy phay",
      "Máy khoan, máy tiện",
      "Máy phay, máy bào"
    ],
    "correctIndex": 2,
    "correctAnswer": "Máy khoan, máy tiện",
    "correctAnswerLetter": "C",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Máy tiện (tiện ren bằng dao tiện ren, bàn ren, taro) và máy khoan (taro ren) là hai loại máy thông dụng nhất để cắt ren."
  },
  {
    "id": 265,
    "question": "Máy phay lăn răng gia công được loại bánh răng nào sau đây?",
    "options": [
      "Bánh răng côn răng xoắn",
      "Tất cả các loại bánh răng",
      "Bánh răng trụ răng thẳng, răng nghiêng",
      "Bánh răng côn răng thẳng"
    ],
    "correctIndex": 2,
    "correctAnswer": "Bánh răng trụ răng thẳng, răng nghiêng",
    "correctAnswerLetter": "C",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Máy phay lăn răng dùng dao phay trục vít bao hình chuyên gia công bánh răng trụ răng thẳng, bánh răng trụ răng nghiêng và bánh vít."
  },
  {
    "id": 266,
    "question": "Nhóm máy bào xọc gia công được loại bánh răng nào sau đây?",
    "options": [
      "Bánh răng thân khai răng thẳng",
      "Bánh răng trụ răng nghiêng",
      "Bánh răng trụ răng thẳng",
      "Bánh răng côn"
    ],
    "correctIndex": 0,
    "correctAnswer": "Bánh răng thân khai răng thẳng",
    "correctAnswerLetter": "A",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Máy xọc răng bao hình chuyên gia công bánh răng trụ thân khai răng thẳng (đặc biệt là bánh răng trong và khối bánh răng liền bậc)."
  },
  {
    "id": 267,
    "question": "Loại máy nào có thể gia công được nhiều loại biên dạng nhất?",
    "options": [
      "Máy khoan",
      "Máy phay",
      "Máy tiện",
      "Máy bào"
    ],
    "correctIndex": 1,
    "correctAnswer": "Máy phay",
    "correctAnswerLetter": "B",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Máy phay (vạn năng, phay CNC 3-5 trục) có khả năng gia công mặt phẳng, mặt nghiêng, rãnh, rãnh xoắn, bánh răng, cam và mặt cong 3D phức tạp nhất."
  },
  {
    "id": 268,
    "question": "Phương pháp nào sau đây cho độ chính xác cao nhất?",
    "options": [
      "Khoan",
      "Khoét",
      "Tiện",
      "Doa"
    ],
    "correctIndex": 3,
    "correctAnswer": "Doa",
    "correctAnswerLetter": "D",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Trong gia công lỗ: Khoan (thô) -> Khoét (bán tinh) -> Doa (tinh đạt cấp chính xác cao nhất IT7 - IT9)."
  },
  {
    "id": 269,
    "question": "Phương pháp nào sau đây cho độ bóng cao nhất?",
    "options": [
      "Khoét",
      "Khoan",
      "Doa",
      "Tiện"
    ],
    "correctIndex": 2,
    "correctAnswer": "Doa",
    "correctAnswerLetter": "C",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Doa lỗ bằng dao doa nhiều lưỡi hớt lớp kim loại siêu mỏng, đạt độ bóng bề mặt rất cao (Ra = 1,25 - 0,63 micromet)."
  },
  {
    "id": 270,
    "question": "Phương pháp nào sau đây cho độ chính xác cao nhất?",
    "options": [
      "Bào",
      "Tiện",
      "Mài",
      "Phay"
    ],
    "correctIndex": 2,
    "correctAnswer": "Mài",
    "correctAnswerLetter": "C",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Mài là phương pháp gia công tinh kim loại đạt cấp chính xác cao nhất (IT6 - IT5)."
  },
  {
    "id": 271,
    "question": "Phương pháp nào sau đây cho độ bóng cao nhất?",
    "options": [
      "Tiện",
      "Mài",
      "Bào",
      "Phay"
    ],
    "correctIndex": 1,
    "correctAnswer": "Mài",
    "correctAnswerLetter": "B",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Mài cho độ bóng bề mặt rất cao (Ra = 0,63 - 0,16 micromet), vượt trội so với tiện, phay hay bào."
  },
  {
    "id": 272,
    "question": "Để gia công rãnh then cho trục thì chọn máy nào sau đây?",
    "options": [
      "Bào",
      "Xọc",
      "Phay",
      "Tiện"
    ],
    "correctIndex": 2,
    "correctAnswer": "Phay",
    "correctAnswerLetter": "C",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Rãnh then trên trục (then bằng, then bán nguyệt) được gia công trên máy phay bằng dao phay ngón hoặc dao phay đĩa."
  },
  {
    "id": 273,
    "question": "Có thể chọn nhóm máy nào sau đây để gia công mặt phẳng?",
    "options": [
      "Máy tiện, máy phay, máy bào",
      "Máy doa, máy phay, máy bào",
      "Máy phay, máy bào, máy mài",
      "Máy phay, máy khoan, máy mài"
    ],
    "correctIndex": 2,
    "correctAnswer": "Máy phay, máy bào, máy mài",
    "correctAnswerLetter": "C",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Ba phương pháp cơ bản nhất để gia công bề mặt phẳng là Phay mặt phẳng, Bào mặt phẳng và Mài phẳng."
  },
  {
    "id": 274,
    "question": "Có thể chọn nhóm máy nào sau đây để gia công lỗ?",
    "options": [
      "Máy phay, máy khoan, máy tiện",
      "Máy doa, máy phay, máy bào",
      "Máy phay, máy bào, máy mài",
      "Máy tiện, máy phay, máy bào"
    ],
    "correctIndex": 0,
    "correctAnswer": "Máy phay, máy khoan, máy tiện",
    "correctAnswerLetter": "A",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Lỗ có thể được gia công trên: Máy khoan (khoan, khoét, doa), Máy tiện (tiện lỗ trong), và Máy phay (khoan phay lỗ)."
  },
  {
    "id": 275,
    "question": "Có thể chọn nhóm máy nào sau đây để gia công rãnh có hình chữ T?",
    "options": [
      "Máy phay, máy tiện",
      "Máy phay, máy bào",
      "Máy doa, máy phay, máy bào",
      "Máy phay, khoan"
    ],
    "correctIndex": 1,
    "correctAnswer": "Máy phay, máy bào",
    "correctAnswerLetter": "B",
    "chapterId": "ch5",
    "chapterTitle": "Chương V: Phương Pháp Gia Công Cắt Gọt Kim Loại",
    "explanation": "Rãnh chữ T được gia công trên máy phay (dao phay rãnh chữ T) hoặc máy bào (dao bào rãnh chữ T)."
  },
  {
    "id": 276,
    "question": "Phương pháp gia công đặc biệt là:",
    "options": [
      "Sử dụng năng lượng cơ, hóa, nhiệt, điện để tách phoi kim loại ra khỏi bề mặt gia công",
      "Sử dụng năng lượng cơ học để làm biến dạng kim loại",
      "Sử dụng dụng cụ cắt để tách phoi kim loại ra khỏi bề mặt gia công",
      "Sử dụng năng lượng dạng nhiệt để làm biến dạng kim loại"
    ],
    "correctIndex": 0,
    "correctAnswer": "Sử dụng năng lượng cơ, hóa, nhiệt, điện để tách phoi kim loại ra khỏi bề mặt gia công",
    "correctAnswerLetter": "A",
    "chapterId": "ch6",
    "chapterTitle": "Chương VI: Một Số Phương Pháp Gia Công Tiên Tiến",
    "explanation": "Gia công đặc biệt (phi truyền thống) sử dụng trực tiếp các dạng năng lượng cơ, hóa, nhiệt, điện năng lượng cao để bóc tách vật liệu mà không dùng dụng cụ cắt cơ học truyền thống."
  },
  {
    "id": 277,
    "question": "Phương pháp gia công bằng tia lửa điện (EDM) được thực hiện bằng tác động:",
    "options": [
      "Điện",
      "Cơ học",
      "Nhiệt",
      "Hóa học"
    ],
    "correctIndex": 2,
    "correctAnswer": "Nhiệt",
    "correctAnswerLetter": "C",
    "chapterId": "ch6",
    "chapterTitle": "Chương VI: Một Số Phương Pháp Gia Công Tiên Tiến",
    "explanation": "EDM phóng các xung tia lửa điện sinh nhiệt độ cực cao (10.000 - 12.000°C) làm nóng chảy và bốc hơi kim loại cục bộ tại vùng phóng điện (tác động nhiệt)."
  },
  {
    "id": 278,
    "question": "Phương pháp gia công chùm tia lazer (LBM) được thực hiện bằng tác động:",
    "options": [
      "Hóa học",
      "Nhiệt",
      "Điện",
      "Cơ học"
    ],
    "correctIndex": 1,
    "correctAnswer": "Nhiệt",
    "correctAnswerLetter": "B",
    "chapterId": "ch6",
    "chapterTitle": "Chương VI: Một Số Phương Pháp Gia Công Tiên Tiến",
    "explanation": "Gia công bằng chùm tia laser (LBM) hội tụ mật độ năng lượng ánh sáng cực lớn thành nhiệt năng nung nóng chảy và bốc hơi vật liệu (tác động nhiệt)."
  },
  {
    "id": 279,
    "question": "Phương pháp gia công bằng điện hoá (ECM) được thực hiện bằng tác động:",
    "options": [
      "Điện",
      "Nhiệt",
      "Hóa học",
      "Cơ học"
    ],
    "correctIndex": 2,
    "correctAnswer": "Hóa học",
    "correctAnswerLetter": "C",
    "chapterId": "ch6",
    "chapterTitle": "Chương VI: Một Số Phương Pháp Gia Công Tiên Tiến",
    "explanation": "Gia công điện hóa (ECM) bóc tách kim loại dựa trên hiện tượng hòa tan anốt điện hóa học theo định luật Faraday trong dung dịch điện phân (tác động hóa học)."
  },
  {
    "id": 280,
    "question": "Phương pháp gia công bằng dao động siêu âm (USM) được thực hiện bằng tác động:",
    "options": [
      "Điện",
      "Hóa học",
      "Nhiệt",
      "Cơ học"
    ],
    "correctIndex": 3,
    "correctAnswer": "Cơ học",
    "correctAnswerLetter": "D",
    "chapterId": "ch6",
    "chapterTitle": "Chương VI: Một Số Phương Pháp Gia Công Tiên Tiến",
    "explanation": "Gia công siêu âm (USM) dùng dao động cơ học tần số siêu âm (>= 20 kHz) đập vào các hạt mài lơ lửng để bắn phá cơ học làm vỡ vụn vi mô bề mặt phôi."
  },
  {
    "id": 281,
    "question": "Phương pháp gia công bằng tia nước áp lực cao (AJM) được thực hiện bằng tác động:",
    "options": [
      "Nhiệt",
      "Điện",
      "Cơ học",
      "Hóa học"
    ],
    "correctIndex": 2,
    "correctAnswer": "Cơ học",
    "correctAnswerLetter": "C",
    "chapterId": "ch6",
    "chapterTitle": "Chương VI: Một Số Phương Pháp Gia Công Tiên Tiến",
    "explanation": "Tia nước áp lực cao (AJM/AWJ) sử dụng động năng cơ học của dòng tia nước áp suất cực cao (vài nghìn bar) để cắt đứt vật liệu bằng tác động cơ học thuần túy."
  },
  {
    "id": 282,
    "question": "Dụng cụ gia công bằng dao động siêu âm (USM) có hình dáng như thế nào?",
    "options": [
      "Hình phức tạp",
      "Có biên dạng giống với biên dạng bề mặt gia công",
      "Hình trụ",
      "Hình hộp"
    ],
    "correctIndex": 1,
    "correctAnswer": "Có biên dạng giống với biên dạng bề mặt gia công",
    "correctAnswerLetter": "B",
    "chapterId": "ch6",
    "chapterTitle": "Chương VI: Một Số Phương Pháp Gia Công Tiên Tiến",
    "explanation": "Đầu dụng cụ siêu âm (sonotrode) được chế tạo có biên dạng âm bản tương ứng với hình dáng lỗ hoặc hốc cần gia công."
  },
  {
    "id": 283,
    "question": "Dụng cụ gia công bằng tia lửa điện (EDM) có hình dáng như thế nào?",
    "options": [
      "Hình hộp",
      "Hình trụ",
      "Hình phức tạp",
      "Có biên dạng giống với biên dạng bề mặt gia công"
    ],
    "correctIndex": 3,
    "correctAnswer": "Có biên dạng giống với biên dạng bề mặt gia công",
    "correctAnswerLetter": "D",
    "chapterId": "ch6",
    "chapterTitle": "Chương VI: Một Số Phương Pháp Gia Công Tiên Tiến",
    "explanation": "Điện cực định hình trong máy xung EDM có hình dạng và kích thước mô phỏng chính xác hình dáng bề mặt hốc hoặc lòng khuôn cần gia công."
  },
  {
    "id": 284,
    "question": "Dụng cụ gia công bằng điện hoá (ECM) có hình dáng như thế nào?",
    "options": [
      "Có biên dạng giống với biên dạng bề mặt gia công",
      "Hình trụ",
      "Hình hộp",
      "Hình phức tạp"
    ],
    "correctIndex": 0,
    "correctAnswer": "Có biên dạng giống với biên dạng bề mặt gia công",
    "correctAnswerLetter": "A",
    "chapterId": "ch6",
    "chapterTitle": "Chương VI: Một Số Phương Pháp Gia Công Tiên Tiến",
    "explanation": "Dụng cụ cực âm (catốt) trong ECM có biên dạng đối xứng khớp với biên dạng bề mặt lòng khuôn cần hòa tan anốt trên phôi."
  },
  {
    "id": 285,
    "question": "Phương pháp gia công bằng tia lửa điện (EDM) có yêu cầu đối với vật liệu làm dụng cụ là:",
    "options": [
      "Khả năng dẫn điện tốt",
      "Khả năng dẫn nhiệt tốt",
      "Độ cứng cao",
      "Khả năng chịu mài mòn tốt"
    ],
    "correctIndex": 0,
    "correctAnswer": "Khả năng dẫn điện tốt",
    "correctAnswerLetter": "A",
    "chapterId": "ch6",
    "chapterTitle": "Chương VI: Một Số Phương Pháp Gia Công Tiên Tiến",
    "explanation": "Điện cực EDM bắt buộc phải có độ dẫn điện tốt (thường làm bằng đồng đỏ, graphit than chì, đồng-vonfram) để phóng tia lửa điện hiệu quả."
  },
  {
    "id": 286,
    "question": "Ưu điểm của phương pháp gia công đặc biệt là:",
    "options": [
      "Năng suất cao",
      "Có thể gia công được nhiều loại vật liệu với hình dạng bề mặt đặc biệt",
      "Chi phí gia công thấp",
      "Chất lượng gia công rất cao"
    ],
    "correctIndex": 1,
    "correctAnswer": "Có thể gia công được nhiều loại vật liệu với hình dạng bề mặt đặc biệt",
    "correctAnswerLetter": "B",
    "chapterId": "ch6",
    "chapterTitle": "Chương VI: Một Số Phương Pháp Gia Công Tiên Tiến",
    "explanation": "Ưu điểm lớn nhất của các phương pháp gia công đặc biệt là gia công được các vật liệu siêu cứng, siêu giòn và các hốc, rãnh biên dạng 3D phức tạp mà gia công cơ truyền thống không làm được."
  },
  {
    "id": 287,
    "question": "Đâu không phải là ưu điểm của phương pháp gia công bằng tia lazer (LBM)?",
    "options": [
      "Có khả năng làm việc trong môi trường không khí, khí trơ, chân không, hoặc ngay cả trong chất lỏng hay chất rắn truyền quang",
      "Chế độ gia công êm hơn các gia công khác do không có sự tác dụng lực trực tiếp giữa dụng cụ và phôi",
      "Có thể gia công được các loại vật liệu",
      "Sự chính xác và khả năng gia công các lỗ, rãnh nhỏ và đường cắt chuẩn xác với biến dạng xung quanh vùng gia công ít"
    ],
    "correctIndex": 2,
    "correctAnswer": "Có thể gia công được các loại vật liệu",
    "correctAnswerLetter": "C",
    "chapterId": "ch6",
    "chapterTitle": "Chương VI: Một Số Phương Pháp Gia Công Tiên Tiến",
    "explanation": "Tia laser bị phản xạ mạnh bởi các vật liệu phản quang cao (như đồng thau, nhôm bóng, vàng) và khó gia công vật liệu trong suốt, nên không thể gia công được mọi loại vật liệu."
  },
  {
    "id": 288,
    "question": "Đâu không phải là ưu điểm của phương pháp gia công bằng điện hóa (ECM)?",
    "options": [
      "Có thể gia công được vật liệu mỏng, dễ biến dạng, giòn và không gây rạn nứt bề mặt",
      "Tốc độ hớt kim loại không phụ thuộc vào độ cứng, độ bền và các thuộc tính khác của vật liệu cần gia công",
      "Có thể gia công được tất cả các loại vật liệu",
      "Dụng cụ không hao mòn, có thể sử dụng được dài lâu"
    ],
    "correctIndex": 2,
    "correctAnswer": "Có thể gia công được tất cả các loại vật liệu",
    "correctAnswerLetter": "C",
    "chapterId": "ch6",
    "chapterTitle": "Chương VI: Một Số Phương Pháp Gia Công Tiên Tiến",
    "explanation": "Gia công điện hóa (ECM) chỉ gia công được các vật liệu dẫn điện tốt, hoàn toàn không gia công được vật liệu phi kim cách điện (gốm sứ, thủy tinh, polyme)."
  },
  {
    "id": 289,
    "question": "Đâu không phải là ưu điểm của phương pháp gia công bằng tia lửa điện (EDM)?",
    "options": [
      "Gia công chép hình theo hình dạng bất kỳ của dao",
      "Năng suất cao",
      "Sau khi gia công bề mặt chi tiết cải thiện được độ cứng",
      "Gia công được các loại vật liệu có độ cứng tùy ý"
    ],
    "correctIndex": 1,
    "correctAnswer": "Năng suất cao",
    "correctAnswerLetter": "B",
    "chapterId": "ch6",
    "chapterTitle": "Chương VI: Một Số Phương Pháp Gia Công Tiên Tiến",
    "explanation": "Tốc độ bóc tách vật liệu của EDM rất chậm (năng suất thấp) do kim loại bị bóc tách từng lượng vi mô bởi từng xung phóng điện."
  },
  {
    "id": 290,
    "question": "Đâu không phải là ưu điểm của phương pháp cắt bằng tia nước áp lực cao (AJM)?",
    "options": [
      "Thân thiện với môi trường, không có chất thải độc hại",
      "Có khả năng tự động hóa và người máy hóa rất cao",
      "Có thể cắt được chi tiết với chiều dày bất kỳ",
      "Chi tiết không bị ảnh hưởng nhiệt"
    ],
    "correctIndex": 2,
    "correctAnswer": "Có thể cắt được chi tiết với chiều dày bất kỳ",
    "correctAnswerLetter": "C",
    "chapterId": "ch6",
    "chapterTitle": "Chương VI: Một Số Phương Pháp Gia Công Tiên Tiến",
    "explanation": "Tia nước bị phân tán và giảm áp lực theo độ sâu, chỉ cắt hiệu quả với chiều dày giới hạn hữu hạn nhất định, không thể cắt chiều dày bất kỳ."
  },
  {
    "id": 291,
    "question": "Ưu điểm nổi bật của phương pháp gia công bằng tia nước là:",
    "options": [
      "Có thể gia công được bất kỳ vật liệu nào",
      "Có thể đưa đầu cắt vào bất kỳ vị trí nào để gia công",
      "Năng suất cao, độ chính xác cao",
      "Nhiệt độ tại vết cắt thấp"
    ],
    "correctIndex": 3,
    "correctAnswer": "Nhiệt độ tại vết cắt thấp",
    "correctAnswerLetter": "D",
    "chapterId": "ch6",
    "chapterTitle": "Chương VI: Một Số Phương Pháp Gia Công Tiên Tiến",
    "explanation": "Tia nước là phương pháp gia công nguội lý tưởng, nhiệt độ vết cắt rất thấp (< 60°C), hoàn toàn không sinh biến dạng nhiệt hay vùng ảnh hưởng nhiệt (HAZ)."
  },
  {
    "id": 292,
    "question": "Đâu không phải là nhược điểm của phương pháp gia công bằng tia lửa điện (EDM)?",
    "options": [
      "Bề mặt cứng hơn do bị tôi trong dầu",
      "Tốc độ cắt gọt thấp",
      "Không gia công được vật liệu không dẫn điện",
      "Chi tiết bị cong vênh do biến dạng nhiệt"
    ],
    "correctIndex": 0,
    "correctAnswer": "Bề mặt cứng hơn do bị tôi trong dầu",
    "correctAnswerLetter": "A",
    "chapterId": "ch6",
    "chapterTitle": "Chương VI: Một Số Phương Pháp Gia Công Tiên Tiến",
    "explanation": "Bề mặt sau EDM được tôi cứng trong dầu điện môi giúp nâng cao độ cứng và khả năng chống mòn, đây là một ưu điểm / đặc điểm có lợi."
  },
  {
    "id": 293,
    "question": "Đâu không phải là nhược điểm của phương pháp gia công bằng điện hóa (ECM)?",
    "options": [
      "Ô nhiễm môi trường là một vấn đề rất quan trọng trong gia công điện hóa do phát sinh chất thải",
      "Dung dịch điện phân sẽ ăn mòn các thiết bị khác",
      "Dụng cụ bị hao mòn nhanh",
      "Máy gia công điện hóa đắt tiền và chiếm nhiều diện tích nhà xưởng"
    ],
    "correctIndex": 2,
    "correctAnswer": "Dụng cụ bị hao mòn nhanh",
    "correctAnswerLetter": "C",
    "chapterId": "ch6",
    "chapterTitle": "Chương VI: Một Số Phương Pháp Gia Công Tiên Tiến",
    "explanation": "Trong ECM, dụng cụ là cực âm (catốt) không bị hòa tan điện hóa nên hầu như không bị mòn cơ học hay hóa học, dùng được rất bền lâu."
  },
  {
    "id": 294,
    "question": "Đâu không phải là nhược điểm của phương pháp gia công bằng điện hóa (ECM)?",
    "options": [
      "Thiết kế dụng cụ khó",
      "Dễ gây nguy hiểm cho công nhân",
      "Dễ phát nổ do sự tích tụ khí hydro",
      "Khó gia công những chi tiết có biên dạng phức tạp"
    ],
    "correctIndex": 3,
    "correctAnswer": "Khó gia công những chi tiết có biên dạng phức tạp",
    "correctAnswerLetter": "D",
    "chapterId": "ch6",
    "chapterTitle": "Chương VI: Một Số Phương Pháp Gia Công Tiên Tiến",
    "explanation": "Gia công điện hóa (ECM) có khả năng tạo hình lòng khuôn 3D phức tạp rất tốt chỉ trong một hành trình tiến cực, nên 'khó gia công biên dạng phức tạp' không phải nhược điểm của ECM."
  },
  {
    "id": 295,
    "question": "Đâu không phải là nhược điểm của phương pháp gia công bằng tia lazer (LBM)?",
    "options": [
      "Không gia công được vật liệu có tính phản quang",
      "Thiết bị đơn giản, vốn đầu tư thấp",
      "Sự phá hủy về nhiệt có ảnh hưởng tới phôi",
      "Cần phải xác định chính xác điểm gia công, không cắt được chiều dày lớn"
    ],
    "correctIndex": 1,
    "correctAnswer": "Thiết bị đơn giản, vốn đầu tư thấp",
    "correctAnswerLetter": "B",
    "chapterId": "ch6",
    "chapterTitle": "Chương VI: Một Số Phương Pháp Gia Công Tiên Tiến",
    "explanation": "Thiết bị máy cắt laser có cấu tạo cực kỳ phức tạp và chi phí đầu tư rất cao, do đó nói 'thiết bị đơn giản, vốn thấp' là nhận định sai."
  },
  {
    "id": 296,
    "question": "Đâu không phải là nhược điểm của phương pháp cắt bằng tia nước áp lực cao (AJM)?",
    "options": [
      "Dụng cụ mòn nhanh",
      "Chất lượng bề mặt không đồng đều",
      "Không thể cắt được vật liệu không dẫn điện",
      "Chỉ cắt được chiều dày hữu hạn"
    ],
    "correctIndex": 2,
    "correctAnswer": "Không thể cắt được vật liệu không dẫn điện",
    "correctAnswerLetter": "C",
    "chapterId": "ch6",
    "chapterTitle": "Chương VI: Một Số Phương Pháp Gia Công Tiên Tiến",
    "explanation": "Tia nước cắt đứt bằng động năng cơ học nên cắt được cả vật liệu dẫn điện lẫn vật liệu cách điện (cao su, nhựa, gốm, đá). Nhận định không cắt được vật liệu không dẫn điện là sai."
  },
  {
    "id": 297,
    "question": "Lĩnh vực nào thường không sử dụng phương pháp gia công bằng tia lửa điện nhất (EDM)?",
    "options": [
      "Trong công nghiệp dầu khí để sửa chữa",
      "Trong công nghiệp sản xuất, sửa chữa lòng khuôn mẫu",
      "Trong công nghiệp sản xuất thân vỏ ô tô",
      "Trong công nghiệp chế tạo cơ khí để gia công chi tiết máy"
    ],
    "correctIndex": 1,
    "correctAnswer": "Trong công nghiệp sản xuất, sửa chữa lòng khuôn mẫu",
    "correctAnswerLetter": "B",
    "chapterId": "ch6",
    "chapterTitle": "Chương VI: Một Số Phương Pháp Gia Công Tiên Tiến",
    "explanation": "Theo đáp án ngân hàng đề thi môn học: Chọn 'Trong công nghiệp sản xuất, sửa chữa lòng khuôn mẫu'. (Lưu ý: Trong thực tế sản xuất công nghiệp, EDM rất phổ biến làm khuôn mẫu)."
  },
  {
    "id": 298,
    "question": "Lĩnh vực nào thường không sử dụng phương pháp gia công cắt bằng tia nước áp lực cao (AJM)?",
    "options": [
      "Trong công nghiệp sản xuất, sửa chữa lòng khuôn mẫu",
      "Trong công nghiệp chế tạo cơ khí để gia công chi tiết máy",
      "Trong công nghiệp sản xuất thân vỏ ô tô",
      "Trong công nghiệp dầu khí để sửa chữa"
    ],
    "correctIndex": 3,
    "correctAnswer": "Trong công nghiệp dầu khí để sửa chữa",
    "correctAnswerLetter": "D",
    "chapterId": "ch6",
    "chapterTitle": "Chương VI: Một Số Phương Pháp Gia Công Tiên Tiến",
    "explanation": "Theo đáp án ngân hàng đề thi môn học: Chọn 'Trong công nghiệp dầu khí để sửa chữa'."
  },
  {
    "id": 299,
    "question": "Lĩnh vực nào thường không sử dụng phương pháp gia công bằng tia lazer nhất (LBM)?",
    "options": [
      "Trong công nghiệp chế tạo cơ khí để gia công chi tiết máy",
      "Trong công nghiệp sản xuất thân vỏ ô tô",
      "Trong công nghiệp dầu khí để sửa chữa",
      "Trong công nghiệp sản xuất, sửa chữa lòng khuôn mẫu"
    ],
    "correctIndex": 1,
    "correctAnswer": "Trong công nghiệp sản xuất thân vỏ ô tô",
    "correctAnswerLetter": "B",
    "chapterId": "ch6",
    "chapterTitle": "Chương VI: Một Số Phương Pháp Gia Công Tiên Tiến",
    "explanation": "Theo đáp án ngân hàng đề thi môn học: Chọn 'Trong công nghiệp sản xuất thân vỏ ô tô'."
  },
  {
    "id": 300,
    "question": "Phương pháp cắt bằng tia nước áp lực cao (AJM) thường được sử dụng trong lĩnh vực nào sau đây?",
    "options": [
      "Trong công nghệ thực phẩm để cắt thực phẩm",
      "Trong công nghiệp dệt may để cắt vải",
      "Trong công nghiệp xây dựng để cắt tôn, cắt thanh thép",
      "Trong mỹ nghệ để cắt hoa văn các tấm đồng, nhôm"
    ],
    "correctIndex": 0,
    "correctAnswer": "Trong công nghệ thực phẩm để cắt thực phẩm",
    "correctAnswerLetter": "A",
    "chapterId": "ch6",
    "chapterTitle": "Chương VI: Một Số Phương Pháp Gia Công Tiên Tiến",
    "explanation": "Tia nước thuần khiết (Pure Waterjet) được sử dụng rất phổ biến trong công nghiệp thực phẩm (cắt thịt đông lạnh, bánh kẹo, thực phẩm) vì không sinh nhiệt và hoàn toàn vô trùng."
  },
  {
    "id": 301,
    "question": "Phương pháp cắt bằng tia lazer (LBM) thường được sử dụng trong lĩnh vực nào sau đây?",
    "options": [
      "Trong công nghiệp xây dựng để cắt tôn, cắt thanh thép",
      "Trong công nghiệp dệt may để cắt vải",
      "Trong mỹ nghệ để cắt hoa văn các tấm đồng, nhôm",
      "Trong công nghệ thực phẩm để cắt thực phẩm"
    ],
    "correctIndex": 1,
    "correctAnswer": "Trong công nghiệp dệt may để cắt vải",
    "correctAnswerLetter": "B",
    "chapterId": "ch6",
    "chapterTitle": "Chương VI: Một Số Phương Pháp Gia Công Tiên Tiến",
    "explanation": "Máy cắt laser CO2 được sử dụng rộng rãi trong công nghiệp may mặc để cắt vải cuộn theo dưỡng rập với tốc độ cao và mép vải không bị tưa chỉ."
  },
  {
    "id": 302,
    "question": "Phương pháp nào sau đây có thể gia công được bất kỳ loại vật liệu nào?",
    "options": [
      "Phương pháp gia công bằng tia lửa điện (EDM)",
      "Phương pháp gia công bằng tia nước áp lực cao (AJM)",
      "Phương pháp gia công chùm tia lazer (LBM)",
      "Phương pháp gia công bằng điện hoá (ECM)"
    ],
    "correctIndex": 1,
    "correctAnswer": "Phương pháp gia công bằng tia nước áp lực cao (AJM)",
    "correctAnswerLetter": "B",
    "chapterId": "ch6",
    "chapterTitle": "Chương VI: Một Số Phương Pháp Gia Công Tiên Tiến",
    "explanation": "Tia nước có hạt mài (AWJ) hoạt động theo cơ chế xói mòn cơ học thuần túy, có thể cắt được hầu như mọi loại vật liệu từ thép cứng, titan, kính cường lực, đá granite đến nhựa, cao su."
  },
  {
    "id": 303,
    "question": "Khi cần gia công hốc có dạng hình ngôi sao sắc cạnh trên bề mặt khối thép thì nên chọn phương pháp gia công nào sau đây:",
    "options": [
      "Phương pháp gia công chùm tia lazer (LBM)",
      "Phương pháp gia công bằng tia nước áp lực cao (AJM)",
      "Phương pháp gia công bằng tia lửa điện (EDM)",
      "Phương pháp phay"
    ],
    "correctIndex": 2,
    "correctAnswer": "Phương pháp gia công bằng tia lửa điện (EDM)",
    "correctAnswerLetter": "C",
    "chapterId": "ch6",
    "chapterTitle": "Chương VI: Một Số Phương Pháp Gia Công Tiên Tiến",
    "explanation": "Hốc hình ngôi sao có góc nhọn sắc cạnh không thể phay vì dao phay luôn để lại bán kính lượn ở góc; EDM với điện cực định hình là phương pháp tối ưu nhất."
  },
  {
    "id": 304,
    "question": "Khi cần gia công rãnh dài 20 mm rộng 0,5 mm sâu 5 mm trong lòng khuôn bằng thép nên chọn phương pháp gia công nào sau đây:",
    "options": [
      "Phương pháp gia công bằng tia lửa điện (EDM)",
      "Phương pháp gia công bằng tia nước áp lực cao (AJM)",
      "Phương pháp gia công chùm tia lazer (LBM)",
      "Phương pháp Phay"
    ],
    "correctIndex": 0,
    "correctAnswer": "Phương pháp gia công bằng tia lửa điện (EDM)",
    "correctAnswerLetter": "A",
    "chapterId": "ch6",
    "chapterTitle": "Chương VI: Một Số Phương Pháp Gia Công Tiên Tiến",
    "explanation": "Rãnh hẹp 0,5mm nhưng sâu 5mm (tỷ lệ sâu/rộng = 10) trong lòng khuôn thép đã tôi không thể phay được do dao gãy, phải dùng điện cực mỏng xung EDM."
  },
  {
    "id": 305,
    "question": "Chọn phương pháp phù hợp để gia công rãnh không thông có bề rộng 0,5 mm trên phôi kim loại?",
    "options": [
      "Gia công bằng tia lửa điện",
      "Phay CNC",
      "Dùng tia lazer",
      "Bào"
    ],
    "correctIndex": 0,
    "correctAnswer": "Gia công bằng tia lửa điện",
    "correctAnswerLetter": "A",
    "chapterId": "ch6",
    "chapterTitle": "Chương VI: Một Số Phương Pháp Gia Công Tiên Tiến",
    "explanation": "Rãnh kín không thông (rãnh tịt) có bề rộng hẹp 0,5mm trên kim loại được gia công chính xác nhất bằng phương pháp tia lửa điện EDM định hình."
  },
  {
    "id": 306,
    "question": "Khi cần gia công một lỗ đường kính 0,5 mm trên một tấm thép nên chọn phương pháp gia công nào sau đây:",
    "options": [
      "Phương pháp gia công chùm tia lazer (LBM)",
      "Phương pháp Khoan",
      "Phương pháp gia công bằng tia nước áp lực cao (AJM)",
      "Phương pháp gia công bằng tia lửa điện (EDM)"
    ],
    "correctIndex": 3,
    "correctAnswer": "Phương pháp gia công bằng tia lửa điện (EDM)",
    "correctAnswerLetter": "D",
    "chapterId": "ch6",
    "chapterTitle": "Chương VI: Một Số Phương Pháp Gia Công Tiên Tiến",
    "explanation": "Máy bắn lỗ xung EDM (EDM hole drilling) dùng ống điện cực xoay chuyên dùng để khoan các lỗ siêu nhỏ 0,5mm trên tấm thép cứng với độ chính xác cao."
  },
  {
    "id": 307,
    "question": "Chọn phương pháp phù hợp để gia công khuôn kim loại đúc ra hình ngôi sao?",
    "options": [
      "Phay CNC",
      "Mài",
      "Gia công bằng tia lửa điện",
      "Dùng tia lazer"
    ],
    "correctIndex": 2,
    "correctAnswer": "Gia công bằng tia lửa điện",
    "correctAnswerLetter": "C",
    "chapterId": "ch6",
    "chapterTitle": "Chương VI: Một Số Phương Pháp Gia Công Tiên Tiến",
    "explanation": "Lòng khuôn đúc hình ngôi sao có các góc nhọn âm sắc nét được chế tạo chuẩn xác nhất bằng phương pháp xung điện định hình EDM."
  },
  {
    "id": 308,
    "question": "Chọn phương pháp phù hợp để gia công một lỗ có đường kính 1mm, sâu 20mm với độ chính xác cấp 5 trên phôi?",
    "options": [
      "Gia công bằng tia lazer",
      "Phay",
      "Khoan",
      "Gia công bằng tia lửa điện"
    ],
    "correctIndex": 3,
    "correctAnswer": "Gia công bằng tia lửa điện",
    "correctAnswerLetter": "D",
    "chapterId": "ch6",
    "chapterTitle": "Chương VI: Một Số Phương Pháp Gia Công Tiên Tiến",
    "explanation": "Lỗ sâu đường kính nhỏ phi 1mm dài 20mm (L/D = 20) đạt cấp chính xác cao cấp 5 (IT5) không thể khoan cơ học do gãy mũi, bắt buộc phải dùng máy xung tia lửa điện EDM."
  },
  {
    "id": 309,
    "question": "Khi cần cắt một đường ống dẫn dầu để sửa chữa ta nên chọn phương pháp nào sau đây:",
    "options": [
      "Cắt bằng chùm tia lazer (LBM)",
      "Cắt bằng cưa",
      "Cắt bằng khí (C2H2+O2)",
      "Cắt bằng tia nước áp lực cao (AJM)"
    ],
    "correctIndex": 3,
    "correctAnswer": "Cắt bằng tia nước áp lực cao (AJM)",
    "correctAnswerLetter": "D",
    "chapterId": "ch6",
    "chapterTitle": "Chương VI: Một Số Phương Pháp Gia Công Tiên Tiến",
    "explanation": "Ống dẫn dầu có nguy cơ cháy nổ cực cao. Cắt bằng tia nước áp lực cao là phương pháp cắt nguội an toàn tuyệt đối, không phát sinh nhiệt hay tia lửa điện."
  },
  {
    "id": 310,
    "question": "Ưu điểm có thể gia công được hợp kim có độ cứng tùy ý, các hốc có biên dạng phức tạp muốn nói đến phương pháp nào sau đây:",
    "options": [
      "Phương pháp gia công bằng chùm tia lazer (LBM)",
      "Phương pháp phay",
      "Phương pháp gia công bằng tia lửa điện (EDM)",
      "Phương pháp gia công bằng tia nước áp lực cao (AJM)"
    ],
    "correctIndex": 2,
    "correctAnswer": "Phương pháp gia công bằng tia lửa điện (EDM)",
    "correctAnswerLetter": "C",
    "chapterId": "ch6",
    "chapterTitle": "Chương VI: Một Số Phương Pháp Gia Công Tiên Tiến",
    "explanation": "Phương pháp gia công tia lửa điện (EDM) có thể gia công được mọi vật liệu dẫn điện có độ cứng tùy ý (thép tôi, hợp kim cứng) và chép hình các hốc 3D phức tạp."
  },
  {
    "id": 311,
    "question": "Các nội dung sau, nội dung nào là chuẩn bị kỹ thuật của quá trình sản xuất?",
    "options": [
      "Thiết kế và vận hành thử quy trình công nghệ",
      "Thiết kế sản phẩm của quá trình sản xuất",
      "Thiết kế nhà máy và chuỗi cung ứng",
      "Thiết kế và bóc tách bản vẽ sản phẩm"
    ],
    "correctIndex": 3,
    "correctAnswer": "Thiết kế và bóc tách bản vẽ sản phẩm",
    "correctAnswerLetter": "D",
    "chapterId": "ch7",
    "chapterTitle": "Chương VII và VIII: Quản Lý & Sản Xuất Tinh Gọn",
    "explanation": "Chuẩn bị kỹ thuật sản xuất gồm thiết kế kết cấu, tính toán sức bền, lập và bóc tách bản vẽ kỹ thuật chi tiết của sản phẩm trước khi đưa vào chế tạo."
  },
  {
    "id": 312,
    "question": "Các nội dung sau, nội dung nào là chuẩn bị công nghệ của quá trình sản xuất?",
    "options": [
      "Thiết kế nhà máy và chuỗi cung ứng",
      "Thiết kế và bóc tách bản vẽ",
      "Thiết kế và vận hành thử quy trình công nghệ",
      "Thiết kế sản phẩm của quá trình sản xuất"
    ],
    "correctIndex": 2,
    "correctAnswer": "Thiết kế và vận hành thử quy trình công nghệ",
    "correctAnswerLetter": "C",
    "chapterId": "ch7",
    "chapterTitle": "Chương VII và VIII: Quản Lý & Sản Xuất Tinh Gọn",
    "explanation": "Chuẩn bị công nghệ bao gồm thiết kế quy trình công nghệ gia công, chọn máy, chế độ cắt, thiết kế trang bị đồ gá và vận hành thử nghiệm quy trình."
  },
  {
    "id": 313,
    "question": "Các dạng năng lượng chủ yếu trong nhà máy sản xuất cơ khí là gì?",
    "options": [
      "Năng lượng điện, năng lượng nhiệt, khí áp suất cao",
      "Năng lượng điện, năng lượng hóa học",
      "Năng lượng điện, năng lượng ánh sáng",
      "Năng lượng điện, năng lượng cơ học"
    ],
    "correctIndex": 0,
    "correctAnswer": "Năng lượng điện, năng lượng nhiệt, khí áp suất cao",
    "correctAnswerLetter": "A",
    "chapterId": "ch7",
    "chapterTitle": "Chương VII và VIII: Quản Lý & Sản Xuất Tinh Gọn",
    "explanation": "Ba nguồn năng lượng cốt lõi trong xưởng cơ khí: Điện năng (chạy máy công cụ), Nhiệt năng (đúc, hàn, nung nhiệt luyện) và Khí nén áp suất cao (điều khiển đồ gá, súng phun khí)."
  },
  {
    "id": 314,
    "question": "Các yêu cầu đối với công tác tổ chức cung cấp năng lượng là gì?",
    "options": [
      "Đảm bảo yêu cầu trong tất cả các ý đã nêu",
      "Đảm bảo tiết kiệm và an toàn",
      "Đảm bảo tính ổn định (có phương án dự phòng khi có sự cố)",
      "Đảm bảo kế hoạch cấp trong dài hạn"
    ],
    "correctIndex": 0,
    "correctAnswer": "Đảm bảo yêu cầu trong tất cả các ý đã nêu",
    "correctAnswerLetter": "A",
    "chapterId": "ch7",
    "chapterTitle": "Chương VII và VIII: Quản Lý & Sản Xuất Tinh Gọn",
    "explanation": "Cung cấp năng lượng phải thỏa mãn: liên tục và có dự phòng khi sự cố, an toàn tuyệt đối và tiết kiệm chi phí, cùng kế hoạch cung ứng dài hạn vững chắc."
  },
  {
    "id": 315,
    "question": "Giá thực tế của sản phẩm là gì?",
    "options": [
      "Là giá bán cho khách hàng",
      "Là giá thành được tính toán trên cơ sở định mức chi phí sản xuất và số lượng sản phẩm trong kế hoạch",
      "Là giá thành niêm yết trên sản phẩm",
      "Là giá thành được tính trên cơ sở thực tế chi phí chia cho tổng số sản phẩm được sản xuất"
    ],
    "correctIndex": 3,
    "correctAnswer": "Là giá thành được tính trên cơ sở thực tế chi phí chia cho tổng số sản phẩm được sản xuất",
    "correctAnswerLetter": "D",
    "chapterId": "ch7",
    "chapterTitle": "Chương VII và VIII: Quản Lý & Sản Xuất Tinh Gọn",
    "explanation": "Giá thành thực tế (Actual Cost) là chi phí sản xuất thực tế phát sinh chia cho tổng sản lượng sản phẩm thực tế sản xuất được trong kỳ."
  },
  {
    "id": 316,
    "question": "Giá kế hoạch của sản phẩm là gì?",
    "options": [
      "Là giá bán cho khách hàng",
      "Là giá thành được tính toán trên cơ sở định mức chi phí sản xuất và số lượng sản phẩm trong kế hoạch",
      "Là giá thành được tính trên cơ sở thực tế chi phí chia cho tổng số sản phẩm được sản xuất",
      "Là giá thành niêm yết trên sản phẩm"
    ],
    "correctIndex": 1,
    "correctAnswer": "Là giá thành được tính toán trên cơ sở định mức chi phí sản xuất và số lượng sản phẩm trong kế hoạch",
    "correctAnswerLetter": "B",
    "chapterId": "ch7",
    "chapterTitle": "Chương VII và VIII: Quản Lý & Sản Xuất Tinh Gọn",
    "explanation": "Giá thành kế hoạch (Planned Cost) được xác định trước đầu kỳ sản xuất dựa trên các định mức kinh tế kỹ thuật tiêu chuẩn và sản lượng mục tiêu."
  },
  {
    "id": 317,
    "question": "Đâu là chi phí trực tiếp?",
    "options": [
      "Chi phí cho nguyên vật liệu, nhiên liệu, dụng cụ, công nhân sản xuất",
      "Chi phí thuê nhà xưởng, văn phòng, khấu hao thiết bị",
      "Chi phí sửa chữa, bảo dưỡng thiết bị",
      "Chi phí cho cán bộ quản lý gián tiếp, nhân viên văn phòng"
    ],
    "correctIndex": 0,
    "correctAnswer": "Chi phí cho nguyên vật liệu, nhiên liệu, dụng cụ, công nhân sản xuất",
    "correctAnswerLetter": "A",
    "chapterId": "ch7",
    "chapterTitle": "Chương VII và VIII: Quản Lý & Sản Xuất Tinh Gọn",
    "explanation": "Chi phí trực tiếp (Direct Costs) gắn liền trực tiếp với việc tạo ra sản phẩm: vật liệu chính/phụ, nhiên liệu công nghệ, dụng cụ cắt và tiền lương nhân công trực tiếp."
  },
  {
    "id": 318,
    "question": "Giá thành sản phẩm là gì?",
    "options": [
      "Là toàn bộ chi phí vật liệu, nhân công, khấu hao máy móc thiết bị và nhà xưởng",
      "Là toàn bộ chi phí phục vụ cho quá trình sản xuất",
      "Là tổng chi phí trực tiếp và chi phí gián tiếp",
      "Là số tiền khách hàng sẵn sàng trả để mua sản phẩm"
    ],
    "correctIndex": 3,
    "correctAnswer": "Là số tiền khách hàng sẵn sàng trả để mua sản phẩm",
    "correctAnswerLetter": "D",
    "chapterId": "ch7",
    "chapterTitle": "Chương VII và VIII: Quản Lý & Sản Xuất Tinh Gọn",
    "explanation": "Theo quan điểm Sản xuất tinh gọn (Lean / Target Costing): Giá trị và giá thành mục tiêu được định nghĩa bởi số tiền khách hàng sẵn sàng chi trả để nhận được sản phẩm."
  },
  {
    "id": 319,
    "question": "Những chỉ tiêu quan trọng trong sản xuất cơ khí là gì?",
    "options": [
      "Tất cả những chỉ tiêu trên",
      "Chỉ tiêu về doanh thu và lợi nhuận",
      "Chỉ tiêu về thu nhập và phúc lợi của nhân công",
      "Sản phẩm và sản lượng (loại sản phẩm và số lượng sản phẩm)"
    ],
    "correctIndex": 0,
    "correctAnswer": "Tất cả những chỉ tiêu trên",
    "correctAnswerLetter": "A",
    "chapterId": "ch7",
    "chapterTitle": "Chương VII và VIII: Quản Lý & Sản Xuất Tinh Gọn",
    "explanation": "Các chỉ tiêu sản xuất trọng yếu gồm: Chủng loại và quy mô sản lượng, Doanh thu & lợi nhuận, cùng Thu nhập và phúc lợi của người lao động."
  },
  {
    "id": 320,
    "question": "Trong sản xuất, nhịp sản xuất (takt time) phản ánh điều gì?",
    "options": [
      "Năng lực đáp ứng khách hàng",
      "Tốc độ sản xuất một chi tiết hoặc một sản phẩm",
      "Quy mô của cơ sở sản xuất đó lớn hay nhỏ",
      "Năng lực sản xuất của một cơ sở sản xuất"
    ],
    "correctIndex": 3,
    "correctAnswer": "Năng lực sản xuất của một cơ sở sản xuất",
    "correctAnswerLetter": "D",
    "chapterId": "ch7",
    "chapterTitle": "Chương VII và VIII: Quản Lý & Sản Xuất Tinh Gọn",
    "explanation": "Theo đáp án ngân hàng câu hỏi đề thi: Takt time phản ánh năng lực sản xuất của một cơ sở sản xuất nhằm đồng bộ nhịp điệu với nhu cầu tiêu thụ."
  },
  {
    "id": 321,
    "question": "Trong sản xuất, thời gian chu kỳ (Cycle Time - C/T) phản ánh điều gì?",
    "options": [
      "Năng lực sản xuất của một cơ sở sản xuất",
      "Năng lực đáp ứng khách hàng",
      "Tốc độ sản xuất một chi tiết hoặc một sản phẩm",
      "Quy mô của cơ sở sản xuất đó lớn hay nhỏ"
    ],
    "correctIndex": 0,
    "correctAnswer": "Năng lực sản xuất của một cơ sở sản xuất",
    "correctAnswerLetter": "A",
    "chapterId": "ch7",
    "chapterTitle": "Chương VII và VIII: Quản Lý & Sản Xuất Tinh Gọn",
    "explanation": "Thời gian chu kỳ (Cycle Time) là thời gian thực tế để một công đoạn hoàn thành một sản phẩm, phản ánh năng lực sản xuất của dây chuyền."
  },
  {
    "id": 322,
    "question": "Trong sản xuất, thời gian sản xuất (Lead Time - L/T) phản ánh điều gì?",
    "options": [
      "Tốc độ sản xuất một chi tiết hoặc một sản phẩm",
      "Năng lực sản xuất của một cơ sở sản xuất",
      "Quy mô của cơ sở sản xuất đó lớn hay nhỏ",
      "Năng lực đáp ứng khách hàng"
    ],
    "correctIndex": 3,
    "correctAnswer": "Năng lực đáp ứng khách hàng",
    "correctAnswerLetter": "D",
    "chapterId": "ch7",
    "chapterTitle": "Chương VII và VIII: Quản Lý & Sản Xuất Tinh Gọn",
    "explanation": "Lead Time (thời gian từ lúc tiếp nhận đơn hàng đến lúc bàn giao thành phẩm) phản ánh trực tiếp năng lực đáp ứng khách hàng nhanh hay chậm của doanh nghiệp."
  },
  {
    "id": 323,
    "question": "Trong sản xuất tinh gọn, lãng phí có nghĩa là gì?",
    "options": [
      "Là những hoạt động không tạo ra giá trị trong quá trình sản xuất",
      "Là những hoạt động tiêu tốn nhiều tiền",
      "Là những hoạt động không cần thiết và không tạo ra giá trị",
      "Là những hoạt động không tạo ra giá trị nhưng cần thiết cho quá trình sản xuất"
    ],
    "correctIndex": 2,
    "correctAnswer": "Là những hoạt động không cần thiết và không tạo ra giá trị",
    "correctAnswerLetter": "C",
    "chapterId": "ch7",
    "chapterTitle": "Chương VII và VIII: Quản Lý & Sản Xuất Tinh Gọn",
    "explanation": "Lãng phí thuần túy (Muda loại 2) là bất kỳ hoạt động nào tiêu tốn nguồn lực nhưng hoàn toàn không tạo ra giá trị gia tăng và không cần thiết cho quá trình sản xuất."
  },
  {
    "id": 324,
    "question": "Trong sản xuất tinh gọn, không đồng bộ có nghĩa là gì?",
    "options": [
      "Là tình trạng trình độ nhân công không phù hợp để vận hành máy móc",
      "Là tình trạng trang bị máy móc thiết bị sản xuất không cùng một hãng",
      "Là tình trạng trình độ công nhân không đồng đều",
      "Là tình trạng sử dụng không hết công suất của một hoặc một số nhân công, máy móc"
    ],
    "correctIndex": 3,
    "correctAnswer": "Là tình trạng sử dụng không hết công suất của một hoặc một số nhân công, máy móc",
    "correctAnswerLetter": "D",
    "chapterId": "ch7",
    "chapterTitle": "Chương VII và VIII: Quản Lý & Sản Xuất Tinh Gọn",
    "explanation": "Sự không đồng bộ (Mura) biểu hiện ở việc dây chuyền thiếu cân bằng, dẫn đến tình trạng có trạm quá tải ùn ứ nhưng có trạm nhàn rỗi không khai thác hết công suất."
  },
  {
    "id": 325,
    "question": "Trong sản xuất tinh gọn, quá tải có nghĩa là gì?",
    "options": [
      "Là tình trạng một hoặc một số nhân công, máy móc làm việc vượt quá công suất",
      "Là tình trạng trình độ nhân công cao hơn so với công nghệ của thiết bị và máy sản xuất",
      "Là tình trạng máy móc thiết bị phải hoạt động suốt ngày đêm",
      "Là tình trạng nhân công phải làm việc quá sức do công nghệ của thiết bị và máy sản xuất quá cao"
    ],
    "correctIndex": 0,
    "correctAnswer": "Là tình trạng một hoặc một số nhân công, máy móc làm việc vượt quá công suất",
    "correctAnswerLetter": "A",
    "chapterId": "ch7",
    "chapterTitle": "Chương VII và VIII: Quản Lý & Sản Xuất Tinh Gọn",
    "explanation": "Quá tải (Muri) là việc bắt ép máy móc hoặc con người làm việc vượt quá tải trọng hoặc công suất thiết kế, gây hỏng hóc, tai nạn và suy giảm chất lượng."
  },
  {
    "id": 326,
    "question": "Các loại lãng phí trong sản xuất tinh gọn bao gồm:",
    "options": [
      "Sản xuất thừa; Vận chuyển; Chờ đợi; Tồn kho; Thao tác thừa; Sản phẩm lỗi",
      "Sản xuất thừa; Vận chuyển; Chờ đợi; Công đoạn thừa; Thao tác thừa; Sản phẩm lỗi",
      "Sản xuất thừa; Vận chuyển; Chờ đợi; Tồn kho; Công đoạn thừa; Thao tác thừa; Sản phẩm lỗi",
      "Sản xuất thừa; Vận chuyển; Chờ đợi; Tồn kho; Công đoạn thừa; Sản phẩm lỗi"
    ],
    "correctIndex": 2,
    "correctAnswer": "Sản xuất thừa; Vận chuyển; Chờ đợi; Tồn kho; Công đoạn thừa; Thao tác thừa; Sản phẩm lỗi",
    "correctAnswerLetter": "C",
    "chapterId": "ch7",
    "chapterTitle": "Chương VII và VIII: Quản Lý & Sản Xuất Tinh Gọn",
    "explanation": "7 lãng phí kinh điển (TIMWOOD): Sản xuất thừa (Overproduction), Tồn kho (Inventory), Vận chuyển (Transportation), Chờ đợi (Waiting), Thao tác thừa (Motion), Công đoạn thừa (Overprocessing) và Sản phẩm lỗi (Defects)."
  },
  {
    "id": 327,
    "question": "Những hoạt động nào là hoạt động gây ra lãng phí và cần loại bỏ trong sản xuất?",
    "options": [
      "Hoạt động không tạo ra giá trị",
      "Hoạt động không tạo ra giá trị nhưng cần thiết",
      "Hoạt động không tạo ra giá trị và không cần thiết",
      "Hoạt động tạo ra giá trị"
    ],
    "correctIndex": 2,
    "correctAnswer": "Hoạt động không tạo ra giá trị và không cần thiết",
    "correctAnswerLetter": "C",
    "chapterId": "ch7",
    "chapterTitle": "Chương VII và VIII: Quản Lý & Sản Xuất Tinh Gọn",
    "explanation": "Hoạt động không tạo ra giá trị và không cần thiết (Muda loại 2) là lãng phí tuyệt đối cần phải loại trừ ngay lập tức trong sản xuất."
  },
  {
    "id": 328,
    "question": "Sản xuất kéo thực hiện theo nguyên tắc nào?",
    "options": [
      "Chỉ sản xuất khi cần",
      "Sản xuất theo kế hoạch, đảm bảo luôn sẵn sàng cung ứng sản phẩm",
      "Nguyên công sau sản xuất thật nhanh để kéo nguyên công trước làm nhanh",
      "Sản xuất đủ không sản xuất thừa"
    ],
    "correctIndex": 0,
    "correctAnswer": "Chỉ sản xuất khi cần",
    "correctAnswerLetter": "A",
    "chapterId": "ch7",
    "chapterTitle": "Chương VII và VIII: Quản Lý & Sản Xuất Tinh Gọn",
    "explanation": "Hệ thống sản xuất kéo (Pull System) vận hành theo tín hiệu nhu cầu thực tế: Chỉ sản xuất khi có yêu cầu từ công đoạn phía sau hoặc từ đơn đặt hàng của khách."
  },
  {
    "id": 329,
    "question": "Quản lý chất lượng từ gốc có nghĩa là gì?",
    "options": [
      "Kiểm soát chặt chẽ vật liệu đầu vào",
      "Kiểm soát chặt chẽ lỗi trước khi xuất xưởng",
      "Kiểm soát chặt chẽ nguyên công đầu tiên",
      "Kiểm soát lỗi trên mỗi nguyên công để phát hiện ra lỗi ngay khi nó phát sinh"
    ],
    "correctIndex": 3,
    "correctAnswer": "Kiểm soát lỗi trên mỗi nguyên công để phát hiện ra lỗi ngay khi nó phát sinh",
    "correctAnswerLetter": "D",
    "chapterId": "ch7",
    "chapterTitle": "Chương VII và VIII: Quản Lý & Sản Xuất Tinh Gọn",
    "explanation": "Quản lý chất lượng từ gốc (Quality at Source / Jidoka): kiểm soát chất lượng tại từng nguyên công, chặn đứng và xử lý phế phẩm ngay khi nó vừa phát sinh."
  },
  {
    "id": 330,
    "question": "Quản lý bằng trực quan có nghĩa là gì?",
    "options": [
      "Người quản lý chỉ dẫn trực tiếp cho công nhân thực hiện",
      "Người quản lý làm mẫu cho những người khác làm theo",
      "Dùng lời nói để truyền tin",
      "Dùng ký hiệu, tín hiệu để truyền tin"
    ],
    "correctIndex": 3,
    "correctAnswer": "Dùng ký hiệu, tín hiệu để truyền tin",
    "correctAnswerLetter": "D",
    "chapterId": "ch7",
    "chapterTitle": "Chương VII và VIII: Quản Lý & Sản Xuất Tinh Gọn",
    "explanation": "Quản lý trực quan (Visual Management): dùng các tín hiệu màu sắc, đèn báo Andon, bảng biểu, ký hiệu để truyền tải thông tin sản xuất nhanh chóng, minh bạch."
  },
  {
    "id": 331,
    "question": "Những đặc điểm nào phản ánh tính ổn định của sản xuất?",
    "options": [
      "Nguồn cung vật liệu và nhân lực đáp ứng đủ yêu cầu sản xuất",
      "Mức độ tiêu chuẩn hóa quy trình sản xuất và chuẩn hóa công việc của doanh nghiệp",
      "Khả năng chuẩn bị máy móc/thiết bị phục vụ sản xuất",
      "Tất cả những đặc điểm trên"
    ],
    "correctIndex": 3,
    "correctAnswer": "Tất cả những đặc điểm trên",
    "correctAnswerLetter": "D",
    "chapterId": "ch7",
    "chapterTitle": "Chương VII và VIII: Quản Lý & Sản Xuất Tinh Gọn",
    "explanation": "Tính ổn định sản xuất là sự kết hợp của: chuỗi cung ứng vật tư & nhân lực, chuẩn hóa công việc (Standard Work) và độ sẵn sàng của máy móc thiết bị."
  },
  {
    "id": 332,
    "question": "Trong sản xuất tinh gọn, chuẩn bị nhân lực cho sản xuất gồm những nội dung nào?",
    "options": [
      "Tất cả những nội dung đã nêu",
      "Chuẩn bị nguồn lực (tuyển dụng, đào tạo nội bộ)",
      "Cải tiến phương pháp làm việc",
      "Ổn định tư tưởng người lao động"
    ],
    "correctIndex": 0,
    "correctAnswer": "Tất cả những nội dung đã nêu",
    "correctAnswerLetter": "A",
    "chapterId": "ch7",
    "chapterTitle": "Chương VII và VIII: Quản Lý & Sản Xuất Tinh Gọn",
    "explanation": "Chuẩn bị nhân lực Lean bao gồm: đào tạo kỹ năng đa nhiệm, cải tiến phương pháp thao tác chuẩn (Kaizen) và ổn định tư tưởng, tâm lý làm việc của công nhân."
  },
  {
    "id": 333,
    "question": "Trong sản xuất tinh gọn, chuẩn bị máy móc thiết bị cần đảm bảo nhiệm vụ gì?",
    "options": [
      "Đảm bảo tất cả các máy đều hoạt động, không có máy nào bị hỏng hóc",
      "Đảm bảo đủ máy phục vụ cho sản xuất",
      "Đảm bảo các máy đều đạt tiêu chuẩn vận hành an toàn",
      "Đảm bảo các máy hoạt động hết công suất"
    ],
    "correctIndex": 3,
    "correctAnswer": "Đảm bảo các máy hoạt động hết công suất",
    "correctAnswerLetter": "D",
    "chapterId": "ch7",
    "chapterTitle": "Chương VII và VIII: Quản Lý & Sản Xuất Tinh Gọn",
    "explanation": "Theo đáp án ngân hàng câu hỏi môn học: Chuẩn bị máy móc thiết bị nhằm đảm bảo các máy hoạt động hết công suất theo tiến độ."
  },
  {
    "id": 334,
    "question": "Trong sản xuất tinh gọn để dòng chảy sản xuất được liên tục, việc chuẩn bị nguyên vật liệu được thực hiện như thế nào?",
    "options": [
      "Khi có yêu cầu thì mới đi mua vật liệu để giảm thiểu lưu kho",
      "Nguyên liệu được cung cấp theo kế hoạch và tiến độ sản xuất",
      "Nguyên liệu luôn sẵn sàng trong kho, khi cần là cung cấp ngay",
      "Chỉ chuẩn bị những vật liệu chính trong kho, vật tư phụ khi cần thì mua"
    ],
    "correctIndex": 1,
    "correctAnswer": "Nguyên liệu được cung cấp theo kế hoạch và tiến độ sản xuất",
    "correctAnswerLetter": "B",
    "chapterId": "ch7",
    "chapterTitle": "Chương VII và VIII: Quản Lý & Sản Xuất Tinh Gọn",
    "explanation": "Dòng chảy sản xuất liên tục yêu cầu nguyên vật liệu được cung ứng đồng bộ theo nhịp tiến độ sản xuất thực tế, tránh ứ đọng kho bãi."
  },
  {
    "id": 335,
    "question": "Trong sản xuất tinh gọn, khái niệm Just In Time (JIT) có nghĩa là gì?",
    "options": [
      "Đi làm phải đúng giờ",
      "Sản xuất vừa đúng lúc",
      "Sản xuất trước khi có yêu cầu để có thể cấp hàng ngay",
      "Có đầy đủ hàng hóa dự phòng để cung cấp ngay lập tức"
    ],
    "correctIndex": 1,
    "correctAnswer": "Sản xuất vừa đúng lúc",
    "correctAnswerLetter": "B",
    "chapterId": "ch7",
    "chapterTitle": "Chương VII và VIII: Quản Lý & Sản Xuất Tinh Gọn",
    "explanation": "Just In Time (JIT): Sản xuất đúng sản phẩm, đúng số lượng, vào đúng lúc cần thiết ('Sản xuất vừa đúng lúc') để loại bỏ lãng phí tồn kho."
  }
];
