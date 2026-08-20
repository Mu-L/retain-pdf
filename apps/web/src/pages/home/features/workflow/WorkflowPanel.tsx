// 工作流面板(翻译工作流卡片,对照 partials/main-content.html 的
// .translation-workflow-card 区块逐 id 镜像)。
//
// - #job-warning:workflow 视图 store(updateJobWarning 桥回调写入)
// - #job-form:提交流程属 app-actions 域(3b),onSubmit 走 bridge.submitForm
//   (3a 为 preventDefault 占位;隐藏凭据 input 由 credentials 域的
//   HiddenCredentialInputs 接管,渲染唯一一份,不重复制造 DOM id)
// - 上传瓦片/动作组/行内错误盒分别由 upload 域组件与 InlineErrorBox 落位
//
// Decoupled: HiddenCredentialInputs 不再由 workflow 直接 import(曾是
// workflow → credentials 跨域耦合),改为由 HomeApp/TranslationWorkflowDialog
// 经 props/slot 注入(hiddenInputsSlot)。workflow 域只管渲染 slot。

import { useStoreSnapshot } from "@/shared/react/use-store.js";
import { useHomeServices } from "../../home-services-context.js";
import { HeroUpload } from "./components/UploadTile.jsx";
import { InlineErrorBox } from "../../components/InlineErrorBox.jsx";

export function WorkflowPanel({ hiddenInputsSlot = null }: { hiddenInputsSlot?: React.ReactNode | null }) {
  const services = useHomeServices();
  const workflow = useStoreSnapshot(services.stores.workflowView);

  return (
    <section className="translation-workflow-card">
      <div id="job-warning" className={`job-warning${workflow.jobWarningVisible ? "" : " hidden"}`}>
        检测到上一个任务仍在处理中。建议先等待当前任务结束，再提交新的 PDF。
      </div>

      <form
        id="job-form"
        className="form"
        noValidate
        onSubmit={(event) => services.bridge.submitForm(event)}
      >
        {hiddenInputsSlot}

        <HeroUpload />
        <InlineErrorBox />
      </form>
    </section>
  );
}
