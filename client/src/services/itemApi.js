import axios from 'axios'
import { baseUrl } from '../constants'

const updateItems = async (data) => {
  try {
    const res = await axios({
      method: 'PUT',
      url: `${baseUrl}/items`,
      data
    })

    return res.data
  } catch (error) {
    console.error(error)
    return error
  }
}

const updateItem = async (id, data) => {
  try {
    const res = await axios({
      method: 'PUT',
      url: `${baseUrl}/items/${id}`,
      data,
    })

    return res
  } catch (error) {
    console.error(error)
    return error
  }
}

export {
  updateItems,
  updateItem
}