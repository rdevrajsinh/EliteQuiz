"use client"
import React, { use, useEffect, useState } from 'react'
import { withTranslation } from 'react-i18next'
import { t } from 'i18next'
import { Tab, Tabs } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { Modal } from 'antd'
import Skeleton from 'react-loading-skeleton'
import { deletependingPayemntApi, getPaymentApi, getusercoinsApi, setPaymentApi } from 'src/store/actions/campaign'
import { updateUserDataInfo } from 'src/store/reducers/userSlice'
import { settingsData, sysConfigdata } from 'src/store/reducers/settingsSlice'
import coinimg from "src/assets/images/coin.svg"
import errorimg from "src/assets/images/error.svg"
import Layout from 'src/components/Layout/Layout'
import LeftTabProfile from 'src/components/Profile/LeftTabProfile'
import paypal from 'src/assets/images/Paypal.svg'
import paytm from 'src/assets/images/Paytm.svg'
import stripe from 'src/assets/images/Stripe.svg'



const Wallet = () => {
  // payment modal
  const [modal, setModal] = useState(false)

  const [activeTab, setActiveTab] = useState('all');

  const [inputId, setInputId] = useState([])

  const [walletvalue, setWalletValue] = useState('')

  const [redeemInput, setRedeemInput] = useState(0)

  const [paymentData, setPaymentData] = useState([])

  const [totalCoinUsed, setTotalCoinUsed] = useState()

  const [loading, setLoading] = useState(true)

  const [paymentIdModal, setPaymentIdModal] = useState(false)

  const [paytmOptions, setPaytmOptions] = useState({ name: '', placeholder: '' })

  const systemconfig = useSelector(sysConfigdata)

  // per coin
  const per_coin = systemconfig?.per_coin

  // per amount
  const coin_amount = systemconfig?.coin_amount

  // minimun coin for request
  const coin_limit = systemconfig?.coin_limit

  // payment sign
  const currency_symbol = systemconfig?.currency_symbol

  // store data get
  const userData = useSelector(state => state.User)

  // here math.max use for check negative value if negative then it set 0
  const usercoins = Math.max(Number(userData?.data && userData?.data?.userProfileStatics.coins), 0)

  // payment option icon, name and placeholder
  const paymentIcones = [
    { src: paypal, name: 'paypal' , placeholder: 'enter paypalid'},
    { src: paytm, name: 'paytm' ,placeholder : 'enter mobilenumber'},
    { src: stripe, name: 'stripe',placeholder: 'enter upi id' },
  ];

  // user coins
  useEffect(() => {
    let data = usercoins
    let newData = (data / Number(per_coin)) * Number(coin_amount)
    // here if newData is negative then it set 0
    if (newData < 0) {
      newData = 0
    }
    setWalletValue(newData)
  }, [])

  // inputcoinused (reverse process based input value data passed)
  const inputCoinUsed = () => {
    let inputCoin = redeemInput ? redeemInput : walletvalue
    let totalCoinUsed = (inputCoin * Number(per_coin)) / Number(coin_amount)
    setTotalCoinUsed(totalCoinUsed)
  }

  // minimum value
  const minimumValue = () => {
    const minimumvalue = Number(coin_limit)
    const percoin = Number(per_coin)
    const totalvalue = minimumvalue / percoin
    return totalvalue
  }

  // reedem button
  const redeemNow = e => {
    e.preventDefault()
    inputCoinUsed()
    if (Number(redeemInput) < minimumValue()) {
      setModal(false)
      toast.error(t(`Minimum redeemable amount is ${currency_symbol}${minimumValue()}`))
      return
    } else if (Number(redeemInput) > walletvalue) {
      setModal(false)
      toast.error(t(`You cannot redeem more than your wallet balance`))
      return
    } else {
      setModal(true)
    }
  }

  // payment type
  const paymentModal = (e, type) => {
    e.preventDefault()
    if (type === paymentIcones[0].name) {
      setPaytmOptions({ name: paymentIcones[0].name, placeholder:  paymentIcones[0].placeholder, })
      setPaymentIdModal(true)
      setModal(false)
    } else if (type === paymentIcones[1].name) {
      setPaytmOptions({ name: paymentIcones[1].name, placeholder:  paymentIcones[1].placeholder, })
      setPaymentIdModal(true)
      setModal(false)
    } else if (type === paymentIcones[2].name) {
      setPaytmOptions({ name: paymentIcones[2].name, placeholder:  paymentIcones[2].placeholder, })
      setPaymentIdModal(true)
      setModal(false)
    }
  }
  // input data
  const handleMerchantIdChange = event => {
    setInputId(event.target.value)
  }

  // cancel button
  const onCancelbutton = () => {
    setInputId(0)
  }

  // make request
  const makeRequest = (event, type) => {
    event.preventDefault()
    // if input field is empty
    if (inputId == '') {
      toast.error('please fill your id')
      return
    }
    // set payment api call with coin update api

    setPaymentApi({
      payment_type: type,
      payment_address: `["${inputId}"]`,
      payment_amount: redeemInput,
      coin_used: totalCoinUsed,
      details: 'Redeem Request',
      onSuccess: response => {
        setModal(false)
        setPaymentIdModal(false)


        getusercoinsApi({
          onSuccess: responseData => {
            setActiveTab("pending")
            setRedeemInput(0);
            updateUserDataInfo(responseData.data)
          },
          onError: error => {
            console.log(error)
          }
        })

      },
      onError: error => {
        setModal(false)
        if (error == 127) {
          toast.error(
            t(
              'next_payment_48_hours_latter'
            )
          )
        }
      }
    })

  }

  // get payment api fetch
  useEffect(() => {
    getPaymentApi({
      onSuccess: response => {
        const resposneData = response.data
        setPaymentData(resposneData);
        // const totalAmount = resposneData.reduce((accumulator, currentObject) => {
        //   if (currentObject.status === '1') {
        //     const paymentAmount = parseFloat(currentObject.payment_amount);
        //     return accumulator + paymentAmount;
        //   }
        //   return accumulator;
        // }, 0);
        setLoading(false);
      },
      onError: error => {
        setLoading(false);
      }
    });
  }, [activeTab])

  // status data
  const statusData = (status) => {
    if (status === "0") {
      return "pending";
    } else if (status === "1") {
      return "completed";
    } else if (status === "2") {
      return "invalid details";
    }
  };

  // date format
  const dataFormat = date => {
    const dateString = date.substring(0, 10)
    const dateArray = dateString.split('-')
    const reversedDateArray = dateArray.reverse()
    const newDateStr = reversedDateArray.join('-')
    return newDateStr
  }

  // input value of redeem amount
  const handleInputchange = event => {
    event.preventDefault()
    let targetValue = event.target.value
    setRedeemInput(Number(targetValue))
  }

  // return value of popup coins
  const modalCoinValue = () => {
    const divisionResult = redeemInput / minimumValue()
    const centsValue = Math.floor(divisionResult * 100)
    return centsValue
  }


  // update wallet value of input by default input value and selected value
  useEffect(() => {
    setRedeemInput(walletvalue)
  }, [walletvalue])

  const getStatusColor = (status) => {
    switch (status) {
      case '0':
        return 'pending-color';
      case '1':
        return 'completed-color';
      case '2':
        return 'invalid-color';
      default:
        return ''; // Default color or add a class for other statuses
    }
  };

  // delete request
  const deleteRequest = (id) => {
    deletependingPayemntApi({
      payment_id: id,
      onSuccess: () => {
        toast.success(t("successfully_delete"))
        setActiveTab("pending")
        setPaymentData([])
        getusercoinsApi({
          onSuccess: responseData => {
            setRedeemInput(0);
            updateUserDataInfo(responseData.data)
          },
          onError: error => {
            console.log(error)
          }
        })
      },
      onError: (error) => {
        console.log(error)
      }
    })
  }
  const pendingData = paymentData?.filter(data => data.status === "0")
  const renderDataByStatus = (status) => {
    const filteredData = paymentData.filter(data => data.status === status);

    return (
      <>
        {filteredData?.length > 0 ? (
          filteredData.map((data, index) => (
            <div className={`reedem_request ${getStatusColor(data.status)}`} key={index}>
              <div className='redeem'>
                <p className='redeem_txt'>{t('redeem_request')}</p>
                <p className='redeem_price'>
                  {currency_symbol}
                  {data?.payment_amount}
                </p>
              </div>
              <div className='payment_adderess'>
                <p className='payment_type'>
                  {data?.payment_type} &#9679; {dataFormat(data?.date)}
                </p>
                <p className='payment_status'>{statusData(data?.status)}</p>
              </div>
            </div>
          ))
        ) : (
          <div className='text-center'>
            <img src={errorimg.src} title='wrteam' className='error_img' />
            <p className='text-dark'>{t('no_data_found')}</p>
          </div>
        )}
      </>
    );
  };

  return (
    <Layout>

      <section className='Profile__Sec wallet'>
        <div className='container'>
          <div className="morphism ">
            <div className='row pro-card position-relative'>
              <div className='tabsDiv col-xl-3 col-lg-8 col-md-12 col-12 border-line'>
                <div className='card px-4 bottom__card_sec'>
                  {/* Tab headers */}
                  <LeftTabProfile />
                </div>
              </div>
              <div className='contentDiv col-xl-9 col-lg-4 col-md-12 col-12 pt-2'>
                <div className='row morphisam card'>
                  <div className='col-md-12 col-12 walletContentWrapper'>
                    <div className='request_data pt-3'>
                      <h2 className='headline'>{t('request_payment')}</h2>
                      <div className="requestDataWrapper">

                        <div className="totCoinsDiv">
                          <span>{`${t('total')} ${t('coins')} `}</span>
                          <span className='coins'>
                            <img className='me-1' src={coinimg.src} alt='coin' />
                            {usercoins}</span>
                        </div>
                        <div className="reedembleAmtDiv">
                          <span>{`${t('redeemable_amount')}${currency_symbol}`}</span>
                          <span> <input
                            type='number'
                            className='price'
                            defaultValue={`${walletvalue}`}
                            onChange={event => handleInputchange(event)}
                            min={0}
                          /></span>
                        </div>
                        <div className="reedemBtnDiv">
                          <button className='btn btn-primary' onClick={e => redeemNow(e)}>
                            {t('redeem_now')}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="notesDiv">
                      <p className='notes'>{t('notes')} :</p>
                      <ul>
                        <li className='notes_data'>{t('payout_days')}</li>
                        <li className='notes_data'>{`${t("minimum_redeemable_amount")} ${currency_symbol}${minimumValue()}`}</li>
                      </ul>
                    </div>
                    {/* {paymentData?.length > 0 ? ( */}
                    <div className="transactionDiv">
                      <h2 className='headline'>{t('transaction')}</h2>
                      {loading ? (
                        <div className='text-center'>
                          <Skeleton count={5} />
                        </div>
                      ) : (
                        <>
                          <Tabs
                            id='fill-tab-example'
                            activeKey={activeTab}
                            onSelect={key => setActiveTab(key)}
                            fill
                            className='mb-3'
                          >
                            <Tab eventKey='all' title={t('all')}>
                              {renderDataByStatus('2')}
                            </Tab>
                            <Tab eventKey='completed' title={t('completed')}>
                              {renderDataByStatus('1')}
                            </Tab>
                            <Tab eventKey='pending' title={t('pending')}>

                              {renderDataByStatus('0')}
                              {pendingData && pendingData.length > 0 ? <button className='delete-request btn btn-danger' onClick={() => deleteRequest(paymentData[0].id)}>{t("delete_request")}</button> : null}

                            </Tab>

                          </Tabs>
                        </>
                      )}
                    </div>


                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* payment icon payout modal */}
      <Modal
      className='payment_modal'
        maskClosable={false}
        title={t('wallet')}
        centered
        open={modal}
        onOk={() => setModal(false)}
        onCancel={e => {
          setModal(false)
          onCancelbutton(e)
        }}
        footer={null}
      >
        <h4>
          {t('redeemable_amount')} {currency_symbol}
          {redeemInput}
        </h4>
        <p>
          {modalCoinValue()} {t('coins_deducted')}
        </p>
        <hr className='hr' />
        <p>{t('select_payout_option')}</p>
        <ul className='payment_icon ps-0'>
        {paymentIcones.map((icon)=>{
          return(
          <li onClick={e => paymentModal(e, icon.name)}>
            <i >
              <img src={icon.src.src} alt={icon} />
            </i>
          </li>
          )
        })}
        </ul>
      </Modal>

      <Modal
        maskClosable={false}
        title={t('wallet')}
        centered
        open={paymentIdModal}
        onOk={() => setPaymentIdModal(false)}
        onCancel={() => {
          setPaymentIdModal(false)
          onCancelbutton()
        }}
        footer={null}
      >
        <h3>
          {t('payout_method')} - {t(paytmOptions.name)}
        </h3>
        <div className='input_data'>
          <input
            type='text'
            placeholder={paytmOptions.placeholder}
            value={inputId}
            onChange={event => handleMerchantIdChange(event)}
          />
        </div>
        <div className='make_payment text-end mt-3'>
          <button className='btn btn-primary' onClick={event => makeRequest(event, paytmOptions.name)}>
            {t('make_req')}
          </button>
        </div>
      </Modal>
    </Layout>
  )
}

export default withTranslation()(Wallet)
