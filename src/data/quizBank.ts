import { QuizQuestion, QuizTopic } from "@/types/quiz";

export const QUIZ_TOPICS: QuizTopic[] = [
  {
    id: "all",
    title: "Toàn Bộ Ngân Hàng Câu Hỏi",
    desc: "Tổng hợp toàn bộ 65 câu hỏi trắc nghiệm Dung sai & Cơ khí",
    icon: "fa-solid fa-layer-group",
    badge: "65 CÂU",
    count: 65,
  },
  {
    id: "ch1",
    title: "Chương 1: Quá Trình Sản Xuất & Công Nghệ",
    desc: "Khái niệm phôi, chi tiết/bộ phận máy, dạng sản xuất cơ khí",
    icon: "fa-solid fa-gears",
    badge: "18 CÂU",
    count: 18,
  },
  {
    id: "ch2",
    title: "Chương 2: Dung Sai, Kích Thước & Sai Lệch",
    desc: "Kích thước danh nghĩa/thực, sai lệch es/ei, miền dung sai H, h, Js...",
    icon: "fa-solid fa-ruler-combined",
    badge: "34 CÂU",
    count: 34,
  },
  {
    id: "ch3",
    title: "Chương 3: Cấp Chính Xác & Độ Nhám Bề Mặt",
    desc: "20 cấp chính xác, 14 cấp độ bóng, chỉ tiêu Ra & Rz",
    icon: "fa-solid fa-microscope",
    badge: "13 CÂU",
    count: 13,
  },
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
  }
];
