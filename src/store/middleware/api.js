import axios from 'axios'
import * as actions from '../actions/apiActions'
import toast from 'react-hot-toast'

/**
 *
 * @params
 * url :
 * method : GET / POST / PUT / DELETE
 * data : object
 * onStart : Redux action creator
 * onSuccess : Redux action creator
 * onError : Redux action creator
 * headers : object
 * displayToast : true / false, default : true
 * authorizationHeader : true / false , default : true --> if Authorisation Header should be set in request or not
 */

const apiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_END_POINT}`
})
const api =
  ({ dispatch, getState }) =>
  next =>
  async action => {
    // Check if Dispatched action is apiCallBegan then proceed with middleware code
    // If not then call the next and ignore this middleware
    if (action.type !== actions.apiCallBegan.type) return next(action)
    let {
      url,
      method,
      data,
      params,
      onStart,
      onSuccess,
      onError,
      onStartDispatch,
      onErrorDispatch,
      onSuccessDispatch,
      headers,
      displayToast,
      authorizationHeader
    } = action.payload
    if (typeof displayToast === 'undefined') displayToast = true

    // Set Token header if it is required

    if (typeof authorizationHeader === 'undefined' || authorizationHeader === true) {
      headers = {
        ...headers,
        Authorization: 'Bearer ' + getState().User?.data?.api_token
      }
    }

    // On start is used to do actions which should happen before the API call
    // Such as set loading flag to true
    if (onStartDispatch) dispatch({ type: onStartDispatch })
    if (onStart) onStart()
    next(action)

    try {
      // API Call
      const response = await apiClient.request({
        url,
        method,
        data,
        params,
        onSuccess,
        onError,
        headers
      })
      if (response.data.error) {
        // console.log("reserr",response)
        // Dispatch Default onError Event
        dispatch(actions.apiCallFailed(response.data.message))

        // Dispatch custom onError Event
        // if (onError) dispatch({type: onError, payload: response.data.message});

        if (onError) onError(response.data.message)
        if (onErrorDispatch) dispatch({ type: onErrorDispatch, payload: response.data.message })

        // Toast Message
        if (displayToast) {
          toast.error(response.data.message)
        }
      } else {
        // Dispatch Default onSuccess Event
        // console.log("respsnde",response.data)
        dispatch(actions.apiCallSuccess(response.data))

        // Dispatch custom onSuccess Event
        if (onSuccess) onSuccess(response.data)
        // if (onSuccessDispatch) dispatch({ type: onSuccessDispatch, payload: response.data });
        if (onSuccessDispatch) {
          if (response.data.data) {
            dispatch({ type: onSuccessDispatch, payload: response.data, request: data || params })
          } else if (data) {
            dispatch({ type: onSuccessDispatch, payload: data })
          } else {
            dispatch({ type: onSuccessDispatch, payload: params })
          }
        }

        // Toast Message
        if (displayToast) {
          toast.success(response.data.message)
        }
      }
    } catch (error) {
      // Dispatch Default onError Event
      console.log(error)
      // if (error.response.status === 401) {
      //     error.message = "Please Login";
      // }
      dispatch(actions.apiCallFailed(error.message))

      // Dispatch custom onError Event
      if (onError) onError(error.message)
      if (onErrorDispatch) dispatch({ type: onErrorDispatch, payload: error.message })

      if (displayToast) {
        toast.error(error.message)
      }
    }
  }
export default api
