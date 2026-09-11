// ProviderPanels 家族共享的纯展示辅助。

export function storedSecretPlaceholder(label: string) {
  return `••••••••••••（${label} 已安全保存，输入新值可替换）`;
}

export function resetHandlerFor(handlers) {
  return handlers?.resetPaddleValidation;
}
