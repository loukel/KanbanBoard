import axios from 'axios'
import { baseUrl } from '../constants'

const getAllColumns = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: `${baseUrl}/columns`,
    })

    return res.data
  } catch (error) {
    console.error(error)
    return error
  }
}

const updateColumns = async (data) => {
  try {
    const res = await axios({
      method: 'PUT',
      url: `${baseUrl}/columns`,
      data
    })

    return res.data
  } catch (error) {
    console.error(error)
    return error
  }
}

const updateColumn = async (id, data) => {
  try {
    const res = await axios({
      method: 'PUT',
      url: `${baseUrl}/columns/${id}`,
      data
    })

    return res.data
  } catch (error) {
    console.error(error)
    return error
  }
}

export {
  getAllColumns,
  updateColumns,
  updateColumn
}