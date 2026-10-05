export interface PresetOption {
  amount: number;
  label: string;
  icon: string;
  desc: string;
}

export const DONATE_CONFIG = {
  bankId: "MB",
  bankName: "MBBank (Ngân Hàng Quân Đội)",
  accountNo: "3699888899",
  accountName: "MAI TIẾN MINH",
  accountNameEncoded: "MAI TIEN MINH",
  defaultAmount: 20000,
  presets: [
    { amount: 10000, label: "10.000đ", icon: "☕", desc: "Cốc trà đá vỉa hè" },
    { amount: 20000, label: "20.000đ", icon: "🧋", desc: "Ly cà phê sáng" },
    { amount: 50000, label: "50.000đ", icon: "🍜", desc: "Bát phở bò tái gầu" },
    { amount: 100000, label: "100.000đ", icon: "🍕", desc: "Bữa ăn thịnh soạn" },
    { amount: 200000, label: "200.000đ", icon: "🚀", desc: "Nuôi Server 1 tháng" },
  ] as PresetOption[],
  memoPrefix: "NUOI TOI",
  vietqrTemplate: "compact2", // compact2 là template có logo ngân hàng và thông tin đẹp mắt nhất
};
