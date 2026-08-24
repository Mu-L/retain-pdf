// 宿主先注册 RetainPDF adapters，再通过公开 boot 入口显式启动 Reader。
import "@/js/bootstrap/job-domain-adapters.js";
import "./adapters/retainpdf.js";
import { bootReader } from "@retainpdf/reader/boot";

bootReader();
