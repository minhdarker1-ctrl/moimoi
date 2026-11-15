import { QuizQuestion, QuizTopic } from "@/types/quiz";

export const QUIZ_TOPICS: QuizTopic[] = [
  {
    "id": "all",
    "title": "Toàn Bộ Ngân Hàng Câu Hỏi",
    "desc": "Tổng hợp toàn bộ 125 câu hỏi trắc nghiệm Dung sai, Cơ khí & Công nghệ Đúc",
    "icon": "fa-solid fa-layer-group",
    "badge": "125 CÂU",
    "count": 125
  },
  {
    "id": "ch1",
    "title": "Chương 1: Quá Trình Sản Xuất & Công Nghệ Cơ Khí",
    "desc": "Khái niệm phôi, chi tiết/bộ phận máy, dạng sản xuất cơ khí",
    "icon": "fa-solid fa-gears",
    "badge": "18 CÂU",
    "count": 18
  },
  {
    "id": "ch2",
    "title": "Chương 2: Dung Sai, Kích Thước & Sai Lệch",
    "desc": "Kích thước danh nghĩa/thực, sai lệch es/ei, miền dung sai H, h, Js...",
    "icon": "fa-solid fa-ruler-combined",
    "badge": "34 CÂU",
    "count": 34
  },
  {
    "id": "ch3",
    "title": "Chương 3: Cấp Chính Xác & Độ Nhám Bề Mặt",
    "desc": "20 cấp chính xác, 14 cấp độ bóng, chỉ tiêu Ra & Rz",
    "icon": "fa-solid fa-microscope",
    "badge": "13 CÂU",
    "count": 13
  },
  {
    "id": "ch4",
    "title": "Chương 4: Công Nghệ Đúc Kim Loại",
    "desc": "Khuôn cát, khuôn kim loại, đúc áp lực, đúc ly tâm, đúc mẫu chảy & khuyết tật",
    "icon": "fa-solid fa-fire",
    "badge": "60 CÂU MỚI",
    "count": 60
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
    "chapterTitle": "Chương 1: Quá Trình Sản Xuất & Công Nghệ",
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
    "chapterTitle": "Chương 1: Quá Trình Sản Xuất & Công Nghệ",
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
    "chapterTitle": "Chương 1: Quá Trình Sản Xuất & Công Nghệ",
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
    "chapterTitle": "Chương 1: Quá Trình Sản Xuất & Công Nghệ",
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
    "chapterTitle": "Chương 1: Quá Trình Sản Xuất & Công Nghệ",
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
    "chapterTitle": "Chương 1: Quá Trình Sản Xuất & Công Nghệ",
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
    "chapterTitle": "Chương 1: Quá Trình Sản Xuất & Công Nghệ",
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
    "chapterTitle": "Chương 1: Quá Trình Sản Xuất & Công Nghệ",
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
    "chapterTitle": "Chương 1: Quá Trình Sản Xuất & Công Nghệ",
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
    "chapterTitle": "Chương 1: Quá Trình Sản Xuất & Công Nghệ",
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
    "chapterTitle": "Chương 1: Quá Trình Sản Xuất & Công Nghệ",
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
    "chapterTitle": "Chương 1: Quá Trình Sản Xuất & Công Nghệ",
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
    "chapterTitle": "Chương 1: Quá Trình Sản Xuất & Công Nghệ",
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
    "chapterTitle": "Chương 1: Quá Trình Sản Xuất & Công Nghệ",
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
    "chapterTitle": "Chương 1: Quá Trình Sản Xuất & Công Nghệ",
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
    "chapterTitle": "Chương 1: Quá Trình Sản Xuất & Công Nghệ",
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
    "chapterTitle": "Chương 1: Quá Trình Sản Xuất & Công Nghệ",
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
    "chapterTitle": "Chương 1: Quá Trình Sản Xuất & Công Nghệ",
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
    "chapterId": "ch2",
    "chapterTitle": "Chương 2: Dung Sai, Kích Thước & Sai Lệch",
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
    "chapterId": "ch2",
    "chapterTitle": "Chương 2: Dung Sai, Kích Thước & Sai Lệch",
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
    "chapterId": "ch2",
    "chapterTitle": "Chương 2: Dung Sai, Kích Thước & Sai Lệch",
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
    "chapterId": "ch2",
    "chapterTitle": "Chương 2: Dung Sai, Kích Thước & Sai Lệch",
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
    "chapterId": "ch2",
    "chapterTitle": "Chương 2: Dung Sai, Kích Thước & Sai Lệch",
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
    "chapterId": "ch2",
    "chapterTitle": "Chương 2: Dung Sai, Kích Thước & Sai Lệch",
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
    "chapterId": "ch2",
    "chapterTitle": "Chương 2: Dung Sai, Kích Thước & Sai Lệch",
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
    "chapterId": "ch2",
    "chapterTitle": "Chương 2: Dung Sai, Kích Thước & Sai Lệch",
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
    "chapterId": "ch2",
    "chapterTitle": "Chương 2: Dung Sai, Kích Thước & Sai Lệch",
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
    "chapterId": "ch2",
    "chapterTitle": "Chương 2: Dung Sai, Kích Thước & Sai Lệch",
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
    "chapterId": "ch2",
    "chapterTitle": "Chương 2: Dung Sai, Kích Thước & Sai Lệch",
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
    "chapterId": "ch2",
    "chapterTitle": "Chương 2: Dung Sai, Kích Thước & Sai Lệch",
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
    "chapterId": "ch2",
    "chapterTitle": "Chương 2: Dung Sai, Kích Thước & Sai Lệch",
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
    "chapterId": "ch2",
    "chapterTitle": "Chương 2: Dung Sai, Kích Thước & Sai Lệch",
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
    "chapterId": "ch2",
    "chapterTitle": "Chương 2: Dung Sai, Kích Thước & Sai Lệch",
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
    "chapterId": "ch2",
    "chapterTitle": "Chương 2: Dung Sai, Kích Thước & Sai Lệch",
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
    "chapterId": "ch2",
    "chapterTitle": "Chương 2: Dung Sai, Kích Thước & Sai Lệch",
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
    "chapterId": "ch2",
    "chapterTitle": "Chương 2: Dung Sai, Kích Thước & Sai Lệch",
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
    "chapterId": "ch2",
    "chapterTitle": "Chương 2: Dung Sai, Kích Thước & Sai Lệch",
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
    "chapterId": "ch2",
    "chapterTitle": "Chương 2: Dung Sai, Kích Thước & Sai Lệch",
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
    "chapterId": "ch2",
    "chapterTitle": "Chương 2: Dung Sai, Kích Thước & Sai Lệch",
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
    "chapterId": "ch2",
    "chapterTitle": "Chương 2: Dung Sai, Kích Thước & Sai Lệch",
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
    "chapterId": "ch2",
    "chapterTitle": "Chương 2: Dung Sai, Kích Thước & Sai Lệch",
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
    "chapterId": "ch2",
    "chapterTitle": "Chương 2: Dung Sai, Kích Thước & Sai Lệch",
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
    "chapterId": "ch2",
    "chapterTitle": "Chương 2: Dung Sai, Kích Thước & Sai Lệch",
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
    "chapterId": "ch2",
    "chapterTitle": "Chương 2: Dung Sai, Kích Thước & Sai Lệch",
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
    "chapterId": "ch2",
    "chapterTitle": "Chương 2: Dung Sai, Kích Thước & Sai Lệch",
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
    "chapterId": "ch2",
    "chapterTitle": "Chương 2: Dung Sai, Kích Thước & Sai Lệch",
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
    "chapterId": "ch2",
    "chapterTitle": "Chương 2: Dung Sai, Kích Thước & Sai Lệch",
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
    "chapterId": "ch2",
    "chapterTitle": "Chương 2: Dung Sai, Kích Thước & Sai Lệch",
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
    "chapterId": "ch2",
    "chapterTitle": "Chương 2: Dung Sai, Kích Thước & Sai Lệch",
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
    "chapterId": "ch2",
    "chapterTitle": "Chương 2: Dung Sai, Kích Thước & Sai Lệch",
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
    "chapterId": "ch2",
    "chapterTitle": "Chương 2: Dung Sai, Kích Thước & Sai Lệch",
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
    "chapterId": "ch2",
    "chapterTitle": "Chương 2: Dung Sai, Kích Thước & Sai Lệch",
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
    "chapterId": "ch3",
    "chapterTitle": "Chương 3: Cấp Chính Xác & Độ Nhám Bề Mặt",
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
    "chapterId": "ch3",
    "chapterTitle": "Chương 3: Cấp Chính Xác & Độ Nhám Bề Mặt",
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
    "chapterId": "ch3",
    "chapterTitle": "Chương 3: Cấp Chính Xác & Độ Nhám Bề Mặt",
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
    "chapterId": "ch3",
    "chapterTitle": "Chương 3: Cấp Chính Xác & Độ Nhám Bề Mặt",
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
    "chapterId": "ch3",
    "chapterTitle": "Chương 3: Cấp Chính Xác & Độ Nhám Bề Mặt",
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
    "chapterId": "ch3",
    "chapterTitle": "Chương 3: Cấp Chính Xác & Độ Nhám Bề Mặt",
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
    "chapterId": "ch3",
    "chapterTitle": "Chương 3: Cấp Chính Xác & Độ Nhám Bề Mặt",
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
    "chapterId": "ch3",
    "chapterTitle": "Chương 3: Cấp Chính Xác & Độ Nhám Bề Mặt",
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
    "chapterId": "ch3",
    "chapterTitle": "Chương 3: Cấp Chính Xác & Độ Nhám Bề Mặt",
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
    "chapterId": "ch3",
    "chapterTitle": "Chương 3: Cấp Chính Xác & Độ Nhám Bề Mặt",
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
    "chapterId": "ch3",
    "chapterTitle": "Chương 3: Cấp Chính Xác & Độ Nhám Bề Mặt",
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
    "chapterId": "ch3",
    "chapterTitle": "Chương 3: Cấp Chính Xác & Độ Nhám Bề Mặt",
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
    "chapterId": "ch3",
    "chapterTitle": "Chương 3: Cấp Chính Xác & Độ Nhám Bề Mặt",
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
    "chapterId": "ch4",
    "chapterTitle": "Chương 4: Công Nghệ Đúc Kim Loại",
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
    "chapterId": "ch4",
    "chapterTitle": "Chương 4: Công Nghệ Đúc Kim Loại",
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
    "chapterId": "ch4",
    "chapterTitle": "Chương 4: Công Nghệ Đúc Kim Loại",
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
    "chapterId": "ch4",
    "chapterTitle": "Chương 4: Công Nghệ Đúc Kim Loại",
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
    "chapterId": "ch4",
    "chapterTitle": "Chương 4: Công Nghệ Đúc Kim Loại",
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
    "chapterId": "ch4",
    "chapterTitle": "Chương 4: Công Nghệ Đúc Kim Loại",
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
    "chapterId": "ch4",
    "chapterTitle": "Chương 4: Công Nghệ Đúc Kim Loại",
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
    "chapterId": "ch4",
    "chapterTitle": "Chương 4: Công Nghệ Đúc Kim Loại",
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
    "chapterId": "ch4",
    "chapterTitle": "Chương 4: Công Nghệ Đúc Kim Loại",
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
    "chapterId": "ch4",
    "chapterTitle": "Chương 4: Công Nghệ Đúc Kim Loại",
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
    "chapterId": "ch4",
    "chapterTitle": "Chương 4: Công Nghệ Đúc Kim Loại",
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
    "chapterId": "ch4",
    "chapterTitle": "Chương 4: Công Nghệ Đúc Kim Loại",
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
    "chapterId": "ch4",
    "chapterTitle": "Chương 4: Công Nghệ Đúc Kim Loại",
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
    "chapterId": "ch4",
    "chapterTitle": "Chương 4: Công Nghệ Đúc Kim Loại",
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
    "chapterId": "ch4",
    "chapterTitle": "Chương 4: Công Nghệ Đúc Kim Loại",
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
    "chapterId": "ch4",
    "chapterTitle": "Chương 4: Công Nghệ Đúc Kim Loại",
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
    "chapterId": "ch4",
    "chapterTitle": "Chương 4: Công Nghệ Đúc Kim Loại",
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
    "chapterId": "ch4",
    "chapterTitle": "Chương 4: Công Nghệ Đúc Kim Loại",
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
    "chapterId": "ch4",
    "chapterTitle": "Chương 4: Công Nghệ Đúc Kim Loại",
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
    "chapterId": "ch4",
    "chapterTitle": "Chương 4: Công Nghệ Đúc Kim Loại",
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
    "chapterId": "ch4",
    "chapterTitle": "Chương 4: Công Nghệ Đúc Kim Loại",
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
    "chapterId": "ch4",
    "chapterTitle": "Chương 4: Công Nghệ Đúc Kim Loại",
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
    "chapterId": "ch4",
    "chapterTitle": "Chương 4: Công Nghệ Đúc Kim Loại",
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
    "chapterId": "ch4",
    "chapterTitle": "Chương 4: Công Nghệ Đúc Kim Loại",
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
    "chapterId": "ch4",
    "chapterTitle": "Chương 4: Công Nghệ Đúc Kim Loại",
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
    "chapterId": "ch4",
    "chapterTitle": "Chương 4: Công Nghệ Đúc Kim Loại",
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
    "chapterId": "ch4",
    "chapterTitle": "Chương 4: Công Nghệ Đúc Kim Loại",
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
    "chapterId": "ch4",
    "chapterTitle": "Chương 4: Công Nghệ Đúc Kim Loại",
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
    "chapterId": "ch4",
    "chapterTitle": "Chương 4: Công Nghệ Đúc Kim Loại",
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
    "chapterId": "ch4",
    "chapterTitle": "Chương 4: Công Nghệ Đúc Kim Loại",
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
    "chapterId": "ch4",
    "chapterTitle": "Chương 4: Công Nghệ Đúc Kim Loại",
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
    "chapterId": "ch4",
    "chapterTitle": "Chương 4: Công Nghệ Đúc Kim Loại",
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
    "chapterId": "ch4",
    "chapterTitle": "Chương 4: Công Nghệ Đúc Kim Loại",
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
    "chapterId": "ch4",
    "chapterTitle": "Chương 4: Công Nghệ Đúc Kim Loại",
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
    "chapterId": "ch4",
    "chapterTitle": "Chương 4: Công Nghệ Đúc Kim Loại",
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
    "chapterId": "ch4",
    "chapterTitle": "Chương 4: Công Nghệ Đúc Kim Loại",
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
    "chapterId": "ch4",
    "chapterTitle": "Chương 4: Công Nghệ Đúc Kim Loại",
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
    "chapterId": "ch4",
    "chapterTitle": "Chương 4: Công Nghệ Đúc Kim Loại",
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
    "chapterId": "ch4",
    "chapterTitle": "Chương 4: Công Nghệ Đúc Kim Loại",
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
    "chapterId": "ch4",
    "chapterTitle": "Chương 4: Công Nghệ Đúc Kim Loại",
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
    "chapterId": "ch4",
    "chapterTitle": "Chương 4: Công Nghệ Đúc Kim Loại",
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
    "chapterId": "ch4",
    "chapterTitle": "Chương 4: Công Nghệ Đúc Kim Loại",
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
    "chapterId": "ch4",
    "chapterTitle": "Chương 4: Công Nghệ Đúc Kim Loại",
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
    "chapterId": "ch4",
    "chapterTitle": "Chương 4: Công Nghệ Đúc Kim Loại",
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
    "chapterId": "ch4",
    "chapterTitle": "Chương 4: Công Nghệ Đúc Kim Loại",
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
    "chapterId": "ch4",
    "chapterTitle": "Chương 4: Công Nghệ Đúc Kim Loại",
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
    "chapterId": "ch4",
    "chapterTitle": "Chương 4: Công Nghệ Đúc Kim Loại",
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
    "chapterId": "ch4",
    "chapterTitle": "Chương 4: Công Nghệ Đúc Kim Loại",
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
    "chapterId": "ch4",
    "chapterTitle": "Chương 4: Công Nghệ Đúc Kim Loại",
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
    "chapterId": "ch4",
    "chapterTitle": "Chương 4: Công Nghệ Đúc Kim Loại",
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
    "chapterId": "ch4",
    "chapterTitle": "Chương 4: Công Nghệ Đúc Kim Loại",
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
    "chapterId": "ch4",
    "chapterTitle": "Chương 4: Công Nghệ Đúc Kim Loại",
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
    "chapterId": "ch4",
    "chapterTitle": "Chương 4: Công Nghệ Đúc Kim Loại",
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
    "chapterId": "ch4",
    "chapterTitle": "Chương 4: Công Nghệ Đúc Kim Loại",
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
    "chapterId": "ch4",
    "chapterTitle": "Chương 4: Công Nghệ Đúc Kim Loại",
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
    "chapterId": "ch4",
    "chapterTitle": "Chương 4: Công Nghệ Đúc Kim Loại",
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
    "chapterId": "ch4",
    "chapterTitle": "Chương 4: Công Nghệ Đúc Kim Loại",
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
    "chapterId": "ch4",
    "chapterTitle": "Chương 4: Công Nghệ Đúc Kim Loại",
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
    "chapterId": "ch4",
    "chapterTitle": "Chương 4: Công Nghệ Đúc Kim Loại",
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
    "chapterId": "ch4",
    "chapterTitle": "Chương 4: Công Nghệ Đúc Kim Loại",
    "explanation": "Chốt định vị giữa hai nửa hòm khuôn (trên và dưới) có tác dụng định vị chính xác vị trí hai nửa khuôn, đảm bảo hai lòng khuôn không bị xê dịch lệch nhau."
  }
];
