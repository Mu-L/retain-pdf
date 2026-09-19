# retainpdf2doc

RetainPDF 排版规格 → 保留排版的 Word 文档，公式是**原生可编辑的 Office Math**。

```bash
retainpdf2doc <spec.json> <output.docx>
```

正常不直接调它——`retainpdf-pipeline layout-docx` 会算好规格再起它。

## 这条缝为什么在这里

排版规格（页面尺寸、每个块的位置、收敛后的字号和基线间距）由 Python 侧的
`retainpdf_pipeline` 算，那是几千行逻辑，搬不动也不该搬。这个包只管「规格 → 文档」。
规格的形状见 `src/spec.mjs`。

## 为什么不继续用 Python

公式。Python 那版用 python-docx 自己写 OMML，转换器带一张 **47 条**的符号表，不在表里
的命令直接剥掉反斜杠当字母印出去。实测：

| | 旧版（python-docx） | 现在 |
|---|---|---|
| 全仓带命令的公式中命令名泄漏 | 625 / 1933（**32.3%**） | 0 |
| 同一个真实 job（91 个公式） | 58 个泄漏 | 0 |
| `\mathbf{2a}` | `mathbf2a` | `2a` + 粗体样式 |
| `\left(\frac{a}{b}\right)` | `≤ft(abright)` | `m:d` + `m:f` |
| `\sum_{i=1}^{n}` | `sumi=1^n` | `m:nary` |

这边走 LaTeX → MathJax → Presentation MathML → OMML（vendor 自 VisualTeX，MIT，
见 NOTICE.md），整个 TeX 解析器都在，没有「表里没有」这回事。

顺带把文本框从 VML 换成了 DrawingML：VML 是 Office 2007 前的遗留格式，而且**不裁切**
——字排多一点就糊到相邻块上。

## 构建

```bash
npm run build --workspace retainpdf2doc   # 产出 dist/cli.mjs
npm test --workspace retainpdf2doc
```

`dist/` 不在版本库里。Python 侧找不到它时会直接报出这条命令，不会让人对着非零退出码猜。

## 公式转换失败时

保留原始 LaTeX 文本，**并在 stderr 报出来**，不让一个写坏的公式毁掉整份文档。
（真实数据里遇到过一个：`\L` 是文本模式的 Ł，数学模式里非法。）
