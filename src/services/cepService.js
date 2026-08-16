import axios from 'axios'

const cepService = {
  async getAddress(zipCode) {
    const cep = String(zipCode || '').replace(/\D/g, '')

    if (!/^\d{8}$/.test(cep)) {
      throw new Error('Informe um CEP válido com oito dígitos.')
    }

    const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json/`, {
      timeout: 10000,
    })

    if (data?.erro) {
      throw new Error('CEP não encontrado.')
    }

    return data
  },
}

export default cepService
