import axios from 'axios'
import { baseUrl } from '../constants'

const getAllColumns = () => {
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

const updateColumns = (data) => {
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

const updateColumn = (id, data) => {
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