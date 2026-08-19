// 占位：standalone 包的 legacy 按需加载入口（当前仅占位，不打包进主包）
// 宿主如需 legacy，可在此实现真实 legacy 编排；主包通过 React.lazy 动态 import 时会拆为独立 chunk
import { ReaderAppReactPdf } from "../ReaderAppReactPdf.jsx";
export function ReaderAppLegacy() {
  // 占位回落到 react-pdf，避免主包体积膨胀
  return <ReaderAppReactPdf />;
}
export default ReaderAppLegacy;
