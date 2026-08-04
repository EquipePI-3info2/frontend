function collectMessages(value, messages, prefix = '') {
  if (value == null) return

  if (typeof value === 'string') {
    messages.push(prefix ? `${prefix}: ${value}` : value)
    return
  }

  if (Array.isArray(value)) {
    value.forEach((item) => collectMessages(item, messages, prefix))
    return
  }

  if (typeof value === 'object') {
    Object.entries(value).forEach(([key, item]) => {
      const readableKey = key === 'non_field_errors' || key === 'detail' ? '' : key
      collectMessages(item, messages, readableKey || prefix)
    })
  }
}

export function getApiErrorMessage(error, fallback = 'Não foi possível concluir a operação.') {
  if (!error) return fallback

  if (!error.response) {
    return error.code === 'ECONNABORTED'
      ? 'A conexão demorou mais que o esperado. Tente novamente.'
      : 'Não foi possível conectar ao servidor. Verifique se o backend está funcionando.'
  }

  const messages = []
  collectMessages(error.response.data, messages)
  return messages.filter(Boolean).join(' ') || fallback
}
